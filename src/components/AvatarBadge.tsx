import React from 'react';
import {
  Atom,
  BookOpen,
  Code2,
  Compass,
  Feather,
  Globe,
  GraduationCap,
  Layers,
  Music,
  PenTool,
  Sparkles,
  Sun,
} from 'lucide-react';
import { useAppPreferences } from '../context/AppPreferencesContext';
import type { AvatarIconKey } from '../types';

export function renderAvatarIcon(
  key: AvatarIconKey,
  className = 'w-3.5 h-3.5',
  strokeWidth = 1.5,
) {
  const props = { className, strokeWidth };
  switch (key) {
    case 'book':
      return <BookOpen {...props} />;
    case 'compass':
      return <Compass {...props} />;
    case 'feather':
      return <Feather {...props} />;
    case 'layers':
      return <Layers {...props} />;
    case 'sparkles':
      return <Sparkles {...props} />;
    case 'graduation':
      return <GraduationCap {...props} />;
    case 'pen':
      return <PenTool {...props} />;
    case 'atom':
      return <Atom {...props} />;
    case 'globe':
      return <Globe {...props} />;
    case 'code':
      return <Code2 {...props} />;
    case 'music':
      return <Music {...props} />;
    case 'sun':
      return <Sun {...props} />;
    default:
      return <BookOpen {...props} />;
  }
}

interface AvatarBadgeProps {
  avatarType: 'icon' | 'initials';
  avatarIcon: AvatarIconKey;
  initials: string;
  size?: 'sm' | 'lg';
}

export const AvatarBadge: React.FC<AvatarBadgeProps> = ({
  avatarType,
  avatarIcon,
  initials,
  size = 'sm',
}) => {
  const { theme } = useAppPreferences();
  const isKids = theme === 'kids';
  const dimensions = size === 'lg' ? 'w-12 h-12 text-sm' : 'w-6 h-6 text-[10px]';
  const iconSize = size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5';
  const radius = isKids ? (size === 'lg' ? 'rounded-[20px]' : 'rounded-xl') : 'rounded-md';

  return (
    <span
      className={`${dimensions} ${radius} border flex items-center justify-center font-semibold tracking-tight shrink-0 ${
        isKids
          ? 'bg-[#FFF1A8] text-[#4a2b4f] border-[#e6ca5a]'
          : 'bg-[var(--accent-soft)] text-[var(--accent-text)] border-[var(--line)]'
      }`}
      aria-hidden="true"
    >
      {avatarType === 'icon'
        ? renderAvatarIcon(avatarIcon, iconSize, isKids ? 2 : 1.5)
        : initials}
    </span>
  );
};
