import React from 'react';
import { ArrowRight, PenLine, Sparkles } from 'lucide-react';
import { useAppPreferences } from '../context/AppPreferencesContext';
import { PRESET_STORIES, type PresetStory } from '../data/presetStories';
import { DRAWING_STYLES, type DrawingStyle } from '../types';

interface SidebarProps {
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
  onIllustrateClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
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
  onIllustrateClick,
}) => {
  const { theme } = useAppPreferences();
  const isKids = theme === 'kids';
  const iconStroke = isKids ? 2 : 1.5;

  const isCustomActive = activeSource === 'custom';
  const activePreset = PRESET_STORIES.find((p) => p.id === activeSource);
  const canIllustrate = isCustomActive ? story.trim().length > 0 : Boolean(activePreset);

  return (
    <aside
      className={`no-print border-b min-[851px]:border-b-0 min-[851px]:border-r px-[27px] py-[30px] flex flex-col transition-colors ${
        isKids ? 'bg-[#fff7fa] border-[#f3c4d6]' : 'bg-[var(--sidebar-bg)] border-[var(--line)]'
      }`}
    >
      <div className={`${isKids ? 'kids-crayon text-sm font-bold text-[#8c2e59]' : 'eyebrow-mono text-[var(--muted-3)]'} mb-1.5`}>
        Story studio
      </div>

      <h2
        className={`font-display leading-[1.28] text-[var(--ink)] mb-2 ${
          isKids ? 'text-[30px] font-bold' : 'text-[26px] font-medium'
        }`}
      >
        Illustrate a narrative
      </h2>

      <p className="text-[13px] leading-[1.55] text-[var(--muted-2)] mb-5">
        Choose a curated story below to preview immediately, or compose your own in Custom.
      </p>

      <div className="flex flex-col gap-4">
        {/* Inbuilt stories list */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className={`${isKids ? 'kids-hand text-sm' : 'text-xs'} font-medium text-[var(--ink)]`}>
              Quick stories
            </span>
            <span className={`${isKids ? 'kids-crayon text-xs font-bold text-[#8c2e59]' : 'eyebrow-mono text-[var(--muted-1)]'}`}>
              Instant load
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {PRESET_STORIES.map((preset, idx) => {
              const isSelected = activeSource === preset.id;
              const kidsCardCycle =
                idx % 3 === 0
                  ? 'bg-[#FFD6E0] border-[#eb9bb1]'
                  : idx % 3 === 1
                    ? 'bg-[#FFF1A8] border-[#e6ca5a]'
                    : 'bg-[#FFE0C2] border-[#eab27e]';

              return (
                <button
                  key={preset.id}
                  type="button"
                  disabled={isAnalyzing}
                  onClick={() => onSelectPreset(preset)}
                  className={`w-full text-left border px-3.5 py-2.5 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                    isKids
                      ? `kids-sticker-hover rounded-[20px] ${
                          isSelected
                            ? `border-2 border-dashed ${kidsCardCycle} text-[#4a2b4f]`
                            : 'bg-[#fffdf8] border-[#f3c4d6] text-[#4a2b4f] hover:bg-[#fff0f5]'
                        }`
                      : `rounded-md ${
                          isSelected
                            ? 'bg-[var(--active-tab-bg)] border-[var(--accent-bg)] text-[var(--ink)]'
                            : 'bg-[var(--card-bg)] border-[var(--line)] text-[var(--ink)] hover:bg-[var(--surface-hover)]'
                        }`
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-semibold leading-snug truncate">
                      {preset.title}
                    </span>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1 ${
                        isKids ? 'kids-crayon text-xs font-bold' : 'eyebrow-mono'
                      } ${isSelected ? 'text-[var(--active-tab-text)]' : 'text-[var(--muted-1)]'}`}
                    >
                      {isSelected ? (
                        'Loaded'
                      ) : (
                        <>
                          <span>Open</span>
                          <ArrowRight className="w-2.5 h-2.5" strokeWidth={iconStroke} />
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--muted-2)] truncate mt-0.5">
                    {preset.tagline}
                  </p>
                </button>
              );
            })}

            {/* Custom tab below the inbuilt stories */}
            <button
              type="button"
              onClick={onSelectCustomTab}
              className={`w-full text-left border px-3.5 py-2.5 mt-1 flex items-center justify-between transition-colors cursor-pointer ${
                isKids
                  ? `kids-sticker-hover rounded-[20px] ${
                      isCustomActive
                        ? 'bg-[#EFE4FF] border-2 border-dashed border-[#c7b0f0] text-[#4a2b4f]'
                        : 'bg-[#fffdf8] border-[#f3c4d6] text-[var(--muted-3)] hover:text-[#4a2b4f] hover:bg-[#fff0f5]'
                    }`
                  : `rounded-md ${
                      isCustomActive
                        ? 'bg-[var(--active-tab-bg)] border-[var(--accent-bg)] text-[var(--active-tab-text)]'
                        : 'bg-[var(--card-bg)] border-[var(--line)] text-[var(--muted-3)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)]'
                    }`
              }`}
            >
              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold">
                <PenLine className="w-3.5 h-3.5" strokeWidth={iconStroke} />
                <span>Custom story</span>
              </span>
              <span className={isKids ? 'kids-crayon text-xs font-bold' : 'eyebrow-mono'}>
                {isCustomActive ? 'Open' : 'Write'}
              </span>
            </button>
          </div>
        </div>

        {/* Custom Story textarea (shown under the Custom tab) */}
        {isCustomActive && (
          <div>
            <label
              htmlFor="story-textarea"
              className="block text-xs font-medium text-[var(--ink)] mb-1.5"
            >
              Your story
            </label>
            <textarea
              id="story-textarea"
              value={story}
              onChange={(e) => onStoryChange(e.target.value)}
              placeholder="Paste or type your story here…"
              className={`w-full h-[180px] resize-y ${isKids ? 'rounded-[20px]' : 'rounded-md'} border border-[var(--line)] bg-[var(--card-bg)] px-3 py-2.5 text-[12.5px] leading-[1.6] text-[var(--ink)] placeholder:text-[var(--muted-1)] focus:outline-none focus:border-[var(--accent-bg)]`}
            />
          </div>
        )}

        {/* Number of scenes */}
        <div>
          <label
            htmlFor="scene-count-input"
            className="block text-xs font-medium text-[var(--ink)] mb-1.5"
          >
            Number of scenes
          </label>
          <div className="flex items-center gap-2.5">
            <input
              id="scene-count-input"
              type="number"
              min={6}
              max={20}
              value={sceneCount}
              onChange={(e) => {
                const parsed = parseInt(e.target.value, 10);
                if (Number.isNaN(parsed)) {
                  onSceneCountChange(6);
                } else {
                  onSceneCountChange(Math.min(20, Math.max(6, parsed)));
                }
              }}
              className={`w-[75px] ${isKids ? 'rounded-[18px]' : 'rounded-md'} border border-[var(--line)] bg-[var(--card-bg)] px-2.5 py-1.5 text-[13px] text-[var(--ink)] tabular-nums focus:outline-none focus:border-[var(--accent-bg)]`}
            />
            <span className="text-xs text-[var(--muted-1)]">6–20 scenes</span>
          </div>
        </div>

        {/* Drawing style */}
        <div>
          <label
            htmlFor="drawing-style-select"
            className="block text-xs font-medium text-[var(--ink)] mb-1.5"
          >
            Drawing style
          </label>
          <select
            id="drawing-style-select"
            value={drawingStyle}
            onChange={(e) => onDrawingStyleChange(e.target.value as DrawingStyle)}
            className={`w-full ${isKids ? 'rounded-[18px]' : 'rounded-md'} border border-[var(--line)] bg-[var(--card-bg)] px-2.5 py-2 text-[13px] text-[var(--ink)] focus:outline-none focus:border-[var(--accent-bg)]`}
          >
            {DRAWING_STYLES.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>

        {/* Max images per story */}
        <div>
          <label
            htmlFor="max-images-input"
            className="block text-xs font-medium text-[var(--ink)] mb-1.5"
          >
            Max illustrations
          </label>
          <div className="flex items-center gap-2.5">
            <input
              id="max-images-input"
              type="number"
              min={1}
              max={20}
              value={maxImages}
              onChange={(e) => {
                const parsed = parseInt(e.target.value, 10);
                if (Number.isNaN(parsed)) {
                  onMaxImagesChange(12);
                } else {
                  onMaxImagesChange(Math.min(20, Math.max(1, parsed)));
                }
              }}
              className={`w-[75px] ${isKids ? 'rounded-[18px]' : 'rounded-md'} border border-[var(--line)] bg-[var(--card-bg)] px-2.5 py-1.5 text-[13px] text-[var(--ink)] tabular-nums focus:outline-none focus:border-[var(--accent-bg)]`}
            />
            <span className="text-xs text-[var(--muted-1)]">Up to 20 frames</span>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="pt-1">
          <button
            type="button"
            onClick={onIllustrateClick}
            disabled={!canIllustrate || isAnalyzing}
            className={`w-full font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              isKids
                ? `py-3.5 px-6 rounded-full text-base shadow-[var(--shadow-card)] ${
                    !canIllustrate || isAnalyzing
                      ? 'bg-[var(--chip-bg)] text-[var(--muted-1)] border border-[var(--line)] cursor-not-allowed'
                      : 'kids-sticker-hover bg-[#FFD6E0] border-2 border-[#eb9bb1] text-[#4a2b4f] hover:bg-[#ffcad7]'
                  }`
                : `py-2.5 px-4 rounded-md text-[13px] ${
                    !canIllustrate || isAnalyzing
                      ? 'bg-[var(--chip-bg)] text-[var(--muted-1)] border border-[var(--line)] cursor-not-allowed'
                      : 'bg-[var(--accent-bg)] text-white hover:bg-[var(--accent-hover)]'
                  }`
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" strokeWidth={iconStroke} />
            <span>
              {isAnalyzing
                ? 'Reading your story…'
                : activePreset
                  ? 'Redraw with these settings'
                  : 'Illustrate story'}
            </span>
          </button>

          <p
            role={statusNote.type === 'error' ? 'alert' : 'status'}
            className={`mt-3 text-xs leading-[1.5] ${
              statusNote.type === 'error'
                ? 'text-red-600 dark:text-red-300 font-medium'
                : statusNote.type === 'status'
                  ? 'text-[var(--active-tab-text)] font-medium'
                  : 'text-[var(--muted-2)]'
            }`}
          >
            {statusNote.text}
          </p>

          <p className="mt-1.5 text-[11px] leading-[1.5] text-[var(--muted-1)]">
            Character styling and visual continuity are preserved across all scenes.
          </p>
        </div>
      </div>
    </aside>
  );
};
