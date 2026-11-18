import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Download,
  ListOrdered,
  Network,
  Palette,
  Printer,
} from 'lucide-react';
import { useAppPreferences } from '../context/AppPreferencesContext';
import type { PresetStory } from '../data/presetStories';
import type { DrawingStyle, SceneState, StoryAnalysis, ViewMode } from '../types';
import { ConfirmModal } from './ConfirmModal';
import { MindMap } from './MindMap';
import { SceneFlow } from './SceneFlow';
import { Sidebar } from './Sidebar';

interface StoryDoodlesPageProps {
  activeSource: 'custom' | string;
  onSelectPreset: (preset: PresetStory) => void;
  onSelectCustomTab: () => void;
  story: string;
  onStoryChange: (value: string) => void;
  sceneCount: number;
  onSceneCountChange: (value: number) => void;
  drawingStyle: DrawingStyle;
  onDrawingStyleChange: (value: DrawingStyle) => void;
  maxImages: number;
  onMaxImagesChange: (value: number) => void;
  isAnalyzing: boolean;
  statusNote: { type: 'muted' | 'status' | 'error'; text: string };
  isModalOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onConfirmIllustrate: () => void;
  analysis: StoryAnalysis | null;
  scenes: SceneState[];
  activeStyleUsed: DrawingStyle;
  viewMode: Exclude<ViewMode, 'ppt-mindmap'>;
  onViewModeChange: (mode: Exclude<ViewMode, 'ppt-mindmap'>) => void;
  onRedrawScene: (sceneId: string, newPrompt: string) => void;
  onRetryScene: (sceneId: string) => void;
  isExportingPng: boolean;
  onExportPng: () => void;
  onPrint: () => void;
  onGoHome: () => void;
}

