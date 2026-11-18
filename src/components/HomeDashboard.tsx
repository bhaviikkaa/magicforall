import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  FileText,
  Network,
  Plus,
} from 'lucide-react';
import { useAppPreferences } from '../context/AppPreferencesContext';
import { DASHBOARD_FEATURES, type DashboardFeatureItem } from '../data/features';
import type { AppPage } from '../types';
import { APP_NAME, APP_TAGLINE } from './TopBar';

interface HomeDashboardProps {
  onSelectPage: (page: AppPage) => void;
  onOpenProfile: () => void;
}

function FeatureIcon({
  iconName,
  strokeWidth,
}: {
  iconName: DashboardFeatureItem['iconName'];
  strokeWidth: number;
}) {
  const props = { className: 'w-5 h-5', strokeWidth };
  switch (iconName) {
    case 'book-open':
      return <BookOpen {...props} />;
    case 'network':
      return <Network {...props} />;
    case 'file-text':
      return <FileText {...props} />;
    default:
      return <Plus {...props} />;
  }
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onSelectPage,
  onOpenProfile,
}) => {
  const { theme, profile } = useAppPreferences();
  const isKids = theme === 'kids';
  const stroke = isKids ? 2 : 1.5;

  const [comingSoonNotice, setComingSoonNotice] = useState(false);

  const trimmedName = profile.name.trim();
  const greetingText = trimmedName ? `Welcome back, ${trimmedName}` : 'Welcome back';

  const handleCardClick = (item: DashboardFeatureItem) => {
    if (item.isComingSoon || !item.targetPage) {
      setComingSoonNotice(true);
      return;
    }
    setComingSoonNotice(false);
    onSelectPage(item.targetPage);
  };

  return (
    <main className="flex-1 w-full max-w-[1120px] mx-auto px-5 sm:px-8 py-10 sm:py-14">
      {/* Hero Header */}
      <section
        className={`mb-10 sm:mb-12 transition-all duration-200 ${
          isKids
            ? 'rounded-[26px] border-2 border-dashed border-[#f3c4d6] bg-[#fff7fa] px-6 py-8 sm:px-9 sm:py-9 shadow-[var(--shadow-card)]'
            : 'pb-8 border-b border-[var(--line)]'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p
              className={`font-semibold text-[var(--accent-text)] mb-2 ${
                isKids ? 'kids-hand text-base' : 'text-sm'
              }`}
            >
              {greetingText}
            </p>

            <h1
              className={`font-display tracking-tight text-[var(--ink)] leading-[1.2] text-balance ${
                isKids
                  ? 'text-[2.15rem] sm:text-[2.6rem] md:text-[3.125rem] font-bold'
                  : 'text-3xl sm:text-4xl md:text-[2.75rem] font-semibold'
              }`}
            >
              {APP_NAME}
            </h1>

            <p className="mt-3 text-base sm:text-lg text-[var(--muted-2)] max-w-[54ch] leading-relaxed">
              {APP_TAGLINE} Select a workspace below to illustrate narratives, map concepts, or organize lecture notes.
            </p>
          </div>

          {!trimmedName && (
            <button
              type="button"
              onClick={onOpenProfile}
              className={`self-start sm:self-end shrink-0 whitespace-nowrap inline-flex items-center gap-2 font-medium transition-all duration-150 cursor-pointer ${
                isKids
                  ? 'kids-sticker-hover rounded-full px-6 py-3 text-base bg-[#FFD6E0] border-2 border-[#eb9bb1] text-[#4a2b4f] hover:bg-[#ffcad7] shadow-[var(--shadow-card)]'
                  : 'rounded-md px-4 py-2.5 text-xs border border-[var(--line)] bg-[var(--card-bg)] text-[var(--ink)] hover:bg-[var(--surface-hover)] shadow-[var(--shadow-card)]'
              }`}
            >
              <span>Personalize profile</span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={stroke} />
            </button>
          )}
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section aria-label="Study workspaces">
        <div className="flex items-baseline justify-between mb-5">
          <h2
            className={`font-display text-[var(--ink)] ${
              isKids ? 'text-[1.45rem] sm:text-[1.75rem] font-bold' : 'text-xl sm:text-2xl font-medium'
            }`}
          >
            Workspaces
          </h2>
          <span
            className={
              isKids
                ? 'kids-crayon text-sm font-bold text-[#8c2e59] bg-[#FFF1A8] border border-[#e6ca5a] px-3 py-0.5 rounded-full'
                : 'text-xs text-[var(--muted-1)]'
            }
          >
            {DASHBOARD_FEATURES.filter((f) => !f.isComingSoon).length} available tools
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {DASHBOARD_FEATURES.map((item) => {
            const isSoon = Boolean(item.isComingSoon);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleCardClick(item)}
                className={`group text-left p-6 sm:p-7 border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-bg)] ${
                  isKids
                    ? `kids-sticker-hover rounded-[24px] ${item.kidsCardStyle} shadow-[var(--shadow-card)]`
                    : `rounded-[10px] ${
                        isSoon
                          ? 'border-dashed border-[var(--line)] bg-[var(--card-bg)]/60 hover:bg-[var(--card-bg)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]'
                          : 'border-[var(--line)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] hover:border-[var(--muted-1)]/45'
                      }`
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                      isKids
                        ? `w-13 h-13 rounded-[20px] ${item.kidsIconStyle}`
                        : `w-10 h-10 rounded-lg ${
                            isSoon
                              ? 'border-[var(--line)] bg-[var(--sidebar-bg)] text-[var(--muted-2)]'
                              : 'border-[var(--line)] bg-[var(--accent-soft)] text-[var(--accent-text)]'
                          }`
                    }`}
                  >
                    <FeatureIcon iconName={item.iconName} strokeWidth={stroke} />
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 transition-all duration-200 ${
                      isKids
                        ? `${isSoon ? 'kids-crayon text-sm font-bold' : 'kids-hand text-sm font-medium'} px-3 py-1 rounded-full ${item.kidsActionStyle} group-hover:translate-x-0.5`
                        : `text-xs font-semibold ${
                            isSoon
                              ? 'text-[var(--muted-1)]'
                              : 'text-[var(--muted-2)] group-hover:text-[var(--accent-text)] group-hover:translate-x-0.5'
                          }`
                    }`}
                  >
                    <span>{isSoon ? 'Planned' : 'Open'}</span>
                    {!isSoon && <ArrowRight className="w-3.5 h-3.5" strokeWidth={stroke} />}
                  </span>
                </div>

                <div>
                  <h3
                    className={`font-display text-[var(--ink)] mb-1.5 ${
                      isKids ? 'text-[1.42rem] font-bold' : 'text-xl font-medium'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--muted-2)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {comingSoonNotice && (
          <div
            role="status"
            className={`mt-6 px-4 py-3 border bg-[var(--card-bg)] text-sm text-[var(--ink-secondary)] flex items-center justify-between gap-4 shadow-[var(--shadow-card)] ${
              isKids ? 'rounded-[22px] border-2 border-dashed border-[#c7b0f0] bg-[#faf6ff]' : 'rounded-lg border-[var(--line)]'
            }`}
          >
            <span>
              Additional study tools such as flashcards and practice quizzes are planned for a future update.
            </span>
            <button
              type="button"
              onClick={() => setComingSoonNotice(false)}
              className="text-xs font-semibold text-[var(--accent-text)] hover:underline shrink-0 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
      </section>
    </main>
  );
};
