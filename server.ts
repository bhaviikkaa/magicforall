import 'dotenv/config';
import express from 'express';
import JSZip from 'jszip';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Please check your environment settings.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      const isTransient =
        msg.includes('429') ||
        msg.includes('503') ||
        msg.includes('500') ||
        msg.includes('UNAVAILABLE') ||
        msg.includes('RESOURCE_EXHAUSTED') ||
        msg.includes('DEADLINE_EXCEEDED');
      if (!isTransient || attempt === maxAttempts) {
        throw err;
      }
      const delayMs = 600 * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw lastError;
}

function formatApiError(err: unknown): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err);
  if (raw.includes('GEMINI_API_KEY is not configured')) {
    return { status: 500, message: raw };
  }
  if (raw.includes('API_KEY_INVALID') || raw.includes('PERMISSION_DENIED') || raw.includes('403')) {
    return {
      status: 403,
      message: 'The Gemini API key appears invalid or lacks permission. Please verify it in Settings > Secrets.',
    };
  }
  if (raw.includes('RESOURCE_EXHAUSTED') || raw.includes('429')) {
    return {
      status: 429,
      message: 'Gemini API rate limit reached. Please wait a moment and try again.',
    };
  }
  return {
    status: 500,
    message: raw || 'Something went wrong while communicating with Gemini.',
  };
}

