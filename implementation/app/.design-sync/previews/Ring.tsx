import { Ring } from 'so-chi-tieu-ui';

// card framing only: base.css paints the app backdrop (#e2e8f0) on <html>; white it out for the card
const Frame = ({ children, w = 380, bg = '#fff' }: { children: React.ReactNode; w?: number; bg?: string }) => (
  <div style={{ width: w, padding: 12, background: bg }}>
    <style>{'html{background:#fff}'}</style>
    {children}
  </div>
);

export const SpendingSplit = () => (
  <Frame>
    <Ring segments={[{ value: 0.42, color: '#F97316' }, { value: 0.18, color: '#3B82F6' }, { value: 0.22, color: '#EC4899' }, { value: 0.08, color: '#22C55E' }]}>
      <span className="s">Đã chi</span>
      <span className="v">6.240</span>
    </Ring>
    <div className="chart-name">Tháng 10</div>
  </Frame>
);

export const Single = () => (
  <Frame>
    <Ring segments={[{ value: 0.64, color: '#14B8A6' }]}>
      <span className="v">64%</span>
      <span className="s">ngân sách</span>
    </Ring>
  </Frame>
);
