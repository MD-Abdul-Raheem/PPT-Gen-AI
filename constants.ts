import { Theme, ThemeId, TransitionType } from './types';

export const THEMES: Theme[] = [
  { id: ThemeId.MODERN_BLUE, name: 'Blue', colors: { background: '#FFFFFF', text: '#1E293B', primary: '#0EA5E9', secondary: '#64748B', accent: '#F0F9FF' }, fonts: { heading: 'Inter', body: 'Inter' } },
  { id: ThemeId.MINIMAL_DARK, name: 'Dark', colors: { background: '#0F172A', text: '#F8FAFC', primary: '#38BDF8', secondary: '#94A3B8', accent: '#1E293B' }, fonts: { heading: 'Inter', body: 'Inter' } },
  { id: ThemeId.ELEGANT_PURPLE, name: 'Purple', colors: { background: '#FAFAFA', text: '#2D1B4E', primary: '#7C3AED', secondary: '#A78BFA', accent: '#F5F3FF' }, fonts: { heading: 'Inter', body: 'Inter' } },
  { id: ThemeId.CORPORATE_GRAY, name: 'Gray', colors: { background: '#F8FAFC', text: '#334155', primary: '#475569', secondary: '#94A3B8', accent: '#E2E8F0' }, fonts: { heading: 'Inter', body: 'Inter' } },
  { id: 'red' as ThemeId, name: 'Red', colors: { background: '#FFFFFF', text: '#1E293B', primary: '#EF4444', secondary: '#F87171', accent: '#FEE2E2' }, fonts: { heading: 'Inter', body: 'Inter' } },
  { id: 'green' as ThemeId, name: 'Green', colors: { background: '#FFFFFF', text: '#1E293B', primary: '#10B981', secondary: '#34D399', accent: '#D1FAE5' }, fonts: { heading: 'Inter', body: 'Inter' } },
  { id: 'orange' as ThemeId, name: 'Orange', colors: { background: '#FFFFFF', text: '#1E293B', primary: '#F97316', secondary: '#FB923C', accent: '#FFEDD5' }, fonts: { heading: 'Inter', body: 'Inter' } },
  { id: 'pink' as ThemeId, name: 'Pink', colors: { background: '#FFFFFF', text: '#1E293B', primary: '#EC4899', secondary: '#F472B6', accent: '#FCE7F3' }, fonts: { heading: 'Inter', body: 'Inter' } },
  { id: 'teal' as ThemeId, name: 'Teal', colors: { background: '#FFFFFF', text: '#1E293B', primary: '#14B8A6', secondary: '#2DD4BF', accent: '#CCFBF1' }, fonts: { heading: 'Inter', body: 'Inter' } },
  { id: 'indigo' as ThemeId, name: 'Indigo', colors: { background: '#FFFFFF', text: '#1E293B', primary: '#6366F1', secondary: '#818CF8', accent: '#E0E7FF' }, fonts: { heading: 'Inter', body: 'Inter' } },
  { id: 'yellow' as ThemeId, name: 'Yellow', colors: { background: '#FFFFFF', text: '#1E293B', primary: '#F59E0B', secondary: '#FBBF24', accent: '#FEF3C7' }, fonts: { heading: 'Inter', body: 'Inter' } },
  { id: 'cyan' as ThemeId, name: 'Cyan', colors: { background: '#FFFFFF', text: '#1E293B', primary: '#06B6D4', secondary: '#22D3EE', accent: '#CFFAFE' }, fonts: { heading: 'Inter', body: 'Inter' } },
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