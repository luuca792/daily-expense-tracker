import { Bars } from 'so-chi-tieu-ui';

// card framing only: base.css paints the app backdrop (#e2e8f0) on <html>; white it out for the card
const Frame = ({ children, w = 380, bg = '#fff' }: { children: React.ReactNode; w?: number; bg?: string }) => (
  <div style={{ width: w, padding: 12, background: bg }}>
    <style>{'html{background:#fff}'}</style>
    {children}
  </div>
);
const AMOUNTS = [120, 85, 340, 60, 0, 210, 95, 150, 480, 75, 130, 90, 260, 40, 110];
const days = AMOUNTS.map((amount, i) => ({ date: `2026-10-${String(i + 1).padStart(2, '0')}`, amount }));

export const HalfMonth = () => (
  <Frame><span className="s bars-title">Chi theo ngày</span><Bars days={days} /></Frame>
);

export const TwoDays = () => (
  <Frame><Bars days={days.slice(0, 2)} /></Frame>
);
