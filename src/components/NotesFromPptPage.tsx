import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  Check,
  Copy,
  Download,
  FileText,
  ListChecks,
  Printer,
  Search,
  Upload,
  X,
} from 'lucide-react';
import { useAppPreferences } from '../context/AppPreferencesContext';
import type { PptNotesData } from '../types';

interface NotesFromPptPageProps {
  notesData: PptNotesData | null;
  isExtracting: boolean;
  errorMessage: string | null;
  onUploadFile: (file: File) => void;
  onClearError: () => void;
  onGoHome: () => void;
}

type NotesTab = 'all' | 'sections' | 'definitions' | 'formulas';

function formatNotesAsMarkdown(data: PptNotesData): string {
  const lines: string[] = [];
  lines.push(`# ${data.presentation_title}`);
  lines.push(`*Subject:* ${data.subject_area} · *Slides:* ${data.totalSlides} · *Source:* ${data.fileName}`);
  lines.push('');
  lines.push('## Overview');
  lines.push(data.summary);
  lines.push('');

  if (data.key_takeaways.length > 0) {
    lines.push('## Key Takeaways');
    for (const item of data.key_takeaways) {
      lines.push(`- ${item}`);
    }
    lines.push('');
  }

  if (data.sections.length > 0) {
    lines.push('## Organized Notes');
    for (const sec of data.sections) {
      const slideNote = sec.slide_numbers.length > 0 ? ` (Slides ${sec.slide_numbers.join(', ')})` : '';
      lines.push(`### ${sec.title}${slideNote}`);
      if (sec.summary) lines.push(sec.summary);
      for (const bullet of sec.bullet_points) {
        lines.push(`- ${bullet}`);
      }
      lines.push('');
    }
  }

  if (data.definitions.length > 0) {
    lines.push('## Definitions');
    for (const def of data.definitions) {
      const slides = def.slide_numbers.length > 0 ? ` [Slide ${def.slide_numbers.join(', ')}]` : '';
      lines.push(`- **${def.term}**${slides}: ${def.definition}`);
    }
    lines.push('');
  }

  if (data.formulas.length > 0) {
    lines.push('## Formulas & Equations');
    for (const f of data.formulas) {
      const slides = f.slide_numbers.length > 0 ? ` (Slide ${f.slide_numbers.join(', ')})` : '';
      lines.push(`### ${f.name}${slides}`);
      lines.push(`\`${f.expression}\``);
      if (f.explanation) lines.push(f.explanation);
      lines.push('');
    }
  }

  return lines.join('\n');
}

