import React from 'react';
import { Moon, Settings, Sparkles, Sun } from 'lucide-react';
import { getInitials, useAppPreferences } from '../context/AppPreferencesContext';
import type { AppPage, ThemeMode } from '../types';
import { AvatarBadge } from './AvatarBadge';

export const APP_NAME = 'SparkPad';
export const APP_TAGLINE = 'Learn, create, and explore.';

interface TopBarProps {
  activePage: AppPage;
  onGoHome: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
}

const THEME_OPTIONS: Array<{
  id: ThemeMode;
  label: string;
  Icon: typeof Sun;
}> = [
  { id: 'kids', label: 'Kids', Icon: Sparkles },
  { id: 'light', label: 'Light', Icon: Sun },
  { id: 'dark', label: 'Dark', Icon: Moon },
];

export const TopBar: React.FC<TopBarProps> = ({
  activePage,
  onGoHome,
  onOpenSettings,
  onOpenProfile,
}) => {
  const { theme, setTheme, profile } = useAppPreferences();
  const isKids = theme === 'kids';
  const stroke = isKids ? 2 : 1.5;

  const displayName = profile.name.trim();
  const initials = getInitials(displayName || 'SparkPad');

  return (
    <header
      className={`no-print sticky top-0 z-30 h-16 w-full border-b backdrop-blur-md transition-colors duration-200 ${
        isKids
          ? 'border-[#f3c4d6] bg-[#fff7fa]/95 shadow-[0_3px_12px_rgba(217,114,152,0.10)]'
          : 'border-[var(--line)] bg-[var(--header-bg)]/95'
      }`}
    >
      <div className="max-w-[1320px] h-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Left: Geometric monogram mark + wordmark (clicking goes Home) */}
        <button
          type="button"
          onClick={onGoHome}
          aria-label={`${APP_NAME} home`}
          title={activePage === 'home' ? APP_NAME : 'Return to dashboard'}
          className={`group flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-bg)] py-1 pr-2 transition-opacity duration-150 hover:opacity-85 ${
            isKids ? 'rounded-2xl' : 'rounded-md'
          }`}
        >
          <span
            className={`w-8 h-8 border flex items-center justify-center shrink-0 shadow-[var(--shadow-card)] ${
              isKids
                ? 'rounded-2xl bg-[#FFD6E0] border-[#eb9bb1] text-[#4a2b4f]'
                : 'rounded-md border-[var(--line)] bg-[var(--card-bg)] text-[var(--accent-text)]'
            }`}
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-4 h-4"
              stroke="currentColor"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="4" width="16" height="16" rx={isKids ? 5 : 2} />
              <path d="M9 4v16" />
              <path d="M13.5 9.5h3" />
              <path d="M13.5 13h2" />
            </svg>
          </span>
          <span
            className={`font-display tracking-tight text-[var(--ink)] ${
              isKids ? 'text-[1.45rem] font-bold' : 'text-lg font-semibold'
            }`}
          >
            {APP_NAME}
          </span>
        </button>

        {/* Right: Kids / Light / Dark switcher, Settings, Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* 3-Option Theme Switcher */}
          <div
            role="group"
            aria-label="Theme switcher"
            className={`inline-flex items-center p-0.5 border ${
              isKids
                ? 'rounded-full border-[#f3c4d6] bg-[#fff0f5]'
                : 'rounded-md border-[var(--line)] bg-[var(--sidebar-bg)]'
            }`}
          >
            {THEME_OPTIONS.map(({ id, label, Icon }) => {
              const active = theme === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTheme(id)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                    isKids ? 'rounded-full text-sm px-3' : 'rounded-[5px] text-xs'
                  } ${
                    active
                      ? isKids
                        ? 'bg-[#FFF1A8] text-[#4a2b4f] border border-[#e6ca5a] shadow-[var(--shadow-card)]'
                        : 'bg-[var(--card-bg)] text-[var(--ink)] shadow-[var(--shadow-card)]'
                      : 'text-[var(--muted-2)] hover:text-[var(--ink)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={stroke} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Settings */}
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Open settings"
            className={`inline-flex items-center gap-1.5 px-3 py-2 border font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-bg)] ${
              isKids
                ? 'rounded-full text-sm px-3.5 border-[#f3c4d6] bg-[#FFE0C2] text-[#4a2b4f] hover:bg-[#ffd5ad]'
                : 'rounded-md text-xs border-[var(--line)] bg-[var(--card-bg)] text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            <Settings className="w-3.5 h-3.5" strokeWidth={stroke} />
            <span className="hidden md:inline">Settings</span>
          </button>

          {/* Profile */}
          <button
            type="button"
            onClick={onOpenProfile}
            aria-label="Open profile"
            className={`inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 border font-medium text-[var(--ink)] whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-bg)] ${
              isKids
                ? 'rounded-full text-sm border-[#f3c4d6] bg-[#FFD6E0] hover:bg-[#ffcad7]'
                : 'rounded-md text-xs border-[var(--line)] bg-[var(--card-bg)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            <AvatarBadge
              avatarType={profile.avatarType}
              avatarIcon={profile.avatarIcon}
              initials={initials}
              size="sm"
            />
            <span className="hidden sm:inline max-w-[96px] truncate">
              {displayName || 'Profile'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
