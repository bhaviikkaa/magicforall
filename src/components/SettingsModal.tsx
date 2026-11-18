import React, { useState } from 'react';
import { Moon, RotateCcw, Sparkles, Sun, X } from 'lucide-react';
import { useAppPreferences } from '../context/AppPreferencesContext';
import type { FontSize, ThemeMode } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetAllData: () => void;
}

const FONT_SIZE_OPTIONS: Array<{ value: FontSize; label: string; sample: string }> = [
  { value: 'small', label: 'Small', sample: 'Aa' },
  { value: 'medium', label: 'Medium', sample: 'Aa' },
  { value: 'large', label: 'Large', sample: 'Aa' },
];

const THEME_CHOICES: Array<{
  value: ThemeMode;
  label: string;
  description: string;
  Icon: typeof Sun;
}> = [
  {
    value: 'kids',
    label: 'Kids',
    description: 'Soft pastels, rounded cards, friendly type.',
    Icon: Sparkles,
  },
  {
    value: 'light',
    label: 'Light',
    description: 'Warm off-white canvas with refined serif type.',
    Icon: Sun,
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Near-black canvas with soft off-white type.',
    Icon: Moon,
  },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetAllData,
}) => {
  const { theme, setTheme, fontSize, setFontSize } = useAppPreferences();
  const isKids = theme === 'kids';
  const stroke = isKids ? 2 : 1.5;

  const [confirmingReset, setConfirmingReset] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setConfirmingReset(false);
    onClose();
  };

  const handleConfirmReset = () => {
    onResetAllData();
    setConfirmingReset(false);
    onClose();
  };

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className={`w-full max-w-[480px] max-h-[90vh] overflow-y-auto border bg-[var(--card-bg)] text-[var(--ink)] p-6 shadow-xl ${
          isKids ? 'rounded-[26px] border-2 border-dashed border-[#f3c4d6]' : 'rounded-[10px] border-[var(--line)]'
        }`}
      >
        <div className="flex items-start justify-between gap-3 mb-6">
          <div>
            <h2
              id="settings-modal-title"
              className={`font-display text-[var(--ink)] ${
                isKids ? 'text-[1.72rem] font-bold' : 'text-2xl font-medium'
              }`}
            >
              Settings
            </h2>
            <p className="text-xs text-[var(--muted-2)] mt-1">
              Customize appearance, reading size, and saved preferences.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close settings"
            className={`p-2 text-[var(--muted-1)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)] cursor-pointer transition-colors ${
              isKids ? 'rounded-full' : 'rounded-md'
            }`}
          >
            <X className="w-4 h-4" strokeWidth={stroke} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <span className="block text-xs font-medium text-[var(--ink-secondary)] mb-2">
              Theme
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {THEME_CHOICES.map(({ value, label, description, Icon }) => {
                const active = theme === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTheme(value)}
                    className={`p-3 text-left border transition-colors cursor-pointer ${
                      isKids ? 'rounded-[20px]' : 'rounded-md'
                    } ${
                      active
                        ? isKids
                          ? 'border-2 border-dashed border-[#eb9bb1] bg-[#FFD6E0] text-[#4a2b4f]'
                          : 'border-[var(--accent-bg)] bg-[var(--accent-soft)] text-[var(--ink)]'
                        : 'border-[var(--line)] bg-[var(--paper)] text-[var(--ink-secondary)] hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-sm mb-1">
                      <Icon className="w-4 h-4 text-[var(--accent-text)]" strokeWidth={stroke} />
                      <span>{label}</span>
                    </div>
                    <p className="text-[11px] text-[var(--muted-2)] leading-snug">
                      {description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <span className="block text-xs font-medium text-[var(--ink-secondary)] mb-2">
              Font size
            </span>
            <div className="grid grid-cols-3 gap-2">
              {FONT_SIZE_OPTIONS.map((opt) => {
                const active = fontSize === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFontSize(opt.value)}
                    className={`py-2.5 px-3 border text-center transition-colors cursor-pointer ${
                      isKids ? 'rounded-[20px]' : 'rounded-md'
                    } ${
                      active
                        ? isKids
                          ? 'border-2 border-dashed border-[#e6ca5a] bg-[#FFF1A8] text-[#4a2b4f] font-semibold'
                          : 'border-[var(--accent-bg)] bg-[var(--accent-soft)] text-[var(--ink)] font-semibold'
                        : 'border-[var(--line)] bg-[var(--paper)] text-[var(--ink-secondary)] hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    <span
                      className={`block font-medium leading-none mb-1 ${
                        opt.value === 'small'
                          ? 'text-xs'
                          : opt.value === 'medium'
                            ? 'text-sm'
                            : 'text-base'
                      }`}
                    >
                      {opt.sample}
                    </span>
                    <span className="text-xs">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset my data */}
          <div className="pt-4 border-t border-[var(--line)]">
            <span className="block text-xs font-medium text-[var(--ink-secondary)] mb-1">
              Data &amp; preferences
            </span>
            <p className="text-xs text-[var(--muted-2)] mb-3 leading-relaxed">
              Clears your saved profile, appearance preferences, and current workspace items.
            </p>

            {!confirmingReset ? (
              <button
                type="button"
                onClick={() => setConfirmingReset(true)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] hover:border-red-400/60 hover:text-red-600 dark:hover:text-red-300 transition-colors cursor-pointer ${
                  isKids ? 'rounded-full px-5 py-2.5 text-sm bg-[#FFE0C2] border-[#eab27e]' : 'rounded-md'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" strokeWidth={stroke} />
                <span>Reset my data</span>
              </button>
            ) : (
              <div
                className={`p-3 border border-red-400/40 bg-red-500/8 flex flex-wrap items-center justify-between gap-2 ${
                  isKids ? 'rounded-[20px]' : 'rounded-md'
                }`}
              >
                <span className="text-xs font-medium text-[var(--ink)]">
                  Reset all saved settings and workspace?
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmingReset(false)}
                    className={`px-3 py-1.5 text-xs font-medium border border-[var(--line)] bg-[var(--card-bg)] text-[var(--ink)] cursor-pointer ${
                      isKids ? 'rounded-full px-4' : 'rounded-md'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmReset}
                    className={`px-3 py-1.5 text-xs font-medium bg-red-600 text-white hover:bg-red-700 cursor-pointer ${
                      isKids ? 'rounded-full px-4' : 'rounded-md'
                    }`}
                  >
                    Confirm reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
