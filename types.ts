export enum SlideLayout {
  TITLE = 'title',
  CONTENT = 'content',
  SECTION = 'section',
  CONCLUSION = 'conclusion'
}

export interface Slide {
  id: string;
  type: SlideLayout;
  title: string;
  content: string[];
  speakerNotes?: string;
  transition?: TransitionType;
  imagePrompt?: string;
  imageData?: string; // base64 string
}

export interface PresentationData {
  title: string;
  subtitle?: string;
  slides: Slide[];
}

export enum ThemeId {
  MODERN_BLUE = 'modern-blue',
  MINIMAL_DARK = 'minimal-dark',
  ELEGANT_PURPLE = 'elegant-purple',
  CORPORATE_GRAY = 'corporate-gray'
}

export interface Theme {
  id: ThemeId;
  name: string;
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

export type TransitionType = 'none' | 'fade' | 'push' | 'wipe' | 'cover' | 'uncover';

export interface GenerationSettings {
  slideCount: number;
  themeId: ThemeId;
  transition: TransitionType;
}