import type { DefinitionSource, PptMindMapData, PptMindMapNode } from '../types';

export interface BranchColorScheme {
  name: string;
  bg: string;
  tintBg: string;
  border: string;
  line: string;
  text: string;
  badgeBg: string;
}

export const CENTRAL_STYLE: BranchColorScheme = {
  name: 'Central',
  bg: '#e8eee3',
  tintBg: '#f3f7ef',
  border: '#496c4e',
  line: '#496c4e',
  text: '#292a24',
  badgeBg: '#d8e4cf',
};

export const BRANCH_PALETTE: BranchColorScheme[] = [
  {
    name: 'Sage',
    bg: '#e8eee3',
    tintBg: '#f4f7f1',
    border: '#5e8263',
    line: '#7aa07f',
    text: '#292a24',
    badgeBg: '#d8e4cf',
  },
  {
    name: 'Ochre',
    bg: '#f5ebd1',
    tintBg: '#fbf6e8',
    border: '#b5923e',
    line: '#c9a857',
    text: '#292a24',
    badgeBg: '#ecdcaf',
  },
  {
    name: 'Sky',
    bg: '#dce8eb',
    tintBg: '#eff6f8',
    border: '#4e7f8e',
    line: '#6b9aa8',
    text: '#292a24',
    badgeBg: '#c5dce2',
  },
  {
    name: 'Terracotta',
    bg: '#f0dfd9',
    tintBg: '#faf2ef',
    border: '#ad6b57',
    line: '#c28471',
    text: '#292a24',
    badgeBg: '#e4c7bd',
  },
  {
    name: 'Lavender',
    bg: '#e2dff0',
    tintBg: '#f4f2fa',
    border: '#6e659c',
    line: '#8a82b5',
    text: '#292a24',
    badgeBg: '#cfc9e6',
  },
  {
    name: 'Meadow',
    bg: '#f1e5b3',
    tintBg: '#faf6e1',
    border: '#998636',
    line: '#b3a050',
    text: '#292a24',
    badgeBg: '#e6d48a',
  },
];

export function getNodeColors(node: PptMindMapNode): BranchColorScheme {
  if (node.level === 0) return CENTRAL_STYLE;
  return BRANCH_PALETTE[node.branchIndex % BRANCH_PALETTE.length];
}

interface RawApiNode {
  label?: string;
  terminology?: string[];
  definition?: string;
  definition_source?: string;
  key_points?: string[];
  example?: string;
  formula?: string;
  slide_numbers?: number[];
  children?: RawApiNode[];
}

export interface RawPptApiResponse {
  fileName: string;
  presentation_title: string;
  subject_area: string;
  totalSlides: number;
  central_node: RawApiNode;
  primary_branches: RawApiNode[];
}

function normalizeNode(
  raw: RawApiNode,
  id: string,
  level: 0 | 1 | 2 | 3,
  branchIndex: number,
  children: PptMindMapNode[] = [],
): PptMindMapNode {
  const source: DefinitionSource =
    raw.definition_source === 'slide' ? 'slide' : 'contextual';
  return {
    id,
    label: (raw.label || 'Untitled Concept').trim(),
    level,
    branchIndex,
    terminology: Array.isArray(raw.terminology)
      ? raw.terminology.map((t) => String(t).trim()).filter(Boolean)
      : [],
    definition: (raw.definition || '').trim(),
    definitionSource: source,
    keyPoints: Array.isArray(raw.key_points)
      ? raw.key_points.map((k) => String(k).trim()).filter(Boolean)
      : [],
    example: (raw.example || '').trim(),
    formula: (raw.formula || '').trim(),
    slideNumbers: Array.isArray(raw.slide_numbers)
      ? Array.from(new Set(raw.slide_numbers.map((n) => Number(n)).filter((n) => Number.isFinite(n) && n > 0))).sort(
          (a, b) => a - b,
        )
      : [],
    children,
  };
}

export function buildMindMapData(raw: RawPptApiResponse): PptMindMapData {
  const branches: PptMindMapNode[] = (raw.primary_branches ?? []).map((p, pIdx) => {
    const secondaryNodes: PptMindMapNode[] = (p.children ?? []).map((s, sIdx) => {
      const tertiaryNodes: PptMindMapNode[] = (s.children ?? []).map((t, tIdx) =>
        normalizeNode(t, `n-${pIdx}-${sIdx}-${tIdx}`, 3, pIdx, []),
      );
      return normalizeNode(s, `n-${pIdx}-${sIdx}`, 2, pIdx, tertiaryNodes);
    });
    return normalizeNode(p, `n-${pIdx}`, 1, pIdx, secondaryNodes);
  });

  const root = normalizeNode(
    raw.central_node ?? { label: raw.presentation_title },
    'root',
    0,
    0,
    branches,
  );

  return {
    fileName: raw.fileName,
    presentationTitle: raw.presentation_title || root.label,
    subjectArea: raw.subject_area || 'Presentation',
    totalSlides: raw.totalSlides || 1,
    root,
  };
}

