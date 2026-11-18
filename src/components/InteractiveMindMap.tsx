import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Info,
  Maximize2,
  Minimize2,
  Printer,
  RotateCcw,
  Scan,
  Search,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useAppPreferences } from '../context/AppPreferencesContext';
import type { PptMindMapData, PptMindMapNode } from '../types';
import { exportMindMapToPng } from '../utils/exportMindMapPng';
import {
  collectAllNodeIds,
  computeMindMapLayout,
  findNodeById,
  getNodeColors,
  searchMindMapNodes,
} from '../utils/pptTree';

interface InteractiveMindMapProps {
  data: PptMindMapData | null;
  isUploading: boolean;
  errorMessage: string | null;
  onUploadFile: (file: File) => void;
  onClearError: () => void;
}

const LEVEL_LABELS: Record<0 | 1 | 2 | 3, string> = {
  0: 'Central Subject',
  1: 'Primary Topic',
  2: 'Subtopic',
  3: 'Term & Concept',
};

const KIDS_NODE_BG: Array<{ bg: string; tint: string; border: string; badge: string }> = [
  { bg: '#FFD6E0', tint: '#FFEBF0', border: '#E489A4', badge: '#FFF7FA' },
  { bg: '#FFF1A8', tint: '#FFF8D1', border: '#D9B943', badge: '#FFFDF2' },
  { bg: '#FFE0C2', tint: '#FFF0E0', border: '#E29E63', badge: '#FFF9F3' },
  { bg: '#EFE4FF', tint: '#F6F0FF', border: '#B99CEB', badge: '#FBF8FF' },
  { bg: '#DCF7EA', tint: '#EEFCF5', border: '#87CFAF', badge: '#F6FEFA' },
  { bg: '#FFDCE9', tint: '#FFF0F6', border: '#E395B4', badge: '#FFF8FB' },
];

const DARK_NODE_BG: Array<{ bg: string; tint: string; leaf: string; badge: string }> = [
  { bg: '#16241d', tint: '#131d18', leaf: '#14171b', badge: '#21352b' },
  { bg: '#241f15', tint: '#1c1811', leaf: '#14171b', badge: '#342c1d' },
  { bg: '#152026', tint: '#121a1f', leaf: '#14171b', badge: '#1f3039' },
  { bg: '#241918', tint: '#1c1413', leaf: '#14171b', badge: '#362422' },
  { bg: '#1d1b29', tint: '#161520', leaf: '#14171b', badge: '#2c283d' },
  { bg: '#232014', tint: '#1c1910', leaf: '#14171b', badge: '#332e1c' },
];

