import React, { createContext, useContext, useEffect, useState } from 'react';
import type {
  AvatarIconKey,
  FontSize,
  StudentLevel,
  ThemeMode,
  UserProfile,
} from '../types';

const STORAGE_KEYS = {
  THEME: 'sparkpad_theme_v1',
  FONT_SIZE: 'sparkpad_font_size_v1',
  PROFILE: 'sparkpad_profile_v1',
} as const;

export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  avatarType: 'initials',
  avatarIcon: 'book',
  level: 'school',
};

export const AVATAR_ICON_KEYS: AvatarIconKey[] = [
  'book',
  'compass',
  'feather',
  'layers',
  'sparkles',
  'graduation',
  'pen',
  'atom',
  'globe',
  'code',
  'music',
  'sun',
];

export function suggestedThemeForLevel(level: StudentLevel): ThemeMode {
  if (level === 'kid') return 'kids';
  if (level === 'college') return 'dark';
  return 'light';
}

interface AppPreferencesContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  resetPreferences: () => void;
}

const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(null);

function readStoredTheme(): ThemeMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.THEME);
    if (raw === 'kids' || raw === 'light' || raw === 'dark') return raw;
    if (raw === 'college') return 'dark';
  } catch {
    // Ignore storage read issues
  }
  return 'light';
}

function readStoredFontSize(): FontSize {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FONT_SIZE);
    if (raw === 'small' || raw === 'medium' || raw === 'large') return raw;
  } catch {
    // Ignore storage read issues
  }
  return 'medium';
}

function readStoredProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<UserProfile> & { avatarType?: string };
      const validIcon = AVATAR_ICON_KEYS.includes(parsed.avatarIcon as AvatarIconKey)
        ? (parsed.avatarIcon as AvatarIconKey)
        : 'book';
      return {
        name: typeof parsed.name === 'string' ? parsed.name : '',
        avatarType: parsed.avatarType === 'icon' ? 'icon' : 'initials',
        avatarIcon: validIcon,
        level:
          parsed.level === 'kid' || parsed.level === 'school' || parsed.level === 'college'
            ? parsed.level
            : 'school',
      };
    }
  } catch {
    // Ignore storage read issues
  }
  return DEFAULT_PROFILE;
}

export const AppPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(readStoredTheme);
  const [fontSize, setFontSizeState] = useState<FontSize>(readStoredFontSize);
  const [profile, setProfileState] = useState<UserProfile>(readStoredProfile);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-kids', 'theme-light', 'theme-dark', 'theme-college', 'dark');
    if (theme === 'dark') {
      root.classList.add('theme-dark', 'dark');
    } else if (theme === 'kids') {
      root.classList.add('theme-kids');
    } else {
      root.classList.add('theme-light');
    }
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {
      // Ignore storage write issues
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
    try {
      localStorage.setItem(STORAGE_KEYS.FONT_SIZE, fontSize);
    } catch {
      // Ignore storage write issues
    }
  }, [fontSize]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch {
      // Ignore storage write issues
    }
  }, [profile]);

  const setTheme = (next: ThemeMode) => setThemeState(next);
  const setFontSize = (next: FontSize) => setFontSizeState(next);
  const setProfile = (next: UserProfile) => setProfileState(next);

  const resetPreferences = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.THEME);
      localStorage.removeItem(STORAGE_KEYS.FONT_SIZE);
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
    } catch {
      // Ignore storage remove issues
    }
    setThemeState('light');
    setFontSizeState('medium');
    setProfileState(DEFAULT_PROFILE);
  };

  return (
    <AppPreferencesContext.Provider
      value={{
        theme,
        setTheme,
        fontSize,
        setFontSize,
        profile,
        setProfile,
        resetPreferences,
      }}
    >
      {children}
    </AppPreferencesContext.Provider>
  );
};

export function useAppPreferences(): AppPreferencesContextValue {
  const ctx = useContext(AppPreferencesContext);
  if (!ctx) {
    throw new Error('useAppPreferences must be used within AppPreferencesProvider');
  }
  return ctx;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'SP';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
