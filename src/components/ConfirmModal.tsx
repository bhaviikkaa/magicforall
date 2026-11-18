import React from 'react';
import { useAppPreferences } from '../context/AppPreferencesContext';

interface ConfirmModalProps {
  isOpen: boolean;
  sceneCount: number;
  estimateMinutes: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  sceneCount,
  estimateMinutes,
  onCancel,
  onConfirm,
}) => {
  const { theme } = useAppPreferences();
  const isKids = theme === 'kids';

  if (!isOpen) return null;

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className={`w-full max-w-[410px] border bg-[var(--card-bg)] p-6 shadow-xl ${
          isKids ? 'rounded-[26px] border-2 border-dashed border-[#f3c4d6]' : 'rounded-[10px] border-[var(--line)]'
        }`}
      >
        <h2
          id="confirm-modal-title"
          className={`font-display leading-tight text-[var(--ink)] mb-2 ${
            isKids ? 'text-[1.72rem] font-bold' : 'text-2xl font-medium'
          }`}
        >
          Ready to illustrate?
        </h2>

        <p className="text-[13px] leading-[1.6] text-[var(--muted-3)] mb-4">
          Your story will be divided into sequential scenes with a consistent character sheet and art direction throughout.
        </p>

        <div
          className={`${isKids ? 'rounded-[20px] bg-[#FFF1A8] border-[#e6ca5a]' : 'rounded-md bg-[var(--sidebar-bg)] border-[var(--line)]'} border px-3.5 py-2.5 text-xs font-medium text-[var(--ink)] mb-5 tabular-nums`}
        >
          {sceneCount} scenes · approximately {estimateMinutes} min
        </div>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className={`font-medium transition-colors cursor-pointer ${
              isKids
                ? 'px-5 py-2.5 rounded-full text-sm border border-[#f3c4d6] bg-[#FFFDF0] text-[#4a2b4f] hover:bg-[#fff0f5]'
                : 'px-4 py-2 rounded-md text-xs border border-[var(--line)] bg-[var(--card-bg)] text-[var(--muted-3)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`font-medium transition-colors cursor-pointer ${
              isKids
                ? 'px-5 py-2.5 rounded-full text-sm bg-[#FFD6E0] border-2 border-[#eb9bb1] text-[#4a2b4f] hover:bg-[#ffcad7]'
                : 'px-4 py-2 rounded-md text-xs bg-[var(--accent-bg)] text-white hover:bg-[var(--accent-hover)]'
            }`}
          >
            Generate scenes
          </button>
        </div>
      </div>
    </div>
  );
};
