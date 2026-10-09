import { Ico } from 'so-chi-tieu-ui';

// card framing only: base.css paints the app backdrop (#e2e8f0) on <html>; white it out for the card
const Frame = ({ children, w = 380, bg = '#fff' }: { children: React.ReactNode; w?: number; bg?: string }) => (
  <div style={{ width: w, padding: 12, background: bg }}>
    <style>{'html{background:#fff}'}</style>
    {children}
  </div>
);
const row = { display: 'flex', gap: 10, alignItems: 'center' } as const;
const COLORS = ['orange', 'blue', 'pink', 'violet', 'green', 'amber', 'indigo', 'slate', 'red', 'teal', 'cyan', 'lime'] as const;
const ICONS = ['🍜', '🛵', '🛍️', '🎬', '💊', '✨', '📚', '🏠', '🎁', '☕', '✈️', '🐶'];

export const Sizes = () => (
  <Frame><div style={row}><Ico icon="🍜" color="orange" /><Ico icon="🍜" color="orange" size="md" /><Ico icon="🍜" color="orange" size="lg" /></div></Frame>
);

export const Palette = () => (
  <Frame>
    <div style={{ ...row, flexWrap: 'wrap' }}>
      {COLORS.map((c, i) => <Ico key={c} icon={ICONS[i]} color={c} size="md" />)}
    </div>
  </Frame>
);

export const StrongAndUntracked = () => (
  <Frame>
    <div style={row}><Ico icon="🛵" color="blue" size="md" strong /><Ico icon="🎁" color="violet" size="md" strong /><Ico icon="?" color={null} size="md" /></div>
  </Frame>
);
