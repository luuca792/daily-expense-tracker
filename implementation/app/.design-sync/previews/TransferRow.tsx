import { TransferRow } from 'so-chi-tieu-ui';

// card framing only: base.css paints the app backdrop (#e2e8f0) on <html>; white it out for the card
const Frame = ({ children, w = 380, bg = '#fff' }: { children: React.ReactNode; w?: number; bg?: string }) => (
  <div style={{ width: w, padding: 12, background: bg }}>
    <style>{'html{background:#fff}'}</style>
    {children}
  </div>
);
const noop = () => {};

export const Deposit = () => (
  <Frame bg="var(--bg)"><TransferRow t={{ id: 't1', dir: 'in', amount: 3000, date: '2026-10-05', createdAt: 0 }} fresh={false} onClick={noop} /></Frame>
);

export const Withdrawal = () => (
  <Frame bg="var(--bg)"><TransferRow t={{ id: 't2', dir: 'out', amount: 500, date: '2026-10-12', createdAt: 0 }} fresh={false} onClick={noop} /></Frame>
);
