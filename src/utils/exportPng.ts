import type { SceneState } from '../types';

function prepareSvgForImage(svg: string): string {
  const openTagMatch = svg.match(/^<svg\b([^>]*)>/i);
  if (!openTagMatch) return svg;

  let attrs = openTagMatch[1]
    .replace(/\bwidth\s*=\s*(?:"[^"]*"|'[^']*')/gi, '')
    .replace(/\bheight\s*=\s*(?:"[^"]*"|'[^']*')/gi, '');

  if (!/\bxmlns\s*=/i.test(attrs)) {
    attrs += ' xmlns="http://www.w3.org/2000/svg"';
  }

  return `<svg width="500" height="360"${attrs}>${svg.slice(openTagMatch[0].length)}`;
}

function loadSvgAsImage(svg: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const normalized = prepareSvgForImage(svg);
    const blob = new Blob([normalized], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
): number {
  const words = text.split(/\s+/).filter(Boolean);
  let line = '';
  let currentY = y;
  let lineCount = 0;

  for (let i = 0; i < words.length; i++) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line) {
      lineCount += 1;
      if (lineCount >= maxLines) {
        ctx.fillText(line.trimEnd() + '…', x, currentY);
        return currentY + lineHeight;
      }
      ctx.fillText(line, x, currentY);
      line = words[i];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

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

export async function exportStoryToPng(options: {
  storyTitle: string;
  subtitle: string;
  drawingStyle: string;
  scenes: SceneState[];
}): Promise<void> {
  const { storyTitle, subtitle, drawingStyle, scenes } = options;
  if (scenes.length === 0) return;

  try {
    await document.fonts.ready;
  } catch {
    // Proceed with fallback fonts if document.fonts is unavailable
  }

  const width = 1200;
  const headerHeight = 148;
  const rowHeight = 250;
  const footerHeight = 64;
  const totalHeight = headerHeight + scenes.length * rowHeight + footerHeight;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = totalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context is not available.');
  }

  // Paper background
  ctx.fillStyle = '#fbfaf6';
  ctx.fillRect(0, 0, width, totalHeight);

  const padX = 64;

  // Header brand + title + subtitle
  ctx.fillStyle = '#73736a';
  ctx.font = '500 11px "DM Mono", monospace';
  ctx.fillText(`STORY DOODLES  ·  ${drawingStyle.toUpperCase()}  ·  ${scenes.length} SCENES`, padX, 46);

  ctx.fillStyle = '#292a24';
  ctx.font = '600 34px "Fraunces", Georgia, serif';
  ctx.fillText(storyTitle, padX, 90);

  ctx.fillStyle = '#77776d';
  ctx.font = '400 15px "DM Sans", sans-serif';
  wrapText(ctx, subtitle, padX, 118, width - padX * 2, 20, 1);

  // Divider line
  ctx.strokeStyle = '#e8e6de';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padX, headerHeight - 10);
  ctx.lineTo(width - padX, headerHeight - 10);
  ctx.stroke();

  // Preload all SVG images
  const images = await Promise.all(
    scenes.map((scene) => (scene.svg ? loadSvgAsImage(scene.svg) : Promise.resolve(null))),
  );

  // Draw each scene row (250px tall)
  scenes.forEach((scene, idx) => {
    const rowTop = headerHeight + idx * rowHeight;
    const cardX = padX;
    const cardY = rowTop + 14;
    const cardW = width - padX * 2;
    const cardH = rowHeight - 28;

    // Card background & border
    drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 10);
    ctx.fillStyle = '#fffefa';
    ctx.fill();
    ctx.strokeStyle = '#e8e6de';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Image box on left (280 x cardH)
    const imgW = 290;
    const imgH = cardH - 24;
    const imgX = cardX + 12;
    const imgY = cardY + 12;

    ctx.save();
    drawRoundedRect(ctx, imgX, imgY, imgW, imgH, 7);
    ctx.clip();

    const loadedImg = images[idx];
    if (loadedImg) {
      // Cover-fit 250:180 into imgW:imgH
      const imgAspect = loadedImg.width / loadedImg.height || 250 / 180;
      const boxAspect = imgW / imgH;
      let drawW = imgW;
      let drawH = imgH;
      let drawX = imgX;
      let drawY = imgY;
      if (imgAspect > boxAspect) {
        drawW = imgH * imgAspect;
        drawX = imgX - (drawW - imgW) / 2;
      } else {
        drawH = imgW / imgAspect;
        drawY = imgY - (drawH - imgH) / 2;
      }
      ctx.drawImage(loadedImg, drawX, drawY, drawW, drawH);
    } else {
      ctx.fillStyle = '#f3f1e9';
      ctx.fillRect(imgX, imgY, imgW, imgH);
      ctx.fillStyle = '#85857b';
      ctx.font = '500 14px "Fraunces", Georgia, serif';
      ctx.fillText('Not illustrated', imgX + 95, imgY + imgH / 2);
    }
    ctx.restore();

    ctx.strokeStyle = '#e8e6de';
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, imgX, imgY, imgW, imgH, 7);
    ctx.stroke();

    // Text details on right
    const textX = imgX + imgW + 28;
    const textW = cardX + cardW - textX - 24;

    // Scene number & setting
    ctx.fillStyle = '#73736a';
    ctx.font = '500 11px "DM Mono", monospace';
    const metaLabel = `SCENE ${String(idx + 1).padStart(2, '0')}  ·  ${scene.setting.toUpperCase()}`;
    ctx.fillText(metaLabel, textX, cardY + 34);

    // Mood chip on right
    const moodText = scene.mood.toUpperCase();
    ctx.font = '500 10px "DM Mono", monospace';
    const moodMetrics = ctx.measureText(moodText);
    const chipW = moodMetrics.width + 18;
    const chipH = 22;
    const chipX = cardX + cardW - 22 - chipW;
    const chipY = cardY + 18;
    drawRoundedRect(ctx, chipX, chipY, chipW, chipH, 999);
    ctx.fillStyle = '#f5ebd1';
    ctx.fill();
    ctx.fillStyle = '#786735';
    ctx.fillText(moodText, chipX + 9, chipY + 14.5);

    // Scene title
    ctx.fillStyle = '#292a24';
    ctx.font = '600 22px "Fraunces", Georgia, serif';
    ctx.fillText(scene.title, textX, cardY + 72);

    // One-line summary
    ctx.fillStyle = '#4e4f47';
    ctx.font = '400 14px "DM Sans", sans-serif';
    wrapText(ctx, scene.one_line_summary, textX, cardY + 104, textW, 21, 3);

    // Characters at bottom
    ctx.fillStyle = '#85857b';
    ctx.font = '500 11px "DM Mono", monospace';
    const charsText =
      scene.characters.length > 0 ? `CHARACTERS: ${scene.characters.join(', ')}` : 'NO CHARACTERS LISTED';
    ctx.fillText(charsText, textX, cardY + cardH - 20);
  });

  // Footer
  ctx.fillStyle = '#85857b';
  ctx.font = '400 13px "DM Sans", sans-serif';
  ctx.fillText('Every story deserves thoughtful visual form.', padX, totalHeight - 26);

  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  const slug = storyTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  link.download = `${slug || 'story-doodles'}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
