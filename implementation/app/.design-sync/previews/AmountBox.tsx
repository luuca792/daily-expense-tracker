import { useState } from 'react';
import { AmountBox } from 'so-chi-tieu-ui';

// card framing only: base.css paints the app backdrop (#e2e8f0) on <html>; white it out for the card
const Frame = ({ children, w = 380, bg = '#fff' }: { children: React.ReactNode; w?: number; bg?: string }) => (
  <div style={{ width: w, padding: 12, background: bg }}>
    <style>{'html{background:#fff}'}</style>
    {children}
  </div>
);

export const Expense = () => {
  const [v, setV] = useState<number | null>(85);
  return <Frame><AmountBox label="Số tiền" value={v} onChange={setV} /></Frame>;
};

export const Income = () => {
  const [v, setV] = useState<number | null>(18500);
  return <Frame><AmountBox label="Số tiền" value={v} onChange={setV} accent="green" allowNegative /></Frame>;
};

export const NegativeCarryOver = () => {
  const [v, setV] = useState<number | null>(-1250);
  return <Frame><AmountBox label="Chuyển từ kỳ trước" value={v} onChange={setV} accent="green" allowNegative /></Frame>;
};

export const Savings = () => {
  const [v, setV] = useState<number | null>(2000);
  return <Frame><AmountBox label="Số tiền" value={v} onChange={setV} accent="amber" /></Frame>;
};

export const Empty = () => {
  const [v, setV] = useState<number | null>(null);
  return <Frame><AmountBox label="Số tiền" value={v} onChange={setV} /></Frame>;
};
