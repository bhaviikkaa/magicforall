export type DrawingStyle =
  | 'Soft crayon doodle'
  | 'Pencil sketch'
  | 'Ink & watercolor'
  | 'Comic doodle';

export const DRAWING_STYLES: DrawingStyle[] = [
  'Soft crayon doodle',
  'Pencil sketch',
  'Ink & watercolor',
  'Comic doodle',
];

export type ViewMode = 'vertical' | 'mindmap' | 'horizontal' | 'ppt-mindmap';

export type AppPage = 'home' | 'story-doodles' | 'mind-map' | 'ppt-notes';

export type ThemeMode = 'kids' | 'light' | 'dark';

export type FontSize = 'small' | 'medium' | 'large';

export type StudentLevel = 'kid' | 'school' | 'college';

export type AvatarType = 'icon' | 'initials';

export type AvatarIconKey =
  | 'book'
  | 'compass'
  | 'feather'
  | 'layers'
  | 'sparkles'
  | 'graduation'
  | 'pen'
  | 'atom'
  | 'globe'
  | 'code'
  | 'music'
  | 'sun';

export interface UserProfile {
  name: string;
  avatarType: AvatarType;
  avatarIcon: AvatarIconKey;
  level: StudentLevel;
}

export interface CharacterSheetItem {
  name: string;
  visual_description: string;
}

export interface AnalyzedScene {
  title: string;
  one_line_summary: string;
  setting: string;
  mood: string;
  characters: string[];
  action: string;
  image_prompt: string;
}

export interface StoryAnalysis {
  story_title: string;
  subtitle: string;
  character_sheet: CharacterSheetItem[];
  places: string[];
  key_moments: string[];
  mind_map_caption: string;
  scenes: AnalyzedScene[];
}

export type SceneImageStatus = 'idle' | 'loading' | 'ready' | 'error' | 'skipped';

export interface SceneState extends AnalyzedScene {
  id: string;
  index: number;
  svg: string | null;
  status: SceneImageStatus;
  errorMessage?: string;
}

export type DefinitionSource = 'slide' | 'contextual';

export interface PptMindMapNode {
  id: string;
  label: string;
  level: 0 | 1 | 2 | 3;
  branchIndex: number;
  terminology: string[];
  definition: string;
  definitionSource: DefinitionSource;
  keyPoints: string[];
  example: string;
  formula: string;
  slideNumbers: number[];
  children: PptMindMapNode[];
}

export interface PptMindMapData {
  fileName: string;
  presentationTitle: string;
  subjectArea: string;
  totalSlides: number;
  root: PptMindMapNode;
}

export interface PptNoteSection {
  title: string;
  slide_numbers: number[];
  summary: string;
  bullet_points: string[];
}

export interface PptNoteDefinition {
  term: string;
  definition: string;
  source: DefinitionSource;
  slide_numbers: number[];
}

export interface PptNoteFormula {
  name: string;
  expression: string;
  explanation: string;
  slide_numbers: number[];
}

export interface PptNotesData {
  fileName: string;
  totalSlides: number;
  presentation_title: string;
  subject_area: string;
  summary: string;
  sections: PptNoteSection[];
  definitions: PptNoteDefinition[];
  formulas: PptNoteFormula[];
  key_takeaways: string[];
}