export const InteractiveMindMap: React.FC<InteractiveMindMapProps> = ({
  data,
  isUploading,
  errorMessage,
  onUploadFile,
  onClearError,
}) => {
  const { theme } = useAppPreferences();
  const isKids = theme === 'kids';
  const isDark = theme === 'dark';
  const iconStroke = isKids ? 2 : 1.5;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(['root']));
  const [selectedId, setSelectedId] = useState<string>('root');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMatchIdx, setActiveMatchIdx] = useState(0);

  const [zoom, setZoom] = useState(0.95);
  const [pan, setPan] = useState({ x: 20, y: 20 });
  const [isPanning, setIsPanning] = useState(false);
  const panOriginRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);
  const didDragRef = useRef(false);

  const [isExportingPng, setIsExportingPng] = useState(false);

  useEffect(() => {
    if (!data) return;
    const initialExpanded = new Set<string>(['root']);
    for (const branch of data.root.children) {
      initialExpanded.add(branch.id);
    }
    setExpandedIds(initialExpanded);
    setSelectedId('root');
    setSearchQuery('');
    setActiveMatchIdx(0);
    setZoom(0.92);
    setPan({ x: 24, y: 24 });
  }, [data]);

  const { matchIds, ancestorIds } = useMemo(() => {
    if (!data) return { matchIds: [] as string[], ancestorIds: new Set<string>() };
    return searchMindMapNodes(data.root, searchQuery);
  }, [data, searchQuery]);

  const matchSet = useMemo(() => new Set(matchIds), [matchIds]);

  useEffect(() => {
    if (!searchQuery.trim() || ancestorIds.size === 0) return;
    setExpandedIds((prev) => {
      const next = new Set(prev);
      for (const id of ancestorIds) {
        next.add(id);
      }
      return next;
    });
    setActiveMatchIdx(0);
  }, [searchQuery, ancestorIds]);

  const layout = useMemo(() => {
    if (!data) return null;
    return computeMindMapLayout(data.root, expandedIds);
  }, [data, expandedIds]);

  const selectedNode: PptMindMapNode | null = useMemo(() => {
    if (!data) return null;
    return findNodeById(data.root, selectedId) ?? data.root;
  }, [data, selectedId]);

  const handleFitToScreen = useCallback(() => {
    if (!layout || !viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const scaleX = (rect.width - 32) / layout.width;
    const scaleY = (rect.height - 32) / layout.height;
    const nextZoom = Math.min(1.15, Math.max(0.35, Math.min(scaleX, scaleY)));

    const offsetX = Math.max(16, (rect.width - layout.width * nextZoom) / 2);
    const offsetY = Math.max(16, (rect.height - layout.height * nextZoom) / 2);

    setZoom(Number(nextZoom.toFixed(2)));
    setPan({ x: offsetX, y: offsetY });
  }, [layout]);

  const handleResetView = useCallback(() => {
    if (!data) return;
    const initialExpanded = new Set<string>(['root']);
    for (const branch of data.root.children) {
      initialExpanded.add(branch.id);
    }
    setExpandedIds(initialExpanded);
    setSelectedId('root');
    setSearchQuery('');
    setZoom(0.92);
    setPan({ x: 24, y: 24 });
  }, [data]);

  const handleExpandAll = () => {
    if (!data) return;
    setExpandedIds(new Set(collectAllNodeIds(data.root)));
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set(['root']));
    setSelectedId('root');
    setZoom(0.95);
    setPan({ x: 24, y: 24 });
  };

  const handleNodeClick = (node: PptMindMapNode) => {
    if (didDragRef.current) return;
    setSelectedId(node.id);
    if (node.children.length > 0) {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        if (next.has(node.id)) {
          next.delete(node.id);
        } else {
          next.add(node.id);
        }
        return next;
      });
    }
  };

  const focusNodeInViewport = useCallback(
    (nodeId: string) => {
      if (!layout || !viewportRef.current) return;
      const target = layout.nodes.find((n) => n.node.id === nodeId);
      if (!target) return;
      const rect = viewportRef.current.getBoundingClientRect();
      const centerX = target.x + target.width / 2;
      const centerY = target.y + target.height / 2;
      setPan({
        x: rect.width / 2 - centerX * zoom,
        y: rect.height / 2 - centerY * zoom,
      });
      setSelectedId(nodeId);
    },
    [layout, zoom],
  );

  const handleStepMatch = (direction: 1 | -1) => {
    if (matchIds.length === 0) return;
    const nextIdx = (activeMatchIdx + direction + matchIds.length) % matchIds.length;
    setActiveMatchIdx(nextIdx);
    focusNodeInViewport(matchIds[nextIdx]);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button[data-node-id]')) {
      return;
    }
    didDragRef.current = false;
    setIsPanning(true);
    panOriginRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanning || !panOriginRef.current) return;
    const dx = e.clientX - panOriginRef.current.startX;
    const dy = e.clientY - panOriginRef.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      didDragRef.current = true;
    }
    setPan({
      x: panOriginRef.current.panX + dx,
      y: panOriginRef.current.panY + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    setIsPanning(false);
    panOriginRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture wasn't active
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setZoom((prev) => Number(Math.min(1.8, Math.max(0.35, prev + delta)).toFixed(2)));
  };

  const handleFilePicked = (file: File | undefined) => {
    if (!file) return;
    onClearError();
    onUploadFile(file);
  };

  const handleExportPng = async () => {
    if (!data) return;
    setIsExportingPng(true);
    try {
      await exportMindMapToPng(data, expandedIds);
    } finally {
      setIsExportingPng(false);
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const hiddenFileInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
      onChange={(e) => {
        const picked = e.target.files?.[0];
        handleFilePicked(picked);
        e.target.value = '';
      }}
      className="hidden"
    />
  );

  // Loading state
  if (isUploading) {
    return (
      <section
        className={`${isKids ? 'rounded-[24px] border-2 border-dashed border-[#f3c4d6]' : 'rounded-[10px] border border-[var(--line)]'} bg-[var(--card-bg)] px-6 py-16 text-center shadow-[var(--shadow-card)]`}
      >
        {hiddenFileInput}
        <div
          className={`mx-auto mb-3 w-12 h-12 ${isKids ? 'rounded-[20px] bg-[#FFD6E0] border-2 border-[#eb9bb1] text-[#4a2b4f]' : 'rounded-lg bg-[var(--accent-soft)] text-[var(--accent-text)]'} flex items-center justify-center animate-pulse`}
        >
          <FileText className="w-5 h-5" strokeWidth={iconStroke} />
        </div>
        <h3
          className={`font-display text-[var(--ink)] mb-1.5 ${
            isKids ? 'text-[1.72rem] font-bold' : 'text-2xl font-medium'
          }`}
        >
          Reading your slides
        </h3>
        <p className="text-sm text-[var(--muted-2)] max-w-[420px] mx-auto leading-relaxed">
          Extracting topics, subtopics, formulas, and slide terminology into an interactive study mind map.
        </p>
      </section>
    );
  }

  // Empty / upload dropzone state
  if (!data) {
    return (
      <section>
        {hiddenFileInput}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingFile(true);
          }}
          onDragLeave={() => setIsDraggingFile(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingFile(false);
            const dropped = e.dataTransfer.files?.[0];
            handleFilePicked(dropped);
          }}
          className={`${isKids ? 'rounded-[26px] border-2 border-dashed shadow-[var(--shadow-card)]' : 'rounded-[10px] border border-dashed'} px-6 py-16 text-center transition-colors ${
            isDraggingFile
              ? 'border-[var(--accent-bg)] bg-[var(--accent-soft)]/50'
              : 'border-[var(--line)] bg-[var(--card-bg)]'
          }`}
        >
          <div
            className={`mx-auto mb-4 w-12 h-12 ${isKids ? 'rounded-[20px] bg-[#FFF1A8] border-2 border-[#e6ca5a] text-[#4a2b4f]' : 'rounded-lg border-[var(--line)] bg-[var(--accent-soft)] text-[var(--accent-text)]'} border flex items-center justify-center`}
          >
            <Upload className="w-5 h-5" strokeWidth={iconStroke} />
          </div>
          <h3
            className={`font-display text-[var(--ink)] mb-2 ${
              isKids ? 'text-[1.72rem] font-bold' : 'text-2xl font-medium'
            }`}
          >
            Interactive mind map from presentations
          </h3>
          <p className="text-sm text-[var(--muted-2)] max-w-[480px] mx-auto mb-6 leading-relaxed">
            Upload any <span className="font-semibold text-[var(--ink)]">.ppt</span> or{' '}
            <span className="font-semibold text-[var(--ink)]">.pptx</span> lecture deck to generate a hierarchical, searchable concept map with slide-referenced definitions and formulas.
          </p>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`inline-flex items-center gap-2 font-medium transition-colors cursor-pointer ${
              isKids
                ? 'kids-sticker-hover px-7 py-3.5 rounded-full text-base bg-[#FFD6E0] border-2 border-[#eb9bb1] text-[#4a2b4f] hover:bg-[#ffcad7] shadow-[var(--shadow-card)]'
                : 'px-5 py-2.5 rounded-md text-sm bg-[var(--accent-bg)] text-white hover:bg-[var(--accent-hover)]'
            }`}
          >
            <Upload className="w-4 h-4" strokeWidth={iconStroke} />
            <span>Upload PPT / PPTX</span>
          </button>

          <p className={`mt-4 text-[var(--muted-1)] ${isKids ? 'kids-crayon text-sm font-bold' : 'eyebrow-mono'}`}>
            Multi-slide decks · Formulas · Speaker notes
          </p>

          {errorMessage && (
            <div
              role="alert"
              className={`mt-5 max-w-[480px] mx-auto ${isKids ? 'rounded-[20px]' : 'rounded-md'} border border-red-400/40 bg-red-500/10 px-4 py-3 text-xs text-red-600 dark:text-red-300 font-medium`}
            >
              {errorMessage}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      {hiddenFileInput}

      {/* Presentation summary bar */}
      <div
        className={`no-print ${isKids ? 'rounded-[24px] border-2 border-dashed border-[#f3c4d6]' : 'rounded-[10px] border border-[var(--line)]'} bg-[var(--card-bg)] px-4 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-[var(--shadow-card)]`}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-[var(--muted-2)] flex-wrap">
            <span className="font-medium text-[var(--accent-text)]">
              {data.subjectArea}
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {data.totalSlides} slides · {data.root.children.length} main topics
            </span>
          </div>
          <h3
            className={`font-display leading-tight text-[var(--ink)] mt-1 truncate ${
              isKids ? 'text-[1.42rem] font-bold' : 'text-xl font-medium'
            }`}
          >
            {data.presentationTitle}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`inline-flex items-center gap-1.5 font-medium transition-colors cursor-pointer shrink-0 ${
            isKids
              ? 'px-4 py-2 rounded-full text-sm border border-[#e6ca5a] bg-[#FFF1A8] text-[#4a2b4f] hover:bg-[#ffec8f]'
              : 'px-3 py-1.5 rounded-md text-xs border border-[var(--line)] bg-[var(--sidebar-bg)] text-[var(--ink)] hover:bg-[var(--surface-hover)]'
          }`}
        >
          <Upload className="w-3.5 h-3.5" strokeWidth={iconStroke} />
          <span>Upload another PPT</span>
        </button>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className={`no-print ${isKids ? 'rounded-[20px]' : 'rounded-md'} border border-red-400/40 bg-red-500/10 px-4 py-2.5 text-xs text-red-600 dark:text-red-300 flex items-center justify-between gap-3`}
        >
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={onClearError}
            className="hover:opacity-70 cursor-pointer"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" strokeWidth={iconStroke} />
          </button>
        </div>
      )}

      {/* Interactive Toolbar */}
      <div
        className={`no-print ${isKids ? 'rounded-[24px] border-2 border-dashed border-[#f3c4d6]' : 'rounded-[10px] border border-[var(--line)]'} bg-[var(--sidebar-bg)] p-2.5 flex flex-wrap items-center justify-between gap-2.5`}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={handleExpandAll}
            className={`inline-flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
              isKids
                ? 'px-3.5 py-2 rounded-full text-sm border border-[#eb9bb1] bg-[#FFD6E0] text-[#4a2b4f] hover:bg-[#ffcad7]'
                : 'px-2.5 py-1.5 rounded-md text-xs border border-[var(--line)] bg-[var(--card-bg)] text-[var(--ink)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5 text-[var(--accent-text)]" strokeWidth={iconStroke} />
            <span>Expand all</span>
          </button>
          <button
            type="button"
            onClick={handleCollapseAll}
            className={`inline-flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
              isKids
                ? 'px-3.5 py-2 rounded-full text-sm border border-[#eab27e] bg-[#FFE0C2] text-[#4a2b4f] hover:bg-[#ffd5ad]'
                : 'px-2.5 py-1.5 rounded-md text-xs border border-[var(--line)] bg-[var(--card-bg)] text-[var(--ink)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            <Minimize2 className="w-3.5 h-3.5 text-[var(--muted-2)]" strokeWidth={iconStroke} />
            <span>Collapse all</span>
          </button>

          <div className="h-5 w-px bg-[var(--line)] mx-0.5 hidden sm:block" />

          <div
            className={`inline-flex items-center ${isKids ? 'rounded-full border-[#f3c4d6]' : 'rounded-md border-[var(--line)]'} border bg-[var(--card-bg)] overflow-hidden`}
          >
            <button
              type="button"
              onClick={() => setZoom((z) => Number(Math.max(0.35, z - 0.12).toFixed(2)))}
              className={`${isKids ? 'p-2' : 'p-1.5'} text-[var(--ink)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer`}
              title="Zoom out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" strokeWidth={iconStroke} />
            </button>
            <span className="px-2 font-dm-mono text-[11px] text-[var(--muted-3)] tabular-nums select-none">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Number(Math.min(1.8, z + 0.12).toFixed(2)))}
              className={`${isKids ? 'p-2' : 'p-1.5'} text-[var(--ink)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer`}
              title="Zoom in"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" strokeWidth={iconStroke} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleFitToScreen}
            className={`inline-flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
              isKids
                ? 'px-3.5 py-2 rounded-full text-sm border border-[#e6ca5a] bg-[#FFF1A8] text-[#4a2b4f] hover:bg-[#ffec8f]'
                : 'px-2.5 py-1.5 rounded-md text-xs border border-[var(--line)] bg-[var(--card-bg)] text-[var(--ink)] hover:bg-[var(--surface-hover)]'
            }`}
            title="Fit mind map to screen"
          >
            <Scan className="w-3.5 h-3.5 text-[var(--accent-text)]" strokeWidth={iconStroke} />
            <span>Fit</span>
          </button>
          <button
            type="button"
            onClick={handleResetView}
            className={`inline-flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
              isKids
                ? 'px-3.5 py-2 rounded-full text-sm border border-[#f3c4d6] bg-[var(--card-bg)] text-[#4a2b4f] hover:bg-[var(--surface-hover)]'
                : 'px-2.5 py-1.5 rounded-md text-xs border border-[var(--line)] bg-[var(--card-bg)] text-[var(--muted-2)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)]'
            }`}
            title="Reset view"
          >
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={iconStroke} />
            <span>Reset</span>
          </button>
        </div>

        {/* Search & Export */}
        <div className="flex flex-wrap items-center gap-2 flex-1 min-[900px]:flex-initial justify-end">
          <div className="relative flex items-center flex-1 sm:flex-initial min-w-[190px] max-w-[270px]">
            <Search
              className="w-3.5 h-3.5 text-[var(--muted-1)] absolute left-3 pointer-events-none"
              strokeWidth={iconStroke}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concept or term…"
              className={`w-full ${isKids ? 'rounded-full py-2' : 'rounded-md py-1.5'} border border-[var(--line)] bg-[var(--card-bg)] pl-8 pr-16 text-xs text-[var(--ink)] placeholder:text-[var(--muted-1)] focus:outline-none focus:border-[var(--accent-bg)]`}
            />
            {searchQuery && (
              <div className="absolute right-2 flex items-center gap-0.5">
                <span className="font-dm-mono text-[10px] text-[var(--muted-3)] tabular-nums mr-0.5">
                  {matchIds.length > 0 ? `${activeMatchIdx + 1}/${matchIds.length}` : '0'}
                </span>
                {matchIds.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleStepMatch(-1)}
                      className="p-0.5 rounded hover:bg-[var(--surface-hover)] text-[var(--muted-3)] cursor-pointer"
                      aria-label="Previous search result"
                    >
                      <ChevronLeft className="w-3 h-3" strokeWidth={iconStroke} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStepMatch(1)}
                      className="p-0.5 rounded hover:bg-[var(--surface-hover)] text-[var(--muted-3)] cursor-pointer"
                      aria-label="Next search result"
                    >
                      <ChevronRight className="w-3 h-3" strokeWidth={iconStroke} />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-0.5 rounded hover:bg-[var(--surface-hover)] text-[var(--muted-1)] cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" strokeWidth={iconStroke} />
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleExportPng}
            disabled={isExportingPng}
            className={`inline-flex items-center gap-1.5 font-medium disabled:opacity-40 cursor-pointer ${
              isKids
                ? 'px-4 py-2 rounded-full text-sm bg-[#FFD6E0] border border-[#eb9bb1] text-[#4a2b4f] hover:bg-[#ffcad7]'
                : 'px-2.5 py-1.5 rounded-md text-xs bg-[var(--accent-bg)] text-white hover:bg-[var(--accent-hover)]'
            }`}
          >
            <Download className="w-3.5 h-3.5" strokeWidth={iconStroke} />
            <span>{isExportingPng ? 'PNG…' : 'PNG'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrintPdf}
            className={`inline-flex items-center gap-1.5 font-medium cursor-pointer ${
              isKids
                ? 'px-4 py-2 rounded-full text-sm bg-[#FFF1A8] border border-[#e6ca5a] text-[#4a2b4f] hover:bg-[#ffec8f]'
                : 'px-2.5 py-1.5 rounded-md text-xs border border-[var(--line)] bg-[var(--card-bg)] text-[var(--ink)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            <Printer className="w-3.5 h-3.5" strokeWidth={iconStroke} />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Main Split Workspace: Interactive Canvas + Definition Panel */}
      <div className="no-print grid grid-cols-1 min-[1060px]:grid-cols-[1fr_330px] gap-4 items-start">
        {/* Pan & Zoom Tree Canvas */}
        <div
          ref={viewportRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          className={`relative h-[520px] min-[851px]:h-[580px] ${isKids ? 'rounded-[24px] border-2 border-dashed border-[#f3c4d6]' : 'rounded-[10px] border border-[var(--line)]'} overflow-hidden select-none touch-none ${
            isPanning ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            background: 'var(--canvas-bg)',
          }}
        >
          {/* Subtle dot grid pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-45"
            style={{
              backgroundImage: 'radial-gradient(var(--canvas-dot) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          {/* Transformed Mind Map Layer */}
          {layout && (
            <div
              className={isPanning ? '' : 'transition-transform duration-150 ease-out'}
              style={{
                width: layout.width,
                height: layout.height,
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: '0 0',
              }}
            >
              {/* Curved Bezier Connector Lines */}
              <svg
                width={layout.width}
                height={layout.height}
                className="absolute inset-0 pointer-events-none"
              >
                {layout.edges.map((edge) => {
                  const midX = (edge.fromX + edge.toX) / 2;
                  const pathD = `M ${edge.fromX} ${edge.fromY} C ${midX} ${edge.fromY}, ${midX} ${edge.toY}, ${edge.toX} ${edge.toY}`;
                  return (
                    <path
                      key={edge.id}
                      d={pathD}
                      fill="none"
                      stroke={edge.color}
                      strokeWidth={1.75}
                      strokeLinecap="round"
                      className="transition-all duration-200"
                    />
                  );
                })}
              </svg>

              {/* Clickable Nodes */}
              {layout.nodes.map(({ node, x, y, width, height }) => {
                const scheme = getNodeColors(node);
                const kidsScheme =
                  node.level === 0
                    ? { bg: '#EFE4FF', tint: '#F6F0FF', border: '#B99CEB', badge: '#FFFDF2' }
                    : KIDS_NODE_BG[node.branchIndex % KIDS_NODE_BG.length];
                const darkScheme =
                  node.level === 0
                    ? { bg: '#16241d', tint: '#131d18', leaf: '#14171b', badge: '#21352b' }
                    : DARK_NODE_BG[node.branchIndex % DARK_NODE_BG.length];

                const isSelected = selectedId === node.id;
                const isExpanded = expandedIds.has(node.id);
                const hasChildren = node.children.length > 0;
                const isSearchMatch = searchQuery.trim().length > 0 && matchSet.has(node.id);
                const isDimmed =
                  searchQuery.trim().length > 0 &&
                  matchIds.length > 0 &&
                  !matchSet.has(node.id) &&
                  !ancestorIds.has(node.id);

                const bgColor = isDark
                  ? node.level <= 1
                    ? darkScheme.bg
                    : node.level === 2
                      ? darkScheme.tint
                      : darkScheme.leaf
                  : isKids
                    ? node.level <= 1
                      ? kidsScheme.bg
                      : node.level === 2
                        ? kidsScheme.tint
                        : '#FFFDF5'
                    : node.level <= 1
                      ? scheme.bg
                      : node.level === 2
                        ? scheme.tintBg
                        : '#ffffff';

                const badgeBg = isDark
                  ? darkScheme.badge
                  : isKids
                    ? kidsScheme.badge
                    : scheme.badgeBg;
                const nodeTextColor = isDark ? '#f1f0ec' : isKids ? '#4a2b4f' : '#1b1c19';
                const borderColor = isSearchMatch
                  ? '#ca8a04'
                  : isDark
                    ? node.level === 0
                      ? '#4c7d65'
                      : scheme.border
                    : isKids
                      ? kidsScheme.border
                      : scheme.border;

                return (
                  <button
                    key={node.id}
                    type="button"
                    data-node-id={node.id}
                    onClick={() => handleNodeClick(node)}
                    style={{
                      left: x,
                      top: y,
                      width,
                      height,
                      backgroundColor: bgColor,
                      borderColor,
                    }}
                    className={`absolute ${isKids ? 'rounded-[20px] border-2' : 'rounded-lg border'} px-3 py-1.5 text-left flex flex-col justify-center transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-[var(--accent-bg)] ring-offset-2 ring-offset-[var(--paper)] shadow-sm'
                        : isSearchMatch
                          ? 'ring-2 ring-amber-500 ring-offset-1 shadow-sm'
                          : 'hover:shadow-sm'
                    } ${isDimmed ? 'opacity-40' : 'opacity-100'}`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span
                        style={{ color: nodeTextColor }}
                        className={`leading-tight line-clamp-2 ${
                          node.level === 0
                            ? 'font-display font-medium text-[15px]'
                            : node.level === 1
                              ? 'font-semibold text-[12.5px]'
                              : 'font-medium text-[11.5px]'
                        }`}
                      >
                        {node.label}
                      </span>

                      {hasChildren && (
                        <span
                          className={`shrink-0 inline-flex items-center justify-center ${isKids ? 'rounded-full' : 'rounded-md'} px-1.5 py-0.5 font-dm-mono text-[9px] font-medium`}
                          style={{
                            backgroundColor: badgeBg,
                            color: nodeTextColor,
                          }}
                          title={isExpanded ? 'Collapse branch' : 'Expand branch'}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-2.5 h-2.5" strokeWidth={iconStroke} />
                          ) : (
                            `+${node.children.length}`
                          )}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      {node.slideNumbers.length > 0 && (
                        <span className="font-dm-mono text-[8.5px] uppercase tracking-[0.6px] text-[var(--muted-2)]">
                          S{node.slideNumbers[0]}
                          {node.slideNumbers.length > 1
                            ? `–${node.slideNumbers[node.slideNumbers.length - 1]}`
                            : ''}
                        </span>
                      )}
                      {node.formula && (
                        <span className="font-dm-mono text-[8.5px] px-1 rounded bg-[var(--chip-bg)] text-[var(--active-tab-text)]">
                          fx
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Subtle bottom-left pan/zoom hint */}
          <div
            className={`absolute bottom-3 left-3 pointer-events-none ${isKids ? 'rounded-full px-3.5' : 'rounded-md px-2.5'} bg-[var(--card-bg)]/90 border border-[var(--line)] py-1 text-[11px] text-[var(--muted-2)]`}
          >
            Drag to pan · Click node to inspect and expand
          </div>
        </div>

        {/* Dynamic Definition Panel */}
        {selectedNode && (
          <aside
            aria-label="Concept definition panel"
            className={`${isKids ? 'rounded-[24px] border-2 border-dashed border-[#f3c4d6]' : 'rounded-[10px] border border-[var(--line)]'} bg-[var(--card-bg)] p-5 flex flex-col gap-4 shadow-[var(--shadow-card)]`}
          >
            {/* Header + Slide & Source */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--muted-2)] mb-2">
                <span className="font-medium">{LEVEL_LABELS[selectedNode.level]}</span>
                {selectedNode.slideNumbers.length > 0 && (
                  <span className="font-dm-mono text-[11px] text-[var(--muted-1)] tabular-nums">
                    {selectedNode.slideNumbers.length === 1
                      ? `Slide ${selectedNode.slideNumbers[0]}`
                      : `Slides ${selectedNode.slideNumbers.join(', ')}`}
                  </span>
                )}
              </div>

              <h4
                className={`font-display leading-[1.2] text-[var(--ink)] ${
                  isKids ? 'text-[1.72rem] font-bold' : 'text-2xl font-medium'
                }`}
              >
                {selectedNode.label}
              </h4>

              <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent-text)]">
                {selectedNode.definitionSource === 'slide' ? (
                  <>
                    <Check className="w-3.5 h-3.5" strokeWidth={iconStroke} />
                    <span>From slide content</span>
                  </>
                ) : (
                  <>
                    <Info className="w-3.5 h-3.5" strokeWidth={iconStroke} />
                    <span>Contextual explanation</span>
                  </>
                )}
              </div>
            </div>

            {/* Definition */}
            <div>
              <div className="eyebrow-mono text-[var(--muted-1)] mb-1">Definition</div>
              <p className="text-sm leading-relaxed text-[var(--ink-secondary)]">
                {selectedNode.definition || 'No definition available in the slide text.'}
              </p>
            </div>

            {/* Formula / Code Syntax if present */}
            {selectedNode.formula && (
              <div
                className={`${isKids ? 'rounded-2xl' : 'rounded-md'} border border-[var(--line)] bg-[var(--sidebar-bg)] p-3`}
              >
                <div className="eyebrow-mono text-[var(--accent-text)] mb-1">
                  Formula / Syntax
                </div>
                <pre className="font-dm-mono text-xs leading-relaxed text-[var(--ink)] whitespace-pre-wrap break-words m-0">
                  {selectedNode.formula}
                </pre>
              </div>
            )}

            {/* Terminology & Keywords */}
            {selectedNode.terminology.length > 0 && (
              <div>
                <div className="eyebrow-mono text-[var(--muted-1)] mb-1.5">
                  Terminology &amp; Keywords
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.terminology.map((term, idx) => (
                    <span
                      key={`${term}-${idx}`}
                      className={`px-2.5 py-0.5 ${isKids ? 'rounded-full' : 'rounded-md'} border border-[var(--line)] bg-[var(--sidebar-bg)] text-xs font-medium text-[var(--ink)]`}
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Points */}
            {selectedNode.keyPoints.length > 0 && (
              <div>
                <div className="eyebrow-mono text-[var(--muted-1)] mb-1.5">
                  Key points
                </div>
                <ul className="space-y-1.5 pl-4 list-disc text-xs leading-relaxed text-[var(--ink-secondary)]">
                  {selectedNode.keyPoints.map((pt, idx) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Example */}
            {selectedNode.example && (
              <div
                className={`${isKids ? 'rounded-2xl' : 'rounded-md'} border border-[var(--line)] bg-[var(--accent-soft)]/50 p-3`}
              >
                <div className="eyebrow-mono text-[var(--accent-text)] mb-1">Example</div>
                <p className="text-xs leading-relaxed text-[var(--ink-secondary)]">
                  {selectedNode.example}
                </p>
              </div>
            )}

            {/* Child concepts quick-navigation */}
            {selectedNode.children.length > 0 && (
              <div className="pt-2 border-t border-[var(--line)]">
                <div className="eyebrow-mono text-[var(--muted-1)] mb-1.5">
                  Connected sub-concepts ({selectedNode.children.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.children.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => {
                        setExpandedIds((prev) => new Set(prev).add(selectedNode.id));
                        setSelectedId(child.id);
                      }}
                      className={`px-3 py-1 ${isKids ? 'rounded-full' : 'rounded-md'} border border-[var(--line)] bg-[var(--paper)] hover:bg-[var(--active-tab-bg)] hover:border-[var(--accent-bg)] text-xs font-medium text-[var(--ink)] transition-colors cursor-pointer`}
                    >
                      {child.label} →
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Print-only structured PDF study sheet */}
      <div className="hidden print:block mt-4">
        <div className="mb-4 pb-3 border-b border-[#e6e3da]">
          <div className="eyebrow-mono text-[#595b53]">
            Educational Mind Map Study Sheet · {data.subjectArea} · {data.totalSlides} slides
          </div>
          <h2 className="font-display font-medium text-2xl text-[#1b1c19] mt-1">
            {data.presentationTitle}
          </h2>
          <p className="text-xs text-[#64665e] mt-1">{data.root.definition}</p>
        </div>

        <div className="space-y-4">
          {data.root.children.map((primary, pIdx) => (
            <div
              key={primary.id}
              className="rounded-md border border-[#e6e3da] p-4 break-inside-avoid"
            >
              <h3 className="font-display font-medium text-lg text-[#1b1c19]">
                {pIdx + 1}. {primary.label}
                {primary.slideNumbers.length > 0 && (
                  <span className="font-dm-mono text-[10px] text-[#595b53] ml-2">
                    (Slides {primary.slideNumbers.join(', ')})
                  </span>
                )}
              </h3>
              <p className="text-xs text-[#454741] mt-1">{primary.definition}</p>
              {primary.formula && (
                <p className="font-dm-mono text-[11px] bg-[#f4f2ed] px-2 py-1 mt-1.5 rounded">
                  Formula: {primary.formula}
                </p>
              )}

              {primary.children.length > 0 && (
                <div className="mt-3 pl-4 border-l border-[#e6e3da] space-y-2.5">
                  {primary.children.map((sec) => (
                    <div key={sec.id} className="break-inside-avoid">
                      <div className="font-semibold text-[13px] text-[#1b1c19]">
                        {sec.label}
                        {sec.slideNumbers.length > 0 && (
                          <span className="font-dm-mono text-[9.5px] text-[#595b53] ml-2">
                            [Slide {sec.slideNumbers.join(', ')}]
                          </span>
                        )}
                      </div>
                      <p className="text-[11.5px] text-[#454741]">{sec.definition}</p>
                      {sec.formula && (
                        <p className="font-dm-mono text-[10.5px] bg-[#f4f2ed] px-2 py-1 mt-1 rounded">
                          {sec.formula}
                        </p>
                      )}
                      {sec.children.length > 0 && (
                        <ul className="mt-1.5 pl-4 list-disc space-y-1 text-[11px] text-[#1b1c19]">
                          {sec.children.map((ter) => (
                            <li key={ter.id}>
                              <span className="font-semibold">{ter.label}:</span> {ter.definition}
                              {ter.formula ? ` [${ter.formula}]` : ''}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