export interface LayoutNode {
  node: PptMindMapNode;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayoutEdge {
  id: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  color: string;
}

export interface MindMapLayout {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  width: number;
  height: number;
}

const NODE_DIMENSIONS: Record<0 | 1 | 2 | 3, { width: number; height: number }> = {
  0: { width: 224, height: 76 },
  1: { width: 208, height: 64 },
  2: { width: 196, height: 56 },
  3: { width: 186, height: 50 },
};

const LEVEL_X: Record<0 | 1 | 2 | 3, number> = {
  0: 44,
  1: 332,
  2: 604,
  3: 862,
};

const ROW_GAP = 16;

export function computeMindMapLayout(
  root: PptMindMapNode,
  expandedIds: Set<string>,
): MindMapLayout {
  const layoutNodes: LayoutNode[] = [];
  const layoutEdges: LayoutEdge[] = [];

  function measureSubtreeHeight(node: PptMindMapNode): number {
    const dim = NODE_DIMENSIONS[node.level];
    const isExpanded = expandedIds.has(node.id);
    if (!isExpanded || node.children.length === 0) {
      return dim.height;
    }
    const childrenHeight = node.children.reduce(
      (sum, child, i) => sum + measureSubtreeHeight(child) + (i > 0 ? ROW_GAP : 0),
      0,
    );
    return Math.max(dim.height, childrenHeight);
  }

  function placeNode(node: PptMindMapNode, topY: number): { centerY: number; x: number; width: number; height: number } {
    const dim = NODE_DIMENSIONS[node.level];
    const subtreeH = measureSubtreeHeight(node);
    const x = LEVEL_X[node.level];
    const isExpanded = expandedIds.has(node.id);

    let nodeY = topY + (subtreeH - dim.height) / 2;

    if (isExpanded && node.children.length > 0) {
      const totalChildrenH = node.children.reduce(
        (sum, child, i) => sum + measureSubtreeHeight(child) + (i > 0 ? ROW_GAP : 0),
        0,
      );
      let cursorY = topY + (subtreeH - totalChildrenH) / 2;
      const childCenters: Array<{ child: PptMindMapNode; centerY: number; x: number }> = [];

      for (const child of node.children) {
        const childH = measureSubtreeHeight(child);
        const placedChild = placeNode(child, cursorY);
        childCenters.push({ child, centerY: placedChild.centerY, x: placedChild.x });
        cursorY += childH + ROW_GAP;
      }

      // Align parent vertically to midpoint of first and last child
      const firstY = childCenters[0].centerY;
      const lastY = childCenters[childCenters.length - 1].centerY;
      nodeY = (firstY + lastY) / 2 - dim.height / 2;

      const parentRightX = x + dim.width;
      const parentCenterY = nodeY + dim.height / 2;

      for (const cc of childCenters) {
        const colors = getNodeColors(cc.child);
        layoutEdges.push({
          id: `${node.id}->${cc.child.id}`,
          fromX: parentRightX,
          fromY: parentCenterY,
          toX: cc.x,
          toY: cc.centerY,
          color: colors.line,
        });
      }
    }

    layoutNodes.push({
      node,
      x,
      y: nodeY,
      width: dim.width,
      height: dim.height,
    });

    return {
      centerY: nodeY + dim.height / 2,
      x,
      width: dim.width,
      height: dim.height,
    };
  }

  const paddingY = 42;
  const totalHeight = measureSubtreeHeight(root);
  placeNode(root, paddingY);

  const maxRight = layoutNodes.reduce((m, n) => Math.max(m, n.x + n.width), 300);
  const maxBottom = layoutNodes.reduce((m, n) => Math.max(m, n.y + n.height), totalHeight);

  return {
    nodes: layoutNodes,
    edges: layoutEdges,
    width: maxRight + 64,
    height: maxBottom + paddingY,
  };
}

export function collectAllNodeIds(node: PptMindMapNode): string[] {
  const ids = [node.id];
  for (const child of node.children) {
    ids.push(...collectAllNodeIds(child));
  }
  return ids;
}

export function findNodeById(node: PptMindMapNode, id: string): PptMindMapNode | null {
  if (node.id === id) return node;
  for (const child of node.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

export function searchMindMapNodes(root: PptMindMapNode, rawQuery: string): {
  matchIds: string[];
  ancestorIds: Set<string>;
} {
  const q = rawQuery.trim().toLowerCase();
  if (!q) {
    return { matchIds: [], ancestorIds: new Set() };
  }

  const matchIds: string[] = [];
  const ancestorIds = new Set<string>();

  function visit(node: PptMindMapNode, ancestors: string[]) {
    const haystack = [
      node.label,
      node.definition,
      node.formula,
      node.example,
      ...node.terminology,
      ...node.keyPoints,
    ]
      .join(' ')
      .toLowerCase();

    if (haystack.includes(q)) {
      matchIds.push(node.id);
      for (const anc of ancestors) {
        ancestorIds.add(anc);
      }
    }

    for (const child of node.children) {
      visit(child, [...ancestors, node.id]);
    }
  }

  visit(root, []);
  return { matchIds, ancestorIds };
}
