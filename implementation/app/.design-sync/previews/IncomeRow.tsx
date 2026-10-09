import { IncomeRow } from 'so-chi-tieu-ui';

// card framing only: base.css paints the app backdrop (#e2e8f0) on <html>; white it out for the card
const Frame = ({ children, w = 380, bg = '#fff' }: { children: React.ReactNode; w?: number; bg?: string }) => (
  <div style={{ width: w, padding: 12, background: bg }}>
    <style>{'html{background:#fff}'}</style>
    {children}
  </div>
);
const noop = () => {};
const inc = (amount: number, description: string) => ({ id: description, amount, description, date: '2026-10-05', createdAt: 0 });

export const Salary = () => (
  <Frame bg="var(--bg)"><IncomeRow i={inc(18500, 'Lương tháng 10')} fresh={false} onClick={noop} /></Frame>
);

export const NegativeCarryOver = () => (
  <Frame bg="var(--bg)"><IncomeRow i={inc(-1250, 'Chuyển từ kỳ trước')} fresh={false} onClick={noop} /></Frame>
);
