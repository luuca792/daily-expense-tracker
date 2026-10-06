import { ColorKey } from './types';

/** visual-style.md "Category colors", extended to a palette of 12 */
export const PALETTE: Record<ColorKey, { bg: string; text: string; solid: string }> = {
  orange: { bg: '#FFEDD5', text: '#C2410C', solid: '#F97316' },
  blue: { bg: '#DBEAFE', text: '#1D4ED8', solid: '#3B82F6' },
  pink: { bg: '#FCE7F3', text: '#BE185D', solid: '#EC4899' },
  violet: { bg: '#EDE9FE', text: '#6D28D9', solid: '#8B5CF6' },
  green: { bg: '#DCFCE7', text: '#15803D', solid: '#22C55E' },
  amber: { bg: '#FEF3C7', text: '#B45309', solid: '#F59E0B' },
  indigo: { bg: '#E0E7FF', text: '#4338CA', solid: '#6366F1' },
  slate: { bg: '#F1F5F9', text: '#475569', solid: '#64748B' },
  red: { bg: '#FFE4E6', text: '#BE123C', solid: '#F43F5E' },
  teal: { bg: '#CCFBF1', text: '#0F766E', solid: '#14B8A6' },
  cyan: { bg: '#CFFAFE', text: '#0E7490', solid: '#06B6D4' },
  lime: { bg: '#ECFCCB', text: '#4D7C0F', solid: '#84CC16' },
};

export const COLOR_KEYS = Object.keys(PALETTE) as ColorKey[];

export const ICONS = ['🍜', '🏠', '👨‍👩‍👧', '🛍️', '🛵', '💊', '🎬', '✨', '📚', '🎁', '✈️', '🐶', '💡', '👶', '🏋️', '☕'];
