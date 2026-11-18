import React from 'react';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { useAppPreferences } from '../context/AppPreferencesContext';
import type { PptMindMapData } from '../types';
import { InteractiveMindMap } from './InteractiveMindMap';

interface MindMapPageProps {
  pptMindMap: PptMindMapData | null;
  isAnalyzingPpt: boolean;
  pptError: string | null;
  onUploadPptFile: (file: File) => void;
  onClearError: () => void;
  isExportingPng: boolean;
  onExportPng: () => void;
  onPrint: () => void;
  onGoHome: () => void;
}

export const MindMapPage: React.FC<MindMapPageProps> = ({
  pptMindMap,
  isAnalyzingPpt,
  pptError,
  onUploadPptFile,
  onClearError,
  isExportingPng,
  onExportPng,
  onPrint,
  onGoHome,
}) => {
  const { theme } = useAppPreferences();
  const isKids = theme === 'kids';
  const iconStroke = isKids ? 2 : 1.5;

  return (
    <div className="flex-1 w-full max-w-[1260px] mx-auto px-5 sm:px-8 py-6 sm:py-8 flex flex-col">
      {/* Feature Sub-bar: Home button + Title + Export */}
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
            Interactive Mind Map
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onExportPng}
            disabled={!pptMindMap || isExportingPng}
            className={`inline-flex items-center gap-1.5 font-medium whitespace-nowrap shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
              isKids
                ? 'px-4 py-2 rounded-full text-sm border border-[#eab27e] bg-[#FFE0C2] text-[#4a2b4f] hover:bg-[#ffd5ad]'
                : 'px-3.5 py-1.5 rounded-md text-xs border border-[var(--line)] bg-[var(--card-bg)] text-[var(--ink)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            <Download className="w-3.5 h-3.5" strokeWidth={iconStroke} />
            <span>{isExportingPng ? 'Exporting…' : 'Export PNG'}</span>
          </button>
          <button
            type="button"
            onClick={onPrint}
            disabled={!pptMindMap}
            className={`inline-flex items-center gap-1.5 font-medium whitespace-nowrap shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
              isKids
                ? 'px-4 py-2 rounded-full text-sm border border-[#eb9bb1] bg-[#FFD6E0] text-[#4a2b4f] hover:bg-[#ffcad7]'
                : 'px-3.5 py-1.5 rounded-md text-xs bg-[var(--accent-bg)] text-white hover:bg-[var(--accent-hover)]'
            }`}
          >
            <Printer className="w-3.5 h-3.5" strokeWidth={iconStroke} />
            <span>PDF / Print</span>
          </button>
        </div>
      </div>

      {/* Main Mind Map Title & Status */}
      <div className="flex flex-col min-[541px]:flex-row min-[541px]:items-start justify-between gap-3 mb-6">
        <div>
          <h2
            className={`font-display leading-[1.25] ${
              isKids ? 'text-[32px] font-bold' : 'text-[28px] font-medium'
            } ${
              pptMindMap ? 'text-[var(--ink)]' : 'text-[var(--muted-1)]'
            }`}
          >
            {pptMindMap ? pptMindMap.presentationTitle : 'Educational PPT Mind Map'}
          </h2>
          <p className="text-sm text-[var(--muted-2)] mt-1.5 leading-relaxed">
            {pptMindMap
              ? `${pptMindMap.subjectArea} · Click any concept node to expand subtopics and inspect definitions`
              : 'Upload a PowerPoint (.ppt / .pptx) to turn slides into an interactive study map'}
          </p>
        </div>

        <span
          className={`self-start font-medium px-3 py-1 ${isKids ? 'kids-crayon text-sm font-bold rounded-full' : 'text-xs rounded-md'} border whitespace-nowrap shrink-0 tabular-nums ${
            pptMindMap
              ? isKids
                ? 'bg-[#DCF7EA] border-[#87CFAF] text-[#2b5743]'
                : 'bg-[var(--accent-soft)] border-[var(--line)] text-[var(--accent-text)]'
              : 'bg-[var(--chip-bg)] border-[var(--line)] text-[var(--muted-2)]'
          }`}
        >
          {isAnalyzingPpt
            ? 'Analyzing slides…'
            : pptMindMap
              ? `${pptMindMap.totalSlides} slides ready`
              : 'No presentation loaded'}
        </span>
      </div>

      {/* Interactive Mind Map Workspace */}
      <div className="flex-1">
        <InteractiveMindMap
          data={pptMindMap}
          isUploading={isAnalyzingPpt}
          errorMessage={pptError}
          onUploadFile={onUploadPptFile}
          onClearError={onClearError}
        />
      </div>
    </div>
  );
};
