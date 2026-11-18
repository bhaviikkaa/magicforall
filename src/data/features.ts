import type { AppPage } from '../types';

export interface DashboardFeatureItem {
  id: string;
  targetPage?: AppPage;
  title: string;
  description: string;
  iconName: 'book-open' | 'network' | 'file-text' | 'plus';
  kidsCardStyle: string;
  kidsIconStyle: string;
  kidsActionStyle: string;
  isComingSoon?: boolean;
}

export const DASHBOARD_FEATURES: DashboardFeatureItem[] = [
  {
    id: 'story-doodles',
    targetPage: 'story-doodles',
    title: 'Story Doodles',
    description: 'Create and view illustrated stories.',
    iconName: 'book-open',
    kidsCardStyle: 'bg-[#FFD6E0] border-2 border-dashed border-[#EB9BB1] hover:bg-[#FFCBD8]',
    kidsIconStyle: 'bg-[#FFF7FA] border-2 border-[#EB9BB1] text-[#6B2D4B]',
    kidsActionStyle: 'text-[#6B2D4B] bg-[#FFF7FA] border border-[#EB9BB1]',
  },
  {
    id: 'mind-map',
    targetPage: 'mind-map',
    title: 'Mind Map',
    description: 'Build interactive concept maps from slides.',
    iconName: 'network',
    kidsCardStyle: 'bg-[#FFF1A8] border-2 border-dashed border-[#E6CA5A] hover:bg-[#FFEC8F]',
    kidsIconStyle: 'bg-[#FFFDF0] border-2 border-[#E6CA5A] text-[#695214]',
    kidsActionStyle: 'text-[#695214] bg-[#FFFDF0] border border-[#E6CA5A]',
  },
  {
    id: 'ppt-notes',
    targetPage: 'ppt-notes',
    title: 'Notes from PPT',
    description: 'Upload a .ppt/.pptx and extract organized notes, definitions, and formulas.',
    iconName: 'file-text',
    kidsCardStyle: 'bg-[#FFE0C2] border-2 border-dashed border-[#EAB27E] hover:bg-[#FFD6AF]',
    kidsIconStyle: 'bg-[#FFF9F3] border-2 border-[#EAB27E] text-[#78431B]',
    kidsActionStyle: 'text-[#78431B] bg-[#FFF9F3] border border-[#EAB27E]',
  },
  {
    id: 'coming-soon',
    title: 'Coming soon',
    description: 'Flashcards, practice quizzes, and additional study tools.',
    iconName: 'plus',
    kidsCardStyle: 'bg-[#EFE4FF] border-2 border-dashed border-[#C7B0F0] hover:bg-[#E7D8FF]',
    kidsIconStyle: 'bg-[#FBF8FF] border-2 border-[#C7B0F0] text-[#553A82]',
    kidsActionStyle: 'text-[#553A82] bg-[#FBF8FF] border border-[#C7B0F0]',
    isComingSoon: true,
  },
];
