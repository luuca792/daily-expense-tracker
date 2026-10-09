import { DayBox, IncomeRow, TransferRow } from 'so-chi-tieu-ui';

// card framing only: base.css paints the app backdrop (#e2e8f0) on <html>; white it out for the card
const Frame = ({ children, w = 380, bg = '#fff' }: { children: React.ReactNode; w?: number; bg?: string }) => (
  <div style={{ width: w, padding: 12, background: bg }}>
    <style>{'html{background:#fff}'}</style>
    {children}
  </div>
);
const noop = () => {};

export const IncomeDay = () => (
  <Frame bg="var(--bg)">
    <DayBox date="2026-10-05">
      <IncomeRow i={{ id: 'i1', amount: 18500, description: 'Lương tháng 10', date: '2026-10-05', createdAt: 0 }} fresh={false} onClick={noop} />
      <IncomeRow i={{ id: 'i2', amount: 1200, description: 'Dạy thêm cuối tuần', date: '2026-10-05', createdAt: 0 }} fresh={false} onClick={noop} />
      <TransferRow t={{ id: 't1', dir: 'in', amount: 3000, date: '2026-10-05', createdAt: 0 }} fresh={false} onClick={noop} />
    </DayBox>
  </Frame>
);