export const NotesFromPptPage: React.FC<NotesFromPptPageProps> = ({
  notesData,
  isExtracting,
  errorMessage,
  onUploadFile,
  onClearError,
  onGoHome,
}) => {
  const { theme } = useAppPreferences();
  const isKids = theme === 'kids';
  const iconStroke = isKids ? 2 : 1.5;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [activeTab, setActiveTab] = useState<NotesTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFilePicked = (file: File | undefined) => {
    if (!file) return;
    onClearError();
    onUploadFile(file);
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredSections = useMemo(() => {
    if (!notesData) return [];
    if (!normalizedQuery) return notesData.sections;
    return notesData.sections.filter(
      (s) =>
        s.title.toLowerCase().includes(normalizedQuery) ||
        s.summary.toLowerCase().includes(normalizedQuery) ||
        s.bullet_points.some((b) => b.toLowerCase().includes(normalizedQuery)),
    );
  }, [notesData, normalizedQuery]);

  const filteredDefinitions = useMemo(() => {
    if (!notesData) return [];
    if (!normalizedQuery) return notesData.definitions;
    return notesData.definitions.filter(
      (d) =>
        d.term.toLowerCase().includes(normalizedQuery) ||
        d.definition.toLowerCase().includes(normalizedQuery),
    );
  }, [notesData, normalizedQuery]);

  const filteredFormulas = useMemo(() => {
    if (!notesData) return [];
    if (!normalizedQuery) return notesData.formulas;
    return notesData.formulas.filter(
      (f) =>
        f.name.toLowerCase().includes(normalizedQuery) ||
        f.expression.toLowerCase().includes(normalizedQuery) ||
        f.explanation.toLowerCase().includes(normalizedQuery),
    );
  }, [notesData, normalizedQuery]);

  const handleCopyMarkdown = async () => {
    if (!notesData) return;
    try {
      await navigator.clipboard.writeText(formatNotesAsMarkdown(notesData));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback ignored
    }
  };

  const handleDownloadMarkdown = () => {
    if (!notesData) return;
    const md = formatNotesAsMarkdown(notesData);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const slug = notesData.presentation_title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    a.href = url;
    a.download = `${slug || 'study-notes'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const hiddenInput = (
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

  return (
    <div className="flex-1 w-full max-w-[1120px] mx-auto px-5 sm:px-8 py-6 sm:py-8 flex flex-col">
      {hiddenInput}

      {/* Feature Sub-bar: Home button + actions */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 mb-7 pb-4 border-b border-[var(--line)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onGoHome}
            className={`inline-flex items-center gap-1.5 font-medium border transition-colors cursor-pointer ${
              isKids
                ? 'px-4 py-2 rounded-full text-sm border-[#e6ca5a] bg-[#FFF1A8] text-[#4a2b4f] hover:bg-[#ffec8f]'
                : 'px-3 py-1.5 rounded-md text-xs border-[var(--line)] bg-[var(--card-bg)] text-[var(--ink)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={iconStroke} />
            <span>Home</span>
          </button>

          <h1
            className={`font-display text-[var(--ink)] leading-tight ${
              isKids ? 'text-[1.45rem] sm:text-[1.75rem] font-bold' : 'text-xl sm:text-2xl font-medium'
            }`}
          >
            Notes from PPT
          </h1>
        </div>

        {notesData && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isExtracting}
              className={`inline-flex items-center gap-1.5 font-medium border cursor-pointer transition-colors ${
                isKids
                  ? 'px-4 py-2 rounded-full text-sm border-[#eab27e] bg-[#FFE0C2] text-[#4a2b4f] hover:bg-[#ffd5ad]'
                  : 'px-3 py-1.5 rounded-md text-xs border-[var(--line)] bg-[var(--card-bg)] text-[var(--ink)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" strokeWidth={iconStroke} />
              <span>New PPT</span>
            </button>

            <button
              type="button"
              onClick={handleCopyMarkdown}
              className={`inline-flex items-center gap-1.5 font-medium border cursor-pointer transition-colors ${
                isKids
                  ? 'px-4 py-2 rounded-full text-sm border-[#e6ca5a] bg-[#FFF1A8] text-[#4a2b4f] hover:bg-[#ffec8f]'
                  : 'px-3 py-1.5 rounded-md text-xs border-[var(--line)] bg-[var(--card-bg)] text-[var(--ink)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[var(--accent-text)]" strokeWidth={iconStroke} />
              ) : (
                <Copy className="w-3.5 h-3.5" strokeWidth={iconStroke} />
              )}
              <span>{copied ? 'Copied' : 'Copy Notes'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className={`inline-flex items-center gap-1.5 font-medium cursor-pointer transition-colors ${
                isKids
                  ? 'px-4 py-2 rounded-full text-sm border border-[#eb9bb1] bg-[#FFD6E0] text-[#4a2b4f] hover:bg-[#ffcad7]'
                  : 'px-3 py-1.5 rounded-md text-xs bg-[var(--accent-bg)] text-white hover:bg-[var(--accent-hover)]'
              }`}
            >
              <Download className="w-3.5 h-3.5" strokeWidth={iconStroke} />
              <span>Download .md</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className={`inline-flex items-center gap-1.5 font-medium border cursor-pointer transition-colors ${
                isKids
                  ? 'px-4 py-2 rounded-full text-sm border-[#f3c4d6] bg-[var(--card-bg)] text-[var(--ink)] hover:bg-[var(--surface-hover)]'
                  : 'px-3 py-1.5 rounded-md text-xs border-[var(--line)] bg-[var(--card-bg)] text-[var(--ink)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              <Printer className="w-3.5 h-3.5" strokeWidth={iconStroke} />
              <span>Print</span>
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isExtracting && (
        <section
          className={`${isKids ? 'rounded-[24px] border-2 border-dashed border-[#f3c4d6]' : 'rounded-[10px] border border-[var(--line)]'} bg-[var(--card-bg)] px-6 py-16 text-center shadow-[var(--shadow-card)]`}
        >
          <div
            className={`mx-auto mb-3 w-12 h-12 ${isKids ? 'rounded-[20px] bg-[#FFD6E0] border-2 border-[#eb9bb1] text-[#4a2b4f]' : 'rounded-lg bg-[var(--accent-soft)] text-[var(--accent-text)]'} flex items-center justify-center animate-pulse`}
          >
            <FileText className="w-5 h-5" strokeWidth={iconStroke} />
          </div>
          <h2
            className={`font-display text-[var(--ink)] mb-1.5 ${
              isKids ? 'text-[1.72rem] font-bold' : 'text-2xl font-medium'
            }`}
          >
            Extracting organized notes
          </h2>
          <p className="text-sm text-[var(--muted-2)] max-w-[440px] mx-auto leading-relaxed">
            Reading slides to structure sections, definitions, and formulas.
          </p>
        </section>
      )}

      {/* Empty Upload Dropzone */}
      {!isExtracting && !notesData && (
        <section>
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
              className={`mx-auto mb-4 w-12 h-12 ${isKids ? 'rounded-[20px] bg-[#FFE0C2] border-2 border-[#eab27e] text-[#4a2b4f]' : 'rounded-lg border-[var(--line)] bg-[var(--accent-soft)] text-[var(--accent-text)]'} border flex items-center justify-center`}
            >
              <Upload className="w-5 h-5" strokeWidth={iconStroke} />
            </div>
            <h2
              className={`font-display text-[var(--ink)] mb-2 ${
                isKids ? 'text-[1.72rem] sm:text-[2.15rem] font-bold' : 'text-2xl sm:text-3xl font-medium'
              }`}
            >
              Upload a presentation for study notes
            </h2>
            <p className="text-sm text-[var(--muted-2)] max-w-[500px] mx-auto mb-6 leading-relaxed">
              Select or drop a <strong className="text-[var(--ink)]">.ppt</strong> or{' '}
              <strong className="text-[var(--ink)]">.pptx</strong> file to extract organized sections, key definitions, and slide formulas.
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`inline-flex items-center gap-2 font-medium transition-colors cursor-pointer ${
                isKids
                  ? 'kids-sticker-hover px-7 py-3.5 rounded-full text-base bg-[#FFD6E0] border-2 border-[#eb9bb1] text-[#4a2b4f] hover:bg-[#ffcad7] shadow-[var(--shadow-card)]'
                  : 'px-5 py-2.5 rounded-md text-sm text-white bg-[var(--accent-bg)] hover:bg-[var(--accent-hover)]'
              }`}
            >
              <Upload className="w-4 h-4" strokeWidth={iconStroke} />
              <span>Choose file</span>
            </button>

            <p className={`mt-4 text-[var(--muted-1)] ${isKids ? 'kids-crayon text-sm font-bold' : 'eyebrow-mono'}`}>
              Organized sections · Definitions · Formulas
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
      )}

      {/* Extracted Study Notes Workspace */}
      {!isExtracting && notesData && (
        <div className="space-y-7">
          {errorMessage && (
            <div
              role="alert"
              className={`no-print ${isKids ? 'rounded-[20px]' : 'rounded-md'} border border-red-400/40 bg-red-500/10 px-4 py-2.5 text-xs text-red-600 dark:text-red-300 flex items-center justify-between gap-3`}
            >
              <span>{errorMessage}</span>
              <button
                type="button"
                onClick={onClearError}
                className="cursor-pointer hover:opacity-75"
                aria-label="Dismiss error"
              >
                <X className="w-4 h-4" strokeWidth={iconStroke} />
              </button>
            </div>
          )}

          {/* Header Summary Card */}
          <section
            className={`${isKids ? 'rounded-[24px] border-2 border-dashed border-[#f3c4d6]' : 'rounded-[10px] border border-[var(--line)]'} bg-[var(--card-bg)] p-6 shadow-[var(--shadow-card)]`}
          >
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted-2)] mb-2">
              <span className="font-medium text-[var(--accent-text)]">
                {notesData.subject_area}
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{notesData.totalSlides} slides</span>
              <span aria-hidden="true">·</span>
              <span className="truncate max-w-[260px]">{notesData.fileName}</span>
            </div>

            <h2
              className={`font-display text-[var(--ink)] mb-2 ${
                isKids ? 'text-[1.72rem] sm:text-[2.15rem] font-bold' : 'text-2xl sm:text-3xl font-medium'
              }`}
            >
              {notesData.presentation_title}
            </h2>

            <p className="text-sm text-[var(--ink-secondary)] leading-relaxed max-w-[75ch]">
              {notesData.summary}
            </p>

            {notesData.key_takeaways.length > 0 && (
              <div className="mt-5 pt-4 border-t border-[var(--line)]">
                <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[var(--muted-1)] mb-2.5">
                  <ListChecks className="w-3.5 h-3.5 text-[var(--accent-text)]" strokeWidth={iconStroke} />
                  <span>Key Takeaways</span>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-[var(--ink-secondary)] leading-relaxed">
                  {notesData.key_takeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[var(--accent-text)] mt-0.5">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Filter Tabs + Search */}
          <div className="no-print flex flex-wrap items-center justify-between gap-3">
            <div
              className={`inline-flex items-center gap-1 p-1 ${isKids ? 'rounded-full border-[#f3c4d6]' : 'rounded-md border-[var(--line)]'} border bg-[var(--sidebar-bg)] overflow-x-auto max-w-full`}
            >
              {(
                [
                  { id: 'all', label: 'All Notes' },
                  { id: 'sections', label: `Sections (${notesData.sections.length})` },
                  { id: 'definitions', label: `Definitions (${notesData.definitions.length})` },
                  { id: 'formulas', label: `Formulas (${notesData.formulas.length})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 ${isKids ? 'rounded-full text-sm' : 'rounded-[5px] text-xs'} font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? isKids
                        ? 'bg-[#FFF1A8] border border-[#e6ca5a] text-[#4a2b4f] shadow-[var(--shadow-card)]'
                        : 'bg-[var(--card-bg)] text-[var(--ink)] shadow-[var(--shadow-card)]'
                      : 'text-[var(--muted-2)] hover:text-[var(--ink)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative flex-1 sm:flex-initial min-w-[210px] max-w-[300px]">
              <Search
                className="w-3.5 h-3.5 text-[var(--muted-1)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                strokeWidth={iconStroke}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter notes, terms, formulas…"
                className={`w-full ${isKids ? 'rounded-full' : 'rounded-md'} border border-[var(--line)] bg-[var(--card-bg)] pl-8 pr-8 py-2 text-xs text-[var(--ink)] placeholder:text-[var(--muted-1)] focus:outline-none focus:border-[var(--accent-bg)]`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear filter"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-1)] hover:text-[var(--ink)] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={iconStroke} />
                </button>
              )}
            </div>
          </div>

          {/* Organized Note Sections */}
          {(activeTab === 'all' || activeTab === 'sections') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <span
                  className={
                    isKids
                      ? 'w-8 h-8 rounded-2xl bg-[#FFD6E0] border border-[#eb9bb1] text-[#6b2d4b] inline-flex items-center justify-center'
                      : 'inline-flex items-center'
                  }
                >
                  <BookOpen
                    className={`w-4 h-4 ${isKids ? 'text-[#6b2d4b]' : 'text-[var(--accent-text)]'}`}
                    strokeWidth={iconStroke}
                  />
                </span>
                <h3
                  className={`font-display text-[var(--ink)] ${
                    isKids ? 'text-[1.42rem] font-bold' : 'text-xl font-medium'
                  }`}
                >
                  Organized Notes
                </h3>
              </div>

              {filteredSections.length === 0 ? (
                <p className="text-sm text-[var(--muted-2)] py-4">
                  No note sections match your filter.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredSections.map((sec, idx) => (
                    <article
                      key={idx}
                      className={`${isKids ? 'rounded-[24px] border-2 border-dashed border-[#eb9bb1] bg-[#fff5f8]' : 'rounded-[10px] border border-[var(--line)] bg-[var(--card-bg)]'} p-5 shadow-[var(--shadow-card)] break-inside-avoid`}
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                        <h4
                          className={`font-display text-[var(--ink)] ${
                            isKids ? 'text-[1.28rem] font-bold' : 'text-lg font-medium'
                          }`}
                        >
                          {idx + 1}. {sec.title}
                        </h4>
                        {sec.slide_numbers.length > 0 && (
                          <span className="font-dm-mono text-[11px] text-[var(--muted-1)] tabular-nums">
                            Slides {sec.slide_numbers.join(', ')}
                          </span>
                        )}
                      </div>

                      {sec.summary && (
                        <p className="text-sm text-[var(--muted-2)] mb-3 leading-relaxed">
                          {sec.summary}
                        </p>
                      )}

                      <ul className="space-y-1.5 pl-5 list-disc text-sm text-[var(--ink-secondary)] leading-relaxed">
                        {sec.bullet_points.map((bp, bIdx) => (
                          <li key={bIdx}>{bp}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Definitions */}
          {(activeTab === 'all' || activeTab === 'definitions') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <span
                  className={
                    isKids
                      ? 'w-8 h-8 rounded-2xl bg-[#FFF1A8] border border-[#e6ca5a] text-[#695214] inline-flex items-center justify-center'
                      : 'inline-flex items-center'
                  }
                >
                  <FileText
                    className={`w-4 h-4 ${isKids ? 'text-[#695214]' : 'text-[var(--accent-text)]'}`}
                    strokeWidth={iconStroke}
                  />
                </span>
                <h3
                  className={`font-display text-[var(--ink)] ${
                    isKids ? 'text-[1.42rem] font-bold' : 'text-xl font-medium'
                  }`}
                >
                  Definitions &amp; Key Terms
                </h3>
              </div>

              {filteredDefinitions.length === 0 ? (
                <p className="text-sm text-[var(--muted-2)] py-4">
                  No definitions matched your filter.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDefinitions.map((def, idx) => (
                    <article
                      key={idx}
                      className={`${isKids ? 'rounded-[24px] border-2 border-dashed border-[#e6ca5a] bg-[#fffdf2]' : 'rounded-[10px] border border-[var(--line)] bg-[var(--card-bg)]'} p-4 shadow-[var(--shadow-card)] flex flex-col justify-between gap-2 break-inside-avoid`}
                    >
                      <div>
                        <div className="flex items-baseline justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-base text-[var(--ink)]">{def.term}</h4>
                          {def.slide_numbers.length > 0 && (
                            <span className="font-dm-mono text-[11px] text-[var(--muted-1)] tabular-nums shrink-0">
                              S{def.slide_numbers.join(', ')}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--ink-secondary)] leading-relaxed">
                          {def.definition}
                        </p>
                      </div>
                      <span className="text-[11px] text-[var(--muted-1)]">
                        {def.source === 'slide' ? 'From slide content' : 'Contextual explanation'}
                      </span>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Formulas & Equations */}
          {(activeTab === 'all' || activeTab === 'formulas') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <span
                  className={
                    isKids
                      ? 'w-8 h-8 rounded-2xl bg-[#FFE0C2] border border-[#eab27e] text-[#78431b] inline-flex items-center justify-center'
                      : 'inline-flex items-center'
                  }
                >
                  <Calculator
                    className={`w-4 h-4 ${isKids ? 'text-[#78431b]' : 'text-[var(--accent-text)]'}`}
                    strokeWidth={iconStroke}
                  />
                </span>
                <h3
                  className={`font-display text-[var(--ink)] ${
                    isKids ? 'text-[1.42rem] font-bold' : 'text-xl font-medium'
                  }`}
                >
                  Formulas &amp; Equations
                </h3>
              </div>

              {filteredFormulas.length === 0 ? (
                <div
                  className={`${isKids ? 'rounded-[24px] border-2 border-dashed border-[#f3c4d6]' : 'rounded-[10px] border border-dashed border-[var(--line)]'} bg-[var(--card-bg)]/50 p-6 text-sm text-[var(--muted-2)]`}
                >
                  {notesData.formulas.length === 0
                    ? 'No mathematical formulas or equations were found in this presentation.'
                    : 'No formulas match your filter.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredFormulas.map((formula, idx) => (
                    <article
                      key={idx}
                      className={`${isKids ? 'rounded-[24px] border-2 border-dashed border-[#eab27e] bg-[#fff8f1]' : 'rounded-[10px] border border-[var(--line)] bg-[var(--card-bg)]'} p-4 shadow-[var(--shadow-card)] space-y-2.5 break-inside-avoid`}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className="font-semibold text-base text-[var(--ink)]">{formula.name}</h4>
                        {formula.slide_numbers.length > 0 && (
                          <span className="font-dm-mono text-[11px] text-[var(--muted-1)] tabular-nums shrink-0">
                            Slide {formula.slide_numbers.join(', ')}
                          </span>
                        )}
                      </div>

                      <pre
                        className={`${isKids ? 'rounded-[18px] bg-[#fffdf7] border-[#f3c4d6]' : 'rounded-md bg-[var(--sidebar-bg)] border-[var(--line)]'} font-dm-mono text-xs sm:text-sm border px-3.5 py-2.5 text-[var(--ink)] whitespace-pre-wrap break-words m-0`}
                      >
                        {formula.expression}
                      </pre>

                      {formula.explanation && (
                        <p className="text-xs sm:text-sm text-[var(--muted-2)] leading-relaxed">
                          {formula.explanation}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
};
