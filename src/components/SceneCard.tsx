import React, { useEffect, useState } from 'react';
import { useAppPreferences } from '../context/AppPreferencesContext';
import type { SceneState } from '../types';

interface SceneCardProps {
  scene: SceneState;
  layout: 'vertical' | 'horizontal';
  onRedraw: (sceneId: string, newPrompt: string) => void;
  onRetry: (sceneId: string) => void;
}

export const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  layout,
  onRedraw,
  onRetry,
}) => {
  const { theme } = useAppPreferences();
  const isKids = theme === 'kids';

  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [draftPrompt, setDraftPrompt] = useState(scene.image_prompt);

  useEffect(() => {
    setDraftPrompt(scene.image_prompt);
  }, [scene.image_prompt]);

  const isHorizontal = layout === 'horizontal';
  const sceneNumLabel = `Scene ${String(scene.index + 1).padStart(2, '0')}`;

  const handleSaveAndRedraw = () => {
    const trimmed = draftPrompt.trim() || scene.image_prompt;
    setIsEditingPrompt(false);
    onRedraw(scene.id, trimmed);
  };

  return (
    <article
      className={`scene-card overflow-hidden ${
        isHorizontal
          ? 'horizontal-card-item w-[350px] shrink-0 flex flex-col'
          : 'grid grid-cols-1 min-[541px]:grid-cols-[215px_1fr]'
      }`}
    >
      {/* Illustration Area */}
      <div
        className={`relative overflow-hidden bg-[var(--sidebar-bg)] border-b border-[var(--line)] ${
          isHorizontal
            ? 'h-[190px] w-full'
            : 'h-[185px] min-[541px]:h-auto min-[541px]:min-h-[162px] min-[541px]:border-b-0 min-[541px]:border-r'
        }`}
      >
        {scene.status === 'loading' && (
          <div className="sketch-shimmer w-full h-full flex items-center justify-center">
            <span className="font-display text-sm text-[var(--muted-3)]">
              Illustrating…
            </span>
          </div>
        )}

        {scene.status === 'ready' && scene.svg && (
          <div
            className="svg-doodle-frame w-full h-full"
            aria-label={`Illustration for ${scene.title}`}
            dangerouslySetInnerHTML={{ __html: scene.svg }}
          />
        )}

        {scene.status === 'error' && (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[var(--sidebar-bg)]">
            <p className="font-display text-sm text-red-600 dark:text-red-300 mb-2">
              Illustration failed
            </p>
            <button
              type="button"
              onClick={() => onRetry(scene.id)}
              className={`no-print px-3.5 py-1.5 ${isKids ? 'rounded-full' : 'rounded-md'} border border-[var(--line)] bg-[var(--card-bg)] text-xs font-medium text-[var(--ink)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer`}
            >
              Retry
            </button>
          </div>
        )}

        {(scene.status === 'skipped' || scene.status === 'idle') && (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[var(--sidebar-bg)]">
            <p className="font-display text-sm text-[var(--muted-1)] mb-2">
              {scene.status === 'skipped' ? 'Paused at max frames' : 'Waiting to illustrate'}
            </p>
            {scene.status === 'skipped' && (
              <button
                type="button"
                onClick={() => onRetry(scene.id)}
                className={`no-print px-3.5 py-1.5 ${isKids ? 'rounded-full' : 'rounded-md'} border border-[var(--line)] bg-[var(--card-bg)] text-xs font-medium text-[var(--ink)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer`}
              >
                Draw scene
              </button>
            )}
          </div>
        )}
      </div>

      {/* Details Area */}
      <div className="p-4 min-[541px]:px-5 min-[541px]:py-4 flex flex-col justify-between gap-2.5">
        <div>
          {/* Scene number / setting + mood */}
          <div className="flex items-center justify-between gap-2 mb-1.5 text-xs text-[var(--muted-2)]">
            <span className="truncate font-medium">
              {sceneNumLabel} · {scene.setting}
            </span>
            <span className="text-[11px] font-medium text-[var(--muted-1)] whitespace-nowrap shrink-0">
              {scene.mood}
            </span>
          </div>

          {/* Scene title */}
          <h3
            className={`font-display leading-[1.3] text-[var(--ink)] mb-1 ${
              isKids ? 'text-[1.28rem] font-bold' : 'text-lg font-medium'
            }`}
          >
            {scene.title}
          </h3>

          {/* One-line summary */}
          <p className="text-[13px] leading-[1.55] text-[var(--muted-3)]">
            {scene.one_line_summary}
          </p>
        </div>

        {/* Bottom row: characters + actions */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[var(--line)]">
          <span className="text-[11.5px] text-[var(--muted-1)] truncate">
            {scene.characters.length > 0 ? scene.characters.join(', ') : 'Setting focus'}
          </span>

          <div className="no-print flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setDraftPrompt(scene.image_prompt);
                setIsEditingPrompt((prev) => !prev);
              }}
              className="text-xs font-medium text-[var(--muted-2)] hover:text-[var(--ink)] transition-colors cursor-pointer"
            >
              Edit prompt
            </button>
            <button
              type="button"
              onClick={() => onRedraw(scene.id, scene.image_prompt)}
              disabled={scene.status === 'loading'}
              className="text-xs font-medium text-[var(--accent-text)] hover:opacity-80 disabled:opacity-40 transition-opacity cursor-pointer"
            >
              Redraw
            </button>
          </div>
        </div>

        {/* Expandable Edit Prompt Panel */}
        {isEditingPrompt && (
          <div
            className={`no-print mt-1 ${isKids ? 'rounded-[20px] border-2 border-dashed border-[#f3c4d6] bg-[#fff5f8]' : 'rounded-md border border-dashed border-[var(--line)] bg-[var(--paper)]'} p-3`}
          >
            <label
              htmlFor={`prompt-edit-${scene.id}`}
              className="block eyebrow-mono text-[var(--muted-3)] mb-1.5"
            >
              Illustration prompt
            </label>
            <textarea
              id={`prompt-edit-${scene.id}`}
              value={draftPrompt}
              onChange={(e) => setDraftPrompt(e.target.value)}
              rows={3}
              className={`w-full ${isKids ? 'rounded-[16px]' : 'rounded-md'} border border-[var(--line)] bg-[var(--card-bg)] p-2 font-dm-mono text-[11px] leading-[1.5] text-[var(--ink)] focus:outline-none focus:border-[var(--accent-bg)]`}
            />
            <div className="flex items-center justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  setDraftPrompt(scene.image_prompt);
                  setIsEditingPrompt(false);
                }}
                className={`px-3 py-1 ${isKids ? 'rounded-full bg-[#FFFDF0] border border-[#f3c4d6]' : 'rounded-md'} text-xs font-medium text-[var(--muted-3)] hover:text-[var(--ink)] cursor-pointer`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAndRedraw}
                className={`px-3.5 py-1 text-xs font-medium cursor-pointer ${
                  isKids
                    ? 'rounded-full bg-[#FFD6E0] border border-[#eb9bb1] text-[#4a2b4f] hover:bg-[#ffcad7]'
                    : 'rounded-md bg-[var(--accent-bg)] text-white hover:bg-[var(--accent-hover)]'
                }`}
              >
                Redraw
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
