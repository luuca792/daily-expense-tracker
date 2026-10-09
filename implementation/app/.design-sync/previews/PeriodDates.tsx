import { PeriodDates } from 'so-chi-tieu-ui';

// card framing only: base.css paints the app backdrop (#e2e8f0) on <html>; white it out for the card
const Frame = ({ children, w = 380, bg = '#fff' }: { children: React.ReactNode; w?: number; bg?: string }) => (
  <div style={{ width: w, padding: 12, background: bg }}>
    <style>{'html{background:#fff}'}</style>
    {children}
  </div>
);

export const Active = () => (
  <Frame><PeriodDates p={{ start: '2026-10-01', end: null }} /></Frame>
);

export const Closed = () => (
  <Frame><PeriodDates p={{ start: '2026-09-01', end: '2026-09-30' }} /></Frame>
);
