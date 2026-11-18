import React from 'react';
import { MapPin, Sparkles, Users } from 'lucide-react';
import { useAppPreferences } from '../context/AppPreferencesContext';
import type { StoryAnalysis } from '../types';

interface MindMapProps {
  analysis: StoryAnalysis | null;
}

export const MindMap: React.FC<MindMapProps> = ({ analysis }) => {
  const { theme } = useAppPreferences();
  const isKids = theme === 'kids';
  const isDark = theme === 'dark';
  const strokeColor = isKids ? '#e89bb4' : isDark ? '#2f353f' : '#c8c5bc';
  const strokeWidth = isKids ? 2 : 1.5;

  if (!analysis) {
    return (
      <div
        className={`${isKids ? 'rounded-[24px] border-2 border-dashed border-[#f3c4d6] bg-[#fff7fa] shadow-[var(--shadow-card)]' : 'rounded-[10px] border border-dashed border-[var(--line)] bg-[var(--card-bg)]'} px-6 py-16 text-center`}
      >
        <p
          className={`font-display text-[var(--ink)] mb-1.5 ${
            isKids ? 'text-[1.72rem] font-bold' : 'text-2xl font-medium'
          }`}
        >
          No story map yet
        </p>
        <p className="text-sm text-[var(--muted-2)]">
          Select a story or paste your own in the sidebar to generate a visual story map.
        </p>
      </div>
    );
  }

  return (
    <section
      className={`${isKids ? 'rounded-[26px] border-2 border-dashed border-[#f3c4d6]' : 'rounded-[10px] border border-[var(--line)]'} p-6 min-[851px]:p-8 shadow-[var(--shadow-card)]`}
      style={{
        background: 'var(--canvas-bg)',
      }}
      aria-label="Story mind map"
    >
      <div className="relative flex flex-col min-[851px]:flex-row items-stretch min-[851px]:items-center gap-6 min-[851px]:gap-0">
        {/* Root Node on the left */}
        <div className="min-[851px]:w-[240px] shrink-0 flex items-center justify-center z-10">
          <div
            className={`w-full ${isKids ? 'rounded-[24px] bg-[#EFE4FF] border-2 border-dashed border-[#c7b0f0]' : 'rounded-[10px] bg-[var(--card-bg)] border border-[var(--line)]'} px-5 py-5 text-center shadow-[var(--shadow-card)]`}
          >
            <h3
              className={`font-display leading-[1.3] text-[var(--ink)] mb-1 ${
                isKids ? 'text-[1.42rem] font-bold' : 'text-xl font-medium'
              }`}
            >
              {analysis.story_title}
            </h3>
            <p className={`text-xs font-medium ${isKids ? 'kids-hand text-sm text-[#553a82]' : 'text-[var(--accent-text)]'}`}>
              {analysis.scenes.length} scenes · {analysis.character_sheet.length} characters
            </p>
          </div>
        </div>

        {/* Dashed curved SVG connector lines (hidden on mobile < 851px) */}
        <div
          className="hidden min-[851px]:block w-[76px] shrink-0 self-stretch relative"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 76 300"
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible"
          >
            <path
              d="M 0 150 C 36 150, 34 45, 76 45"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray="4 4"
              strokeLinecap="round"
            />
            <path
              d="M 0 150 L 76 150"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray="4 4"
              strokeLinecap="round"
            />
            <path
              d="M 0 150 C 36 150, 34 255, 76 255"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray="4 4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Three Branch Boxes */}
        <div className="flex-1 flex flex-col gap-4 z-10">
          {/* Characters */}
          <div
            className={`${isKids ? 'rounded-[24px] bg-[#FFD6E0] border-2 border-dashed border-[#eb9bb1]' : 'rounded-[10px] bg-[var(--card-bg)] border border-[var(--line)]'} p-4 shadow-[var(--shadow-card)]`}
          >
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted-2)] mb-2.5">
              <Users
                className={`w-3.5 h-3.5 ${isKids ? 'text-[#6b2d4b]' : 'text-[var(--accent-text)]'}`}
                strokeWidth={strokeWidth}
              />
              <span className={isKids ? 'kids-hand text-sm text-[#4a2b4f]' : ''}>Characters</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.character_sheet.length > 0 ? (
                analysis.character_sheet.map((char, idx) => (
                  <span
                    key={`${char.name}-${idx}`}
                    title={char.visual_description}
                    className={`inline-flex items-center px-3 py-1 ${isKids ? 'rounded-full bg-[#FFF7FA] border-[#eb9bb1]' : 'rounded-md bg-[var(--sidebar-bg)] border-[var(--line)]'} border text-xs font-medium text-[var(--ink)]`}
                  >
                    {char.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[var(--muted-1)]">No named characters</span>
              )}
            </div>
          </div>

          {/* Places */}
          <div
            className={`${isKids ? 'rounded-[24px] bg-[#FFF1A8] border-2 border-dashed border-[#e6ca5a]' : 'rounded-[10px] bg-[var(--card-bg)] border border-[var(--line)]'} p-4 shadow-[var(--shadow-card)]`}
          >
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted-2)] mb-2.5">
              <MapPin
                className={`w-3.5 h-3.5 ${isKids ? 'text-[#695214]' : 'text-[var(--accent-text)]'}`}
                strokeWidth={strokeWidth}
              />
              <span className={isKids ? 'kids-hand text-sm text-[#4a2b4f]' : ''}>Settings</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.places.length > 0 ? (
                analysis.places.map((place, idx) => (
                  <span
                    key={`${place}-${idx}`}
                    className={`inline-flex items-center px-3 py-1 ${isKids ? 'rounded-full bg-[#FFFDF0] border-[#e6ca5a]' : 'rounded-md bg-[var(--sidebar-bg)] border-[var(--line)]'} border text-xs font-medium text-[var(--ink)]`}
                  >
                    {place}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[var(--muted-1)]">No places extracted</span>
              )}
            </div>
          </div>

          {/* Key moments */}
          <div
            className={`${isKids ? 'rounded-[24px] bg-[#FFE0C2] border-2 border-dashed border-[#eab27e]' : 'rounded-[10px] bg-[var(--card-bg)] border border-[var(--line)]'} p-4 shadow-[var(--shadow-card)]`}
          >
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted-2)] mb-2.5">
              <Sparkles
                className={`w-3.5 h-3.5 ${isKids ? 'text-[#78431b]' : 'text-[var(--accent-text)]'}`}
                strokeWidth={strokeWidth}
              />
              <span className={isKids ? 'kids-hand text-sm text-[#4a2b4f]' : ''}>Key moments</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.key_moments.length > 0 ? (
                analysis.key_moments.map((moment, idx) => (
                  <span
                    key={`${moment}-${idx}`}
                    className={`inline-flex items-center px-3 py-1 ${isKids ? 'rounded-full bg-[#FFF9F3] border-[#eab27e]' : 'rounded-md bg-[var(--sidebar-bg)] border-[var(--line)]'} border text-xs font-medium text-[var(--ink)]`}
                  >
                    {moment}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[var(--muted-1)]">No key moments extracted</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom caption */}
      <p className="mt-6 pt-4 border-t border-[var(--line)] text-center text-xs text-[var(--muted-2)]">
        {analysis.mind_map_caption}
      </p>
    </section>
  );
};
