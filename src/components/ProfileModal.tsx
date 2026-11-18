import React, { useEffect, useState } from 'react';
import { Check, Sparkles, X } from 'lucide-react';
import {
  AVATAR_ICON_KEYS,
  getInitials,
  suggestedThemeForLevel,
  useAppPreferences,
} from '../context/AppPreferencesContext';
import type {
  AvatarIconKey,
  AvatarType,
  StudentLevel,
  ThemeMode,
  UserProfile,
} from '../types';
import { AvatarBadge, renderAvatarIcon } from './AvatarBadge';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LEVEL_OPTIONS: Array<{
  value: StudentLevel;
  label: string;
  hint: string;
}> = [
  {
    value: 'kid',
    label: 'Kid',
    hint: 'Early learning and illustrated stories',
  },
  {
    value: 'school',
    label: 'School',
    hint: 'Projects, concepts, and study maps',
  },
  {
    value: 'college',
    label: 'College',
    hint: 'Lectures, formulas, and structured notes',
  },
];

const THEME_LABELS: Record<ThemeMode, string> = {
  kids: 'Kids theme',
  light: 'Light theme',
  dark: 'Dark theme',
};

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme, profile, setProfile } = useAppPreferences();
  const isKids = theme === 'kids';
  const stroke = isKids ? 2 : 1.5;

  const [draftName, setDraftName] = useState(profile.name);
  const [draftAvatarType, setDraftAvatarType] = useState<AvatarType>(profile.avatarType);
  const [draftIcon, setDraftIcon] = useState<AvatarIconKey>(profile.avatarIcon);
  const [draftLevel, setDraftLevel] = useState<StudentLevel>(profile.level);
  const [suggestedBanner, setSuggestedBanner] = useState<ThemeMode | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setDraftName(profile.name);
    setDraftAvatarType(profile.avatarType);
    setDraftIcon(profile.avatarIcon);
    setDraftLevel(profile.level);
    setSuggestedBanner(null);
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const initials = getInitials(draftName || 'SparkPad');

  const handleSelectLevel = (level: StudentLevel) => {
    setDraftLevel(level);
    const recommended = suggestedThemeForLevel(level);
    if (recommended !== theme) {
      setSuggestedBanner(recommended);
    } else {
      setSuggestedBanner(null);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      name: draftName.trim(),
      avatarType: draftAvatarType,
      avatarIcon: draftIcon,
      level: draftLevel,
    };
    setProfile(updated);
    onClose();
  };

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full max-w-[460px] max-h-[90vh] overflow-y-auto border bg-[var(--card-bg)] text-[var(--ink)] p-6 shadow-xl ${
          isKids ? 'rounded-[26px] border-2 border-dashed border-[#f3c4d6]' : 'rounded-[10px] border-[var(--line)]'
        }`}
      >
        <div className="flex items-start justify-between gap-3 mb-6">
          <div>
            <h2
              id="profile-modal-title"
              className={`font-display text-[var(--ink)] ${
                isKids ? 'text-[1.72rem] font-bold' : 'text-2xl font-medium'
              }`}
            >
              Profile
            </h2>
            <p className="text-xs text-[var(--muted-2)] mt-1">
              Stored locally in your browser without requiring an account.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile"
            className={`p-2 text-[var(--muted-1)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)] cursor-pointer transition-colors ${
              isKids ? 'rounded-full' : 'rounded-md'
            }`}
          >
            <X className="w-4 h-4" strokeWidth={stroke} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Preview & Name */}
          <div className="flex items-center gap-4">
            <AvatarBadge
              avatarType={draftAvatarType}
              avatarIcon={draftIcon}
              initials={initials}
              size="lg"
            />

            <div className="flex-1 min-w-0">
              <label
                htmlFor="profile-name-input"
                className="block text-xs font-medium text-[var(--ink-secondary)] mb-1.5"
              >
                Display name
              </label>
              <input
                id="profile-name-input"
                type="text"
                maxLength={32}
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="Enter your name"
                className={`w-full border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--muted-1)] focus:outline-none focus:border-[var(--accent-bg)] ${
                  isKids ? 'rounded-[20px]' : 'rounded-md'
                }`}
              />
            </div>
          </div>

          {/* Avatar Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[var(--ink-secondary)]">Avatar</span>
              <div
                className={`inline-flex p-0.5 border border-[var(--line)] bg-[var(--sidebar-bg)] ${
                  isKids ? 'rounded-full' : 'rounded-md'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setDraftAvatarType('initials')}
                  className={`px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                    isKids ? 'rounded-full' : 'rounded-[5px]'
                  } ${
                    draftAvatarType === 'initials'
                      ? isKids
                        ? 'bg-[#FFF1A8] text-[#4a2b4f] shadow-[var(--shadow-card)]'
                        : 'bg-[var(--card-bg)] text-[var(--ink)] shadow-[var(--shadow-card)]'
                      : 'text-[var(--muted-2)] hover:text-[var(--ink)]'
                  }`}
                >
                  Initials ({initials})
                </button>
                <button
                  type="button"
                  onClick={() => setDraftAvatarType('icon')}
                  className={`px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                    isKids ? 'rounded-full' : 'rounded-[5px]'
                  } ${
                    draftAvatarType === 'icon'
                      ? isKids
                        ? 'bg-[#FFF1A8] text-[#4a2b4f] shadow-[var(--shadow-card)]'
                        : 'bg-[var(--card-bg)] text-[var(--ink)] shadow-[var(--shadow-card)]'
                      : 'text-[var(--muted-2)] hover:text-[var(--ink)]'
                  }`}
                >
                  Icon
                </button>
              </div>
            </div>

            {draftAvatarType === 'icon' && (
              <div className="grid grid-cols-6 gap-2">
                {AVATAR_ICON_KEYS.map((iconKey) => {
                  const selected = draftIcon === iconKey;
                  return (
                    <button
                      key={iconKey}
                      type="button"
                      onClick={() => setDraftIcon(iconKey)}
                      aria-label={`Select ${iconKey} avatar`}
                      className={`h-10 flex items-center justify-center border transition-colors cursor-pointer ${
                        isKids ? 'rounded-2xl' : 'rounded-md'
                      } ${
                        selected
                          ? isKids
                            ? 'border-[#eb9bb1] bg-[#FFD6E0] text-[#4a2b4f]'
                            : 'border-[var(--accent-bg)] bg-[var(--accent-soft)] text-[var(--accent-text)]'
                          : 'border-[var(--line)] bg-[var(--paper)] text-[var(--muted-2)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)]'
                      }`}
                    >
                      {renderAvatarIcon(iconKey, 'w-4 h-4', stroke)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Student Level */}
          <div>
            <span className="block text-xs font-medium text-[var(--ink-secondary)] mb-2">
              Academic level
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {LEVEL_OPTIONS.map((opt) => {
                const selected = draftLevel === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectLevel(opt.value)}
                    className={`p-3 text-left border transition-colors cursor-pointer ${
                      isKids ? 'rounded-[20px]' : 'rounded-md'
                    } ${
                      selected
                        ? isKids
                          ? 'border-2 border-dashed border-[#eab27e] bg-[#FFE0C2] text-[#4a2b4f]'
                          : 'border-[var(--accent-bg)] bg-[var(--accent-soft)] text-[var(--ink)]'
                        : 'border-[var(--line)] bg-[var(--paper)] text-[var(--ink-secondary)] hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm font-semibold">{opt.label}</span>
                      {selected && (
                        <Check className="w-3.5 h-3.5 text-[var(--accent-text)] shrink-0" strokeWidth={stroke} />
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--muted-2)] mt-1 leading-snug">
                      {opt.hint}
                    </p>
                  </button>
                );
              })}
            </div>

            {suggestedBanner && (
              <div
                role="status"
                className={`mt-3 p-3 border border-[var(--line)] bg-[var(--accent-soft)] flex items-center justify-between gap-3 ${
                  isKids ? 'rounded-[20px] border-dashed' : 'rounded-md'
                }`}
              >
                <div className="flex items-center gap-2 text-xs text-[var(--ink)]">
                  <Sparkles className="w-4 h-4 text-[var(--accent-text)] shrink-0" strokeWidth={stroke} />
                  <span>
                    <strong>{THEME_LABELS[suggestedBanner]}</strong> is suggested for{' '}
                    <span className="capitalize">{draftLevel}</span> level.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTheme(suggestedBanner);
                    setSuggestedBanner(null);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                    isKids
                      ? 'rounded-full bg-[#FFF1A8] border border-[#e6ca5a] text-[#4a2b4f] hover:bg-[#ffec8f]'
                      : 'rounded-md text-white bg-[var(--accent-bg)] hover:bg-[var(--accent-hover)]'
                  }`}
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--line)]">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-xs font-medium border border-[var(--line)] text-[var(--muted-2)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)] cursor-pointer ${
                isKids ? 'rounded-full px-5 py-2.5 text-sm bg-[#FFFDF0]' : 'rounded-md'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-xs font-medium transition-colors cursor-pointer ${
                isKids
                  ? 'rounded-full px-6 py-2.5 text-sm bg-[#FFD6E0] border-2 border-[#eb9bb1] text-[#4a2b4f] hover:bg-[#ffcad7] shadow-[var(--shadow-card)]'
                  : 'rounded-md text-white bg-[var(--accent-bg)] hover:bg-[var(--accent-hover)]'
              }`}
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