export const StoryDoodlesPage: React.FC<StoryDoodlesPageProps> = ({
  activeSource,
  onSelectPreset,
  onSelectCustomTab,
  story,
  onStoryChange,
  sceneCount,
  onSceneCountChange,
  drawingStyle,
  onDrawingStyleChange,
  maxImages,
  onMaxImagesChange,
  isAnalyzing,
  statusNote,
  isModalOpen,
  onOpenModal,
  onCloseModal,
  onConfirmIllustrate,
  analysis,
  scenes,
  activeStyleUsed,
  viewMode,
  onViewModeChange,
  onRedrawScene,
  onRetryScene,
  isExportingPng,
  onExportPng,
  onPrint,
  onGoHome,
}) => {
  const { theme } = useAppPreferences();
  const isKids = theme === 'kids';
  const iconStroke = isKids ? 2 : 1.5;

  const hasScenes = scenes.length > 0;
  const readyCount = scenes.filter((s) => s.status === 'ready').length;
  const loadingCount = scenes.filter((s) => s.status === 'loading').length;
  const effectiveSceneCount = analysis ? analysis.scenes.length : sceneCount;
  const estimateMinutes = Math.max(1, Math.ceil(effectiveSceneCount / 3));

  const statusBadgeText = !hasScenes
    ? 'No scenes yet'
    : loadingCount > 0
      ? `Drawing ${readyCount}/${scenes.length}`
      : `${scenes.length} scenes ready`;

  return (
    <div className="flex-1 flex flex-col">
      {/* Feature Sub-bar */}
      <div
        className={`no-print border-b px-4 sm:px-6 py-3 ${
          isKids ? 'border-[#f3c4d6] bg-[#fff7fa]' : 'border-[var(--line)] bg-[var(--header-bg)]'
        }`}
      >
        <div className="max-w-[1320px] mx-auto flex flex-wrap items-center justify-between gap-3">
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
            <span
              className={`font-display text-[var(--ink)] ${
                isKids ? 'text-[1.32rem] font-bold' : 'text-lg font-medium'
              }`}
            >
              Story Doodles
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onExportPng}
              disabled={!hasScenes || isExportingPng}
              className={`inline-flex items-center gap-1.5 font-medium tracking-tight whitespace-nowrap shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
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
              disabled={!hasScenes}
              className={`inline-flex items-center gap-1.5 font-medium tracking-tight whitespace-nowrap shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
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
      </div>

      {/* Main Story Doodles Shell */}
      <div className="app-shell-grid flex-1 grid grid-cols-1 min-[851px]:grid-cols-[345px_1fr]">
        <Sidebar
          activeSource={activeSource}
          onSelectPreset={onSelectPreset}
          onSelectCustomTab={onSelectCustomTab}
          story={story}
          onStoryChange={onStoryChange}
          sceneCount={sceneCount}
          onSceneCountChange={onSceneCountChange}
          drawingStyle={drawingStyle}
          onDrawingStyleChange={onDrawingStyleChange}
          maxImages={maxImages}
          onMaxImagesChange={onMaxImagesChange}
          isAnalyzing={isAnalyzing}
          statusNote={statusNote}
          onIllustrateClick={onOpenModal}
        />

        <main className="main-area w-full max-w-[1000px] mx-auto px-5 py-8 min-[541px]:px-8 min-[851px]:px-[44px] min-[851px]:py-[36px] flex flex-col">
          {/* Title bar */}
          <div className="flex flex-col min-[541px]:flex-row min-[541px]:items-start justify-between gap-3 mb-3">
            <div>
              <h1
                className={`font-display leading-[1.25] ${
                  isKids ? 'text-[34px] font-bold' : 'text-[30px] font-medium'
                } ${
                  analysis ? 'text-[var(--ink)]' : 'text-[var(--muted-1)]'
                }`}
              >
                {analysis ? analysis.story_title : 'Your story title'}
              </h1>
              <p className="text-sm text-[var(--muted-2)] mt-1.5 leading-relaxed">
                {analysis ? analysis.subtitle : 'Your illustrated story will appear here'}
              </p>
            </div>

            <span
              className={`self-start font-medium px-3 py-1 ${isKids ? 'kids-crayon text-sm font-bold rounded-full' : 'text-xs rounded-md'} border whitespace-nowrap shrink-0 tabular-nums ${
                hasScenes
                  ? isKids
                    ? 'bg-[#DCF7EA] border-[#87CFAF] text-[#2b5743]'
                    : 'bg-[var(--accent-soft)] border-[var(--line)] text-[var(--accent-text)]'
                  : 'bg-[var(--chip-bg)] border-[var(--line)] text-[var(--muted-2)]'
              }`}
            >
              {statusBadgeText}
            </span>
          </div>

          {/* Unboxed clean metadata */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted-2)] mb-6">
            <span className="inline-flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[var(--muted-1)]" strokeWidth={iconStroke} />
              <span>{analysis ? activeStyleUsed : drawingStyle}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5 tabular-nums">
              <Clock className="w-3.5 h-3.5 text-[var(--muted-1)]" strokeWidth={iconStroke} />
              <span>About {estimateMinutes} min</span>
            </span>
          </div>

          {/* View switcher */}
          <nav
            className="no-print flex items-center gap-1.5 border-b border-[var(--line)] pb-3 mb-7 overflow-x-auto"
            aria-label="Story views"
          >
            <button
              type="button"
              onClick={() => onViewModeChange('vertical')}
              className={`inline-flex items-center gap-1.5 ${isKids ? 'px-4 py-2 rounded-full text-sm' : 'px-3.5 py-1.5 rounded-md text-xs'} whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                viewMode === 'vertical'
                  ? isKids
                    ? 'bg-[#FFD6E0] border border-[#eb9bb1] text-[#4a2b4f] font-semibold'
                    : 'bg-[var(--active-tab-bg)] text-[var(--active-tab-text)] font-semibold'
                  : 'text-[var(--muted-2)] font-medium hover:text-[var(--ink)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" strokeWidth={iconStroke} />
              <span>Scene flow</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('mindmap')}
              className={`inline-flex items-center gap-1.5 ${isKids ? 'px-4 py-2 rounded-full text-sm' : 'px-3.5 py-1.5 rounded-md text-xs'} whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                viewMode === 'mindmap'
                  ? isKids
                    ? 'bg-[#FFF1A8] border border-[#e6ca5a] text-[#4a2b4f] font-semibold'
                    : 'bg-[var(--active-tab-bg)] text-[var(--active-tab-text)] font-semibold'
                  : 'text-[var(--muted-2)] font-medium hover:text-[var(--ink)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              <Network className="w-3.5 h-3.5" strokeWidth={iconStroke} />
              <span>Story mind map</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('horizontal')}
              className={`inline-flex items-center gap-1.5 ${isKids ? 'px-4 py-2 rounded-full text-sm' : 'px-3.5 py-1.5 rounded-md text-xs'} whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                viewMode === 'horizontal'
                  ? isKids
                    ? 'bg-[#FFE0C2] border border-[#eab27e] text-[#4a2b4f] font-semibold'
                    : 'bg-[var(--active-tab-bg)] text-[var(--active-tab-text)] font-semibold'
                  : 'text-[var(--muted-2)] font-medium hover:text-[var(--ink)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={iconStroke} />
              <span>Horizontal flow</span>
            </button>
          </nav>

          {/* Active View */}
          <div className="flex-1">
            {viewMode === 'mindmap' ? (
              <MindMap analysis={analysis} />
            ) : (
              <SceneFlow
                scenes={scenes}
                mode={viewMode}
                onRedraw={onRedrawScene}
                onRetry={onRetryScene}
              />
            )}
          </div>

          <footer className="no-print mt-12 pt-5 border-t border-[var(--line)] text-center text-xs text-[var(--muted-1)]">
            Every story deserves thoughtful visual form.
          </footer>
        </main>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        sceneCount={sceneCount}
        estimateMinutes={Math.max(1, Math.ceil(sceneCount / 3))}
        onCancel={onCloseModal}
        onConfirm={onConfirmIllustrate}
      />
    </div>
  );
};
