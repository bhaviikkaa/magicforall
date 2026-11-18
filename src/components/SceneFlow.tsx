import React from 'react';
import { useAppPreferences } from '../context/AppPreferencesContext';
import type { SceneState } from '../types';
import { SceneCard } from './SceneCard';

const DOT_COLORS_LIGHT = [
  '#d8e2dc',
  '#e2ddd5',
  '#dce3e8',
  '#e7dcd8',
  '#dedce6',
  '#e6e1d3',
];

const DOT_COLORS_KIDS = [
  '#FFD6E0',
  '#FFF1A8',
  '#FFE0C2',
  '#EFE4FF',
  '#DCF7EA',
  '#FFC8D8',
];

const DOT_COLORS_DARK = [
  '#4c7d65',
  '#6c7883',
  '#56788d',
  '#8c6d67',
  '#756e8f',
  '#8b8265',
];

interface SceneFlowProps {
  scenes: SceneState[];
  mode: 'vertical' | 'horizontal';
  onRedraw: (sceneId: string, newPrompt: string) => void;
  onRetry: (sceneId: string) => void;
}

export const SceneFlow: React.FC<SceneFlowProps> = ({
  scenes,
  mode,
  onRedraw,
  onRetry,
}) => {
  const { theme } = useAppPreferences();
  const isKids = theme === 'kids';
  const dotPalette =
    theme === 'kids'
      ? DOT_COLORS_KIDS
      : theme === 'light'
        ? DOT_COLORS_LIGHT
        : DOT_COLORS_DARK;

  if (scenes.length === 0) {
    return (
      <div
        className={`${isKids ? 'rounded-[24px] border-2 border-dashed border-[#f3c4d6] bg-[#fff7fa] shadow-[var(--shadow-card)]' : 'rounded-[10px] border border-dashed border-[var(--line)] bg-[var(--card-bg)]'} px-6 py-16 text-center`}
      >
        <p
          className={`font-display text-[var(--ink)] mb-1.5 ${
            isKids ? 'text-[1.72rem] font-bold' : 'text-2xl font-medium'
          }`}
        >
          No scenes generated yet
        </p>
        <p className="text-sm text-[var(--muted-2)]">
          Select a story or paste your own in the sidebar to begin illustrating.
        </p>
      </div>
    );
  }

  if (mode === 'horizontal') {
    return (
      <div className="horizontal-flow-scroll horizontal-flow-container flex items-stretch gap-4 overflow-x-auto pb-4">
        {scenes.map((scene) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            layout="horizontal"
            onRedraw={onRedraw}
            onRetry={onRetry}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="timeline-track relative pl-8 min-[541px]:pl-10">
      {/* Vertical dashed timeline line */}
      <div
        className="timeline-line absolute left-[8.5px] top-6 bottom-6 w-0 border-l border-dashed border-[var(--line)]"
        aria-hidden="true"
      />

      <div className="flex flex-col gap-5">
        {scenes.map((scene, idx) => {
          const dotColor = dotPalette[idx % dotPalette.length];
          return (
            <div key={scene.id} className="relative">
              <span
                className="timeline-dot absolute -left-8 min-[541px]:-left-10 top-6 w-[18px] h-[18px] rounded-full border-4 border-[var(--paper)]"
                style={{ backgroundColor: dotColor }}
                aria-hidden="true"
              />
              <SceneCard
                scene={scene}
                layout="vertical"
                onRedraw={onRedraw}
                onRetry={onRetry}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
