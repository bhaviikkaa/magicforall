import type { PptMindMapData } from '../types';
import { computeMindMapLayout, getNodeColors } from './pptTree';

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && current) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines) {
        lines[maxLines - 1] = `${lines[maxLines - 1].slice(0, -1)}…`;
        return lines;
      }
    } else {
      current = candidate;
    }
  }

  if (current) {
    lines.push(current);
  }
  return lines.slice(0, maxLines);
}

export async function exportMindMapToPng(
  data: PptMindMapData,
  expandedIds: Set<string>,
): Promise<void> {
  try {
    await document.fonts.ready;
  } catch {
    // Fallback gracefully
  }

  const layout = computeMindMapLayout(data.root, expandedIds);
  const scale = 2;
  const headerH = 92;
  const canvasW = Math.max(960, layout.width);
  const canvasH = headerH + layout.height + 40;

  const canvas = document.createElement('canvas');
  canvas.width = canvasW * scale;
  canvas.height = canvasH * scale;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable.');
  }

  ctx.scale(scale, scale);

  // Paper background
  ctx.fillStyle = '#fbfaf6';
  ctx.fillRect(0, 0, canvasW, canvasH);

  // Header
  ctx.fillStyle = '#73736a';
  ctx.font = '500 10px "DM Mono", monospace';
  ctx.fillText(
    `INTERACTIVE MIND MAP  ·  ${data.subjectArea.toUpperCase()}  ·  ${data.totalSlides} SLIDES`,
    44,
    36,
  );

  ctx.fillStyle = '#292a24';
  ctx.font = '600 26px "Fraunces", Georgia, serif';
  ctx.fillText(data.presentationTitle, 44, 68);

  ctx.strokeStyle = '#e8e6de';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(44, headerH - 8);
  ctx.lineTo(canvasW - 44, headerH - 8);
  ctx.stroke();

  ctx.save();
  ctx.translate(0, headerH);

  // Draw edges
  for (const edge of layout.edges) {
    const midX = (edge.fromX + edge.toX) / 2;
    ctx.beginPath();
    ctx.moveTo(edge.fromX, edge.fromY);
    ctx.bezierCurveTo(midX, edge.fromY, midX, edge.toY, edge.toX, edge.toY);
    ctx.strokeStyle = edge.color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Draw nodes
  for (const item of layout.nodes) {
    const { node, x, y, width, height } = item;
    const scheme = getNodeColors(node);
    const fill = node.level <= 1 ? scheme.bg : node.level === 2 ? scheme.tintBg : '#fffefa';

    drawRoundedRect(ctx, x, y, width, height, 10);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = scheme.border;
    ctx.lineWidth = node.level === 0 ? 2 : 1.4;
    ctx.stroke();

    ctx.fillStyle = scheme.text;
    ctx.font =
      node.level === 0
        ? '600 14px "Fraunces", Georgia, serif'
        : node.level === 1
          ? '700 12.5px "DM Sans", sans-serif'
          : '600 11.5px "DM Sans", sans-serif';

    const lines = wrapTextLines(ctx, node.label, width - 24, 2);
    const lineHeight = node.level === 0 ? 17 : 15;
    const textStartY = y + (height - lines.length * lineHeight) / 2 + lineHeight - 3;

    lines.forEach((line, idx) => {
      ctx.fillText(line, x + 12, textStartY + idx * lineHeight);
    });

    if (node.slideNumbers.length > 0) {
      ctx.fillStyle = '#73736a';
      ctx.font = '500 8.5px "DM Mono", monospace';
      ctx.fillText(`S${node.slideNumbers[0]}`, x + width - 28, y + height - 7);
    }
  }

  ctx.restore();

  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  const slug = data.presentationTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  link.download = `${slug || 'ppt-mindmap'}-mindmap.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
