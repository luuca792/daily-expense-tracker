import { AnimMoney } from 'so-chi-tieu-ui';

// card framing only: base.css paints the app backdrop (#e2e8f0) on <html>; white it out for the card
const Frame = ({ children, w = 380, bg = '#fff' }: { children: React.ReactNode; w?: number; bg?: string }) => (
  <div style={{ width: w, padding: 12, background: bg }}>
    <style>{'html{background:#fff}'}</style>
    {children}
  </div>
);

export const SummaryCard = () => (
  <Frame>
    <div className="sumc grad-teal">
      <div>
        <div className="lbl on-grad">Còn lại</div>
        <div className="big"><AnimMoney value={12260} /></div>
        <div className="bal">Thu 19.700 · Chi 7.440</div>
      </div>
    </div>
  </Frame>
);

export const Inline = () => (
  <Frame><span className="exp"><AnimMoney value={7440} /></span></Frame>
);
