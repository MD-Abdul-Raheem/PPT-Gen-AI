import { Theme, ThemeId, TransitionType } from './types';

export const THEMES: Theme[] = [
  {
    id: ThemeId.MODERN_BLUE,
    name: 'Modern Blue',
    colors: {
      background: '#FFFFFF',
      text: '#1E293B',
      primary: '#0EA5E9',
      secondary: '#64748B',
      accent: '#F0F9FF',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
  },
  {
    id: ThemeId.MINIMAL_DARK,
    name: 'Minimal Dark',
    colors: {
      background: '#0F172A',
      text: '#F8FAFC',
      primary: '#38BDF8',
      secondary: '#94A3B8',
      accent: '#1E293B',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
  },
  {
    id: ThemeId.ELEGANT_PURPLE,
    name: 'Elegant Purple',
    colors: {
      background: '#FAFAFA',
      text: '#2D1B4E',
      primary: '#7C3AED',
      secondary: '#A78BFA',
      accent: '#F5F3FF',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
  },
  {
    id: ThemeId.CORPORATE_GRAY,
    name: 'Corporate Gray',
    colors: {
      background: '#F8FAFC',
      text: '#334155',
      primary: '#475569',
      secondary: '#94A3B8',
      accent: '#E2E8F0',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
  },
];

export const TRANSITION_OPTIONS: { label: string; value: TransitionType }[] = [
  { label: 'None', value: 'none' },
  { label: 'Fade', value: 'fade' },
  { label: 'Push', value: 'push' },
  { label: 'Wipe', value: 'wipe' },
  { label: 'Cover', value: 'cover' },
  { label: 'Uncover', value: 'uncover' },
];

export const MAX_CHAR_COUNT = 5000;
export const DEFAULT_SLIDE_COUNT = 8;