function sanitizeSvg(rawText: string): string | null {
  const cleaned = rawText
    .replace(/```(?:svg|xml|html)?/gi, '')
    .replace(/```/g, '')
    .trim();

  const match = cleaned.match(/<svg\b[\s\S]*?<\/svg>/i);
  if (!match) return null;

  let svg = match[0];

  // Strip potentially unsafe elements or attributes
  svg = svg
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<foreignObject\b[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/<image\b[^>]*\/?>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '');

  // Normalize root <svg> attributes to enforce exact viewBox & preserveAspectRatio
  const openTagMatch = svg.match(/^<svg\b([^>]*)>/i);
  if (!openTagMatch) return null;

  let attrs = openTagMatch[1]
    .replace(/\bviewBox\s*=\s*(?:"[^"]*"|'[^']*')/gi, '')
    .replace(/\bpreserveAspectRatio\s*=\s*(?:"[^"]*"|'[^']*')/gi, '')
    .replace(/\bxmlns\s*=\s*(?:"[^"]*"|'[^']*')/gi, '')
    .replace(/\bwidth\s*=\s*(?:"[^"]*"|'[^']*')/gi, '')
    .replace(/\bheight\s*=\s*(?:"[^"]*"|'[^']*')/gi, '')
    .trim();

  const normalizedOpenTag = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice"${attrs ? ' ' + attrs : ''}>`;
  svg = normalizedOpenTag + svg.slice(openTagMatch[0].length);

  return svg;
}

interface CharacterSheetEntry {
  name: string;
  visual_description: string;
}

interface AnalyzeRequestBody {
  story?: string;
  sceneCount?: number;
  drawingStyle?: string;
}

interface GenerateSvgRequestBody {
  storyTitle?: string;
  drawingStyle?: string;
  characterSheet?: CharacterSheetEntry[];
  scene?: {
    title?: string;
    setting?: string;
    mood?: string;
    action?: string;
    characters?: string[];
    image_prompt?: string;
  };
}

interface ExtractedSlide {
  slideNumber: number;
  text: string;
}

interface AnalyzePptRequestBody {
  fileName?: string;
  fileBase64?: string;
}

function decodeXmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_m, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_m, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function extractTextFromSlideXml(xml: string): string {
  const paragraphs: string[] = [];
  const pRegex = /<a:p\b[^>]*>([\s\S]*?)<\/a:p>/gi;
  let pMatch: RegExpExecArray | null;

  while ((pMatch = pRegex.exec(xml)) !== null) {
    const pContent = pMatch[1];
    const runs: string[] = [];
    const tRegex = /<(?:a:t|m:t)\b[^>]*>([\s\S]*?)<\/(?:a:t|m:t)>/gi;
    let tMatch: RegExpExecArray | null;
    while ((tMatch = tRegex.exec(pContent)) !== null) {
      const chunk = decodeXmlEntities(tMatch[1]);
      if (chunk) runs.push(chunk);
    }
    const line = runs.join('').replace(/\s+/g, ' ').trim();
    if (line) paragraphs.push(line);
  }

  if (paragraphs.length === 0) {
    const fallbackRuns: string[] = [];
    const tRegex = /<(?:a:t|m:t)\b[^>]*>([\s\S]*?)<\/(?:a:t|m:t)>/gi;
    let tMatch: RegExpExecArray | null;
    while ((tMatch = tRegex.exec(xml)) !== null) {
      const chunk = decodeXmlEntities(tMatch[1]).trim();
      if (chunk) fallbackRuns.push(chunk);
    }
    return fallbackRuns.join(' ');
  }

  return paragraphs.join('\n');
}

async function extractSlidesFromPptx(buffer: Buffer): Promise<ExtractedSlide[]> {
  const zip = await JSZip.loadAsync(buffer);
  const slideFiles: Array<{ num: number; path: string }> = [];

  zip.forEach((relativePath) => {
    const match = relativePath.match(/^ppt\/slides\/slide(\d+)\.xml$/i);
    if (match) {
      slideFiles.push({ num: Number(match[1]), path: relativePath });
    }
  });

  slideFiles.sort((a, b) => a.num - b.num);
  const slides: ExtractedSlide[] = [];

  for (const slideFile of slideFiles) {
    const xml = await zip.file(slideFile.path)?.async('string');
    if (!xml) continue;
    let slideText = extractTextFromSlideXml(xml);

    // Check slide relationships for linked speaker notes or SmartArt diagrams
    const relsPath = `ppt/slides/_rels/slide${slideFile.num}.xml.rels`;
    const relsXml = await zip.file(relsPath)?.async('string');
    const extraParts: string[] = [];

    if (relsXml) {
      const targetRegex = /Target="([^"]+)"/gi;
      let targetMatch: RegExpExecArray | null;
      while ((targetMatch = targetRegex.exec(relsXml)) !== null) {
        const rawTarget = targetMatch[1];
        if (/notesSlide\d+\.xml$/i.test(rawTarget) || /diagrams\/data\d+\.xml$/i.test(rawTarget)) {
          const normalizedPath = rawTarget.replace(/^\.\.\//, 'ppt/');
          const extraXml = await zip.file(normalizedPath)?.async('string');
          if (extraXml) {
            const extraText = extractTextFromSlideXml(extraXml);
            if (extraText) {
              const prefix = /notesSlide/i.test(normalizedPath) ? '[Speaker Notes]: ' : '[Diagram]: ';
              extraParts.push(`${prefix}${extraText}`);
            }
          }
        }
      }
    } else {
      const fallbackNotes = await zip.file(`ppt/notesSlides/notesSlide${slideFile.num}.xml`)?.async('string');
      if (fallbackNotes) {
        const notesText = extractTextFromSlideXml(fallbackNotes);
        if (notesText) extraParts.push(`[Speaker Notes]: ${notesText}`);
      }
    }

    if (extraParts.length > 0) {
      slideText = [slideText, ...extraParts].filter(Boolean).join('\n');
    }

    slides.push({
      slideNumber: slideFile.num,
      text: slideText.trim(),
    });
  }

  return slides;
}

function isMostlyPrintable(str: string): boolean {
  if (!str) return false;
  let printable = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if ((code >= 32 && code <= 126) || code === 10 || code === 13 || code === 9 || code >= 160) {
      printable++;
    }
  }
  return printable / str.length > 0.8;
}

function extractSlidesFromLegacyPpt(buffer: Buffer): ExtractedSlide[] {
  const slides: ExtractedSlide[] = [];
  let currentChunks: string[] = [];
  let slideIdx = 1;

  for (let i = 0; i + 8 <= buffer.length; i++) {
    const verInst = buffer.readUInt16LE(i);
    const recType = buffer.readUInt16LE(i + 2);
    const recLen = buffer.readUInt32LE(i + 4);

    // SlideAtom (0x03EF) marks a slide boundary
    if (recType === 0x03ef && recLen === 24 && (verInst & 0x0f) === 0x02) {
      if (currentChunks.length > 0) {
        slides.push({ slideNumber: slideIdx++, text: currentChunks.join('\n') });
        currentChunks = [];
      }
      i += 7 + recLen;
      continue;
    }

    // TextCharsAtom (0x0FA0, UTF-16LE) or TextBytesAtom (0x0FA8, Latin1)
    if ((recType === 0x0fa0 || recType === 0x0fa8) && (verInst & 0x0f) === 0x00 && recLen >= 2 && recLen <= 32768 && i + 8 + recLen <= buffer.length) {
      const slice = buffer.subarray(i + 8, i + 8 + recLen);
      const raw = recType === 0x0fa0 ? slice.toString('utf16le') : slice.toString('latin1');
      const cleaned = raw.replace(/\r/g, '\n').replace(/\u000b/g, '\n').trim();
      if (cleaned && isMostlyPrintable(cleaned)) {
        currentChunks.push(cleaned);
        i += 7 + recLen;
      }
    }
  }

  if (currentChunks.length > 0) {
    slides.push({ slideNumber: slideIdx, text: currentChunks.join('\n') });
  }

  return slides;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '35mb' }));

  app.post('/api/analyze-story', async (req, res) => {
    try {
      const body = (req.body ?? {}) as AnalyzeRequestBody;
      const story = typeof body.story === 'string' ? body.story.trim() : '';
      const rawCount = Number(body.sceneCount);
      const sceneCount = Number.isFinite(rawCount) ? Math.min(20, Math.max(6, Math.round(rawCount))) : 6;
      const drawingStyle = typeof body.drawingStyle === 'string' && body.drawingStyle.trim()
        ? body.drawingStyle.trim()
        : 'Soft crayon doodle';

      const wordCount = story.split(/\s+/).filter(Boolean).length;
      if (!story || story.length < 25 || wordCount < 6) {
        res.status(400).json({
          error: 'Your story is a little too short to split into scenes. Try pasting at least a few sentences!',
        });
        return;
      }

      const ai = getAiClient();

      const prompt = `Analyze the following story and break it into EXACTLY ${sceneCount} sequential illustrated storybook scenes.

Drawing style selected by the user: "${drawingStyle}"

Requirements:
1. Create a warm, fitting "story_title" and a short 1-sentence "subtitle".
2. Build a "character_sheet" for all recurring characters/creatures in the story. Each character must have a concrete, consistent "visual_description" specifying exact pastel colors, simple geometric/storybook shapes, clothing/accessories, hair/fur, and distinctive traits so every scene draws them identically.
3. Extract concise lists of "places" (settings) and "key_moments" (plot beats) for the story mind map, plus a short poetic "mind_map_caption" (max 10 words).
4. Produce EXACTLY ${sceneCount} items in "scenes" following the narrative arc from beginning to end.
5. For every scene:
   - "title": short evocative scene title (3–6 words)
   - "one_line_summary": crisp 1-sentence summary (max 18 words)
   - "setting": short place label (e.g., "Quiet Attic", "Mossy Trail")
   - "mood": 1–2 word mood tag (e.g., "Curious", "Cozy", "Suspenseful")
   - "characters": array of character names appearing in this scene
   - "action": what is visibly happening in this frame
   - "image_prompt": a rich visual description for a hand-drawn ${drawingStyle} illustration of this scene, explicitly including the "${drawingStyle}" style and pasting the exact visual descriptions from "character_sheet" for every character present, plus composition, setting details, and mood lighting.

Story:
"""
${story}
"""`;

      const response = await withRetry(() =>
        ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt,
          config: {
            systemInstruction:
              'You are a thoughtful storybook editor and art director. Return valid JSON matching the exact schema. Never invent unrelated stories; always stay faithful to the pasted story and produce the exact requested number of scenes.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              required: [
                'story_title',
                'subtitle',
                'character_sheet',
                'places',
                'key_moments',
                'mind_map_caption',
                'scenes',
              ],
              properties: {
                story_title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                character_sheet: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ['name', 'visual_description'],
                    properties: {
                      name: { type: Type.STRING },
                      visual_description: { type: Type.STRING },
                    },
                  },
                },
                places: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                key_moments: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                mind_map_caption: { type: Type.STRING },
                scenes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: [
                      'title',
                      'one_line_summary',
                      'setting',
                      'mood',
                      'characters',
                      'action',
                      'image_prompt',
                    ],
                    properties: {
                      title: { type: Type.STRING },
                      one_line_summary: { type: Type.STRING },
                      setting: { type: Type.STRING },
                      mood: { type: Type.STRING },
                      characters: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      action: { type: Type.STRING },
                      image_prompt: { type: Type.STRING },
                    },
                  },
                },
              },
            },
          },
        }),
      );

      const jsonText = (response.text ?? '').trim();
      if (!jsonText) {
        throw new Error('Gemini returned an empty response while analyzing the story.');
      }

      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed.scenes) || parsed.scenes.length === 0) {
        res.status(400).json({
          error: 'Could not split this text into scenes. Try adding a bit more story action or detail.',
        });
        return;
      }

      // Enforce exact N scenes if the model slightly over-produced
      if (parsed.scenes.length > sceneCount) {
        parsed.scenes = parsed.scenes.slice(0, sceneCount);
      }

      res.json(parsed);
    } catch (err: unknown) {
      const { status, message } = formatApiError(err);
      res.status(status).json({ error: message });
    }
  });

  app.post('/api/generate-svg', async (req, res) => {
    try {
      const body = (req.body ?? {}) as GenerateSvgRequestBody;
      const scene = body.scene;
      if (!scene || !scene.image_prompt) {
        res.status(400).json({ error: 'Missing scene illustration prompt.' });
        return;
      }

      const drawingStyle = body.drawingStyle || 'Soft crayon doodle';
      const characterSheetText =
        Array.isArray(body.characterSheet) && body.characterSheet.length > 0
          ? body.characterSheet
              .map((c) => `- ${c.name}: ${c.visual_description}`)
              .join('\n')
          : 'No fixed characters specified.';

      const styleGuidance: Record<string, string> = {
        'Soft crayon doodle':
          'Warm creamy paper backdrop, soft muted pastel fills, gentle slightly organic curved paths, cozy rounded outlines in warm charcoal (#3b3830) with stroke-width 2.5–3.5.',
        'Pencil sketch':
          'Light warm ivory paper background, subtle graphite grey-brown outlines (#4b4a44) with delicate sketchy cross-hatch strokes and very soft muted pastel washes.',
        'Ink & watercolor':
          'Crisp dark ink outlines (#2c2a25) paired with soft translucent layered pastel watercolor shapes (using fill-opacity 0.65–0.85) and gentle organic edges.',
        'Comic doodle':
          'Bold friendly rounded ink outlines (#292a24, stroke-width 3–4), cheerful flat pastel color blocks, expressive dynamic poses and simple comic motion lines or stars.',
      };

      const styleCue = styleGuidance[drawingStyle] ?? styleGuidance['Soft crayon doodle'];

      const prompt = `Create ONE self-contained inline SVG illustration for a storybook scene.

Story: "${body.storyTitle || 'Untitled Story'}"
Scene title: "${scene.title || ''}"
Setting: "${scene.setting || ''}"
Mood: "${scene.mood || ''}"
Action: "${scene.action || ''}"
Characters in scene: ${(scene.characters || []).join(', ') || 'None'}
Drawing style: "${drawingStyle}" (${styleCue})

Character Sheet (MUST keep exact same colors, outfits, and simple shapes across all scenes):
${characterSheetText}

Illustration Prompt:
${scene.image_prompt}

STRICT SVG RULES:
1. Output ONLY raw <svg>...</svg> markup. Do NOT wrap in markdown code fences and do NOT include any explanation text.
2. Root element MUST be: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
3. Fill the entire 250x180 canvas with a full-bleed background <rect> and layered scenery shapes (sky/walls, hills/floor, trees/furniture, lighting glow/clouds) matching the setting and mood.
4. Use flat pastel fills (warm cream, sage green, soft ochre, dusty rose, sky blue, lavender) and thick rounded outlines (stroke-linecap="round" stroke-linejoin="round").
5. Draw characters using charming, simple storybook shapes (circles for heads, rounded rects/paths for bodies, simple dot eyes, curved smiles, consistent clothes/colors from the character sheet).
6. Use only standard SVG geometry (<rect>, <circle>, <ellipse>, <path>, <polygon>, <polyline>, <line>, <g>). Do NOT use <script>, <foreignObject>, <image>, or external URLs. Do NOT add caption text inside the SVG.`;

      const ai = getAiClient();
      const response = await withRetry(() =>
        ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            systemInstruction:
              'You are a charming children’s book doodle illustrator who writes clean, expressive, self-contained inline SVG artwork. Always return strictly one valid <svg>...</svg> element with viewBox="0 0 250 180" and preserveAspectRatio="xMidYMid slice".',
          },
        }),
      );

      const svg = sanitizeSvg(response.text ?? '');
      if (!svg) {
        throw new Error('Could not parse a valid SVG illustration from Gemini.');
      }

      res.json({ svg });
    } catch (err: unknown) {
      const { status, message } = formatApiError(err);
      res.status(status).json({ error: message });
    }
  });

  app.post('/api/analyze-ppt', async (req, res) => {
    try {
      const body = (req.body ?? {}) as AnalyzePptRequestBody;
      const fileName = typeof body.fileName === 'string' ? body.fileName.trim() : 'presentation.pptx';
      const fileBase64 = typeof body.fileBase64 === 'string' ? body.fileBase64 : '';

      if (!fileBase64) {
        res.status(400).json({ error: 'No presentation file data was provided.' });
        return;
      }

      const buffer = Buffer.from(fileBase64, 'base64');
      if (buffer.length === 0) {
        res.status(400).json({ error: 'The uploaded file appears to be empty.' });
        return;
      }

      const isZip = buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b;
      const isPptx = fileName.toLowerCase().endsWith('.pptx') || isZip;

      let slides: ExtractedSlide[] = [];
      if (isPptx) {
        slides = await extractSlidesFromPptx(buffer);
      } else if (fileName.toLowerCase().endsWith('.ppt')) {
        slides = extractSlidesFromLegacyPpt(buffer);
      } else {
        res.status(400).json({ error: 'Please upload a valid .ppt or .pptx PowerPoint presentation.' });
        return;
      }

      const nonEmptySlides = slides.filter((s) => s.text.length > 0);
      if (nonEmptySlides.length === 0) {
        res.status(400).json({
          error:
            'No readable text could be extracted from this presentation. If slides contain only flattened images or password protection, please export text-based .pptx slides and try again.',
        });
        return;
      }

      const formattedSlides = nonEmptySlides
        .map((s) => `--- SLIDE ${s.slideNumber} ---\n${s.text}`)
        .join('\n\n');

      const ai = getAiClient();

      const nodeProperties = {
        label: { type: Type.STRING },
        terminology: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        definition: { type: Type.STRING },
        definition_source: { type: Type.STRING },
        key_points: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        example: { type: Type.STRING },
        formula: { type: Type.STRING },
        slide_numbers: {
          type: Type.ARRAY,
          items: { type: Type.INTEGER },
        },
      };

      const requiredNodeFields = [
        'label',
        'terminology',
        'definition',
        'definition_source',
        'key_points',
        'example',
        'formula',
        'slide_numbers',
      ];

      const tertiaryBranchSchema = {
        type: Type.OBJECT,
        required: requiredNodeFields,
        properties: nodeProperties,
      };

      const secondaryBranchSchema = {
        type: Type.OBJECT,
        required: [...requiredNodeFields, 'children'],
        properties: {
          ...nodeProperties,
          children: {
            type: Type.ARRAY,
            items: tertiaryBranchSchema,
          },
        },
      };

      const primaryBranchSchema = {
        type: Type.OBJECT,
        required: [...requiredNodeFields, 'children'],
        properties: {
          ...nodeProperties,
          children: {
            type: Type.ARRAY,
            items: secondaryBranchSchema,
          },
        },
      };

      const prompt = `Analyze the following educational PowerPoint presentation (${nonEmptySlides.length} slides from "${fileName}") and build a comprehensive, accurate 4-level hierarchical Interactive Mind Map.

HIERARCHY RULES:
- central_node: Main subject or title of the entire presentation.
- primary_branches: Main topics, chapters, or major themes covered across the slides.
- secondary_branches (children of primary_branches): Subtopics associated with each primary topic.
- tertiary_branches (children of secondary_branches): Specific terminology, keywords, principles, formulas, laws, code constructs, or distinct concepts.

ACCURACY & CONTENT RULES:
1. Analyze ALL slides thoroughly; do not omit important concepts or introduce unrelated outside topics.
2. Preserve original context, scientific terminology, mathematical notation, equations, and programming syntax verbatim where present.
3. For every node at every level:
   - "label": Distinct, concise concept or topic name.
   - "terminology": Array of important technical terms/keywords from the presentation tied to this node.
   - "definition": Student-friendly explanation (2–4 sentences maximum, crisp and clear).
   - "definition_source": Must be EXACTLY "slide" if the definition is explicitly stated in the presentation slides, or "contextual" if the PPT mentioned the term without defining it so you provided a brief contextual explanation.
   - "key_points": 2–4 concise facts to remember from the slides.
   - "example": A relevant illustrative example (prefer examples from the PPT if present; empty string "" if none applies).
   - "formula": Exact mathematical formula, chemical equation, or code syntax if present in the PPT for this concept; otherwise empty string "".
   - "slide_numbers": Exact integer slide number(s) from which this concept was extracted.
4. Connect every subtopic and term to its accurate parent topic.

PRESENTATION SLIDES:
${formattedSlides}`;

      const response = await withRetry(() =>
        ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
            systemInstruction:
              'You are an expert educational curriculum designer. Extract a faithful, complete, student-friendly hierarchical mind map strictly from the uploaded slides. Never hallucinate formulas or fabricate slide claims; clearly mark whether each definition is directly from slide content ("slide") or a brief contextual clarification ("contextual").',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              required: ['presentation_title', 'subject_area', 'central_node', 'primary_branches'],
              properties: {
                presentation_title: { type: Type.STRING },
                subject_area: { type: Type.STRING },
                central_node: {
                  type: Type.OBJECT,
                  required: requiredNodeFields,
                  properties: nodeProperties,
                },
                primary_branches: {
                  type: Type.ARRAY,
                  items: primaryBranchSchema,
                },
              },
            },
          },
        }),
      );

      const jsonText = (response.text ?? '').trim();
      if (!jsonText) {
        throw new Error('Gemini returned an empty response while analyzing the presentation.');
      }

      const parsed = JSON.parse(jsonText);
      res.json({
        fileName,
        totalSlides: slides.length || nonEmptySlides.length,
        ...parsed,
      });
    } catch (err: unknown) {
      const { status, message } = formatApiError(err);
      res.status(status).json({ error: message });
    }
  });

  app.post('/api/extract-ppt-notes', async (req, res) => {
    try {
      const body = (req.body ?? {}) as AnalyzePptRequestBody;
      const fileName = typeof body.fileName === 'string' ? body.fileName.trim() : 'presentation.pptx';
      const fileBase64 = typeof body.fileBase64 === 'string' ? body.fileBase64 : '';

      if (!fileBase64) {
        res.status(400).json({ error: 'No presentation file data was provided.' });
        return;
      }

      const buffer = Buffer.from(fileBase64, 'base64');
      if (buffer.length === 0) {
        res.status(400).json({ error: 'The uploaded file appears to be empty.' });
        return;
      }

      const isZip = buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b;
      const isPptx = fileName.toLowerCase().endsWith('.pptx') || isZip;

      let slides: ExtractedSlide[] = [];
      if (isPptx) {
        slides = await extractSlidesFromPptx(buffer);
      } else if (fileName.toLowerCase().endsWith('.ppt')) {
        slides = extractSlidesFromLegacyPpt(buffer);
      } else {
        res.status(400).json({ error: 'Please upload a valid .ppt or .pptx PowerPoint presentation.' });
        return;
      }

      const nonEmptySlides = slides.filter((s) => s.text.length > 0);
      if (nonEmptySlides.length === 0) {
        res.status(400).json({
          error:
            'No readable text could be extracted from this presentation. If slides contain only flattened images or password protection, please export text-based .pptx slides and try again.',
        });
        return;
      }

      const formattedSlides = nonEmptySlides
        .map((s) => `--- SLIDE ${s.slideNumber} ---\n${s.text}`)
        .join('\n\n');

      const ai = getAiClient();

      const prompt = `Analyze the following PowerPoint presentation (${nonEmptySlides.length} slides from "${fileName}") and extract well-organized study notes, definitions, and formulas.

REQUIREMENTS:
1. "presentation_title": Clear, descriptive title for the deck.
2. "subject_area": Academic subject or topic area (e.g., "Biology", "Linear Algebra", "World History").
3. "summary": A concise 2–3 sentence overview of the entire presentation.
4. "sections": Group the slides logically into sequential study sections. Each section must have:
   - "title": Section heading
   - "slide_numbers": Array of integer slide numbers covered in this section
   - "summary": 1–2 sentence summary of the section
   - "bullet_points": Clear, well-structured study notes from those slides
5. "definitions": Extract every important term/concept defined or introduced across the slides. Each item must have:
   - "term": Term or concept name
   - "definition": Clear student-friendly definition (1–3 sentences)
   - "source": "slide" if explicitly defined in the slides, or "contextual" if briefly clarified from slide context
   - "slide_numbers": Integer slide numbers where this term appears
6. "formulas": Extract ALL mathematical formulas, equations, laws, chemical reactions, or key code syntax blocks present in the slides (return an empty array [] if none exist). Each item must have:
   - "name": Formula or rule name
   - "expression": Exact formula/equation/syntax verbatim from slides
   - "explanation": What each variable means and when to use it
   - "slide_numbers": Integer slide numbers where it appears
7. "key_takeaways": 3–6 high-yield takeaways for quick exam or homework review.

PRESENTATION SLIDES:
${formattedSlides}`;

      const response = await withRetry(() =>
        ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
            systemInstruction:
              'You are an expert study assistant and academic note-taker. Extract accurate, cleanly organized study notes, definitions, and formulas strictly from the uploaded presentation slides. Never fabricate formulas or unrelated facts.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              required: [
                'presentation_title',
                'subject_area',
                'summary',
                'sections',
                'definitions',
                'formulas',
                'key_takeaways',
              ],
              properties: {
                presentation_title: { type: Type.STRING },
                subject_area: { type: Type.STRING },
                summary: { type: Type.STRING },
                sections: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ['title', 'slide_numbers', 'summary', 'bullet_points'],
                    properties: {
                      title: { type: Type.STRING },
                      slide_numbers: { type: Type.ARRAY, items: { type: Type.INTEGER } },
                      summary: { type: Type.STRING },
                      bullet_points: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                  },
                },
                definitions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ['term', 'definition', 'source', 'slide_numbers'],
                    properties: {
                      term: { type: Type.STRING },
                      definition: { type: Type.STRING },
                      source: { type: Type.STRING },
                      slide_numbers: { type: Type.ARRAY, items: { type: Type.INTEGER } },
                    },
                  },
                },
                formulas: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ['name', 'expression', 'explanation', 'slide_numbers'],
                    properties: {
                      name: { type: Type.STRING },
                      expression: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                      slide_numbers: { type: Type.ARRAY, items: { type: Type.INTEGER } },
                    },
                  },
                },
                key_takeaways: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
            },
          },
        }),
      );

      const jsonText = (response.text ?? '').trim();
      if (!jsonText) {
        throw new Error('Gemini returned an empty response while extracting notes.');
      }

      const parsed = JSON.parse(jsonText);
      res.json({
        fileName,
        totalSlides: slides.length || nonEmptySlides.length,
        ...parsed,
      });
    } catch (err: unknown) {
      const { status, message } = formatApiError(err);
      res.status(status).json({ error: message });
    }
  });

  if (!IS_PRODUCTION) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Story Doodles server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Story Doodles server:', err);
  process.exit(1);
});
