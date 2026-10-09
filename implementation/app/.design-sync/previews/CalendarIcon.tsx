import { CalendarIcon } from 'so-chi-tieu-ui';

// card framing only: base.css paints the app backdrop (#e2e8f0) on <html>; white it out for the card
const Frame = ({ children, w = 380, bg = '#fff' }: { children: React.ReactNode; w?: number; bg?: string }) => (
  <div style={{ width: w, padding: 12, background: bg }}>
    <style>{'html{background:#fff}'}</style>
    {children}
  </div>
);

export const OnPeriodTile = () => (
  <Frame bg="var(--bg)">
    <div className="mcard period now">
      <div className="mnum"><CalendarIcon /></div>
      <div className="body"><div className="name">Tháng 10</div><div className="dates">01/10/2026 → <i>chưa kết thúc</i></div></div>
      <span className="arr">›</span>
    </div>
    <div className="mcard period">
      <div className="mnum"><CalendarIcon /></div>
      <div className="body"><div className="name">Tháng 9</div><div className="dates">01/09/2026 → 30/09/2026</div></div>
      <span className="arr">›</span>
    </div>
  </Frame>
);
