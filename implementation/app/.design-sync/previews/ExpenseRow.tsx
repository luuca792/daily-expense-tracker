import { DayBox, ExpenseRow } from 'so-chi-tieu-ui';

// card framing only: base.css paints the app backdrop (#e2e8f0) on <html>; white it out for the card
const Frame = ({ children, w = 380, bg = '#fff' }: { children: React.ReactNode; w?: number; bg?: string }) => (
  <div style={{ width: w, padding: 12, background: bg }}>
    <style>{'html{background:#fff}'}</style>
    {children}
  </div>
);
const period = {
  id: 'p1', name: 'Tháng 10', start: '2026-10-01', end: null, createdAt: 0,
  living: { max: 4000, icon: '🍜', color: 'orange' as const },
  goals: [
    { id: 'g1', name: 'Đi lại', icon: '🛵', color: 'blue' as const, target: 600, done: false },
    { id: 'g2', name: 'Mua sắm', icon: '🛍️', color: 'pink' as const, target: 1500, done: false },
    { id: 'g3', name: 'Sức khỏe', icon: '💊', color: 'green' as const, target: 500, done: false },
  ],
  expenses: [], incomes: [], transfers: [],
};
const ex = (id: string, amount: number, category: string | null, description: string) =>
  ({ id, amount, category, description, date: '2026-10-07', createdAt: 0 });
const noop = () => {};

export const DayGroup = () => (
  <Frame bg="var(--bg)">
    <DayBox date="2026-10-07">
      <ExpenseRow p={period} e={ex('e1', 45, 'living', 'Phở bò sáng')} large={200} fresh={false} onClick={noop} />
      <ExpenseRow p={period} e={ex('e2', 30, 'g1', 'Đổ xăng')} large={200} fresh={false} onClick={noop} />
      <ExpenseRow p={period} e={ex('e3', 650, 'g2', 'Giày chạy bộ')} large={200} fresh={false} onClick={noop} />
      <ExpenseRow p={period} e={ex('e4', 120, 'g3', 'Thuốc cảm')} large={200} fresh={false} onClick={noop} />
    </DayBox>
  </Frame>
);

export const LargeAmount = () => (
  <Frame bg="var(--bg)">
    <ExpenseRow p={period} e={ex('e5', 1200, 'g2', 'Áo khoác mùa đông')} large={200} fresh={false} onClick={noop} />
  </Frame>
);

export const Untracked = () => (
  <Frame bg="var(--bg)">
    <ExpenseRow p={period} e={ex('e6', 60, null, 'Gửi xe')} large={200} fresh={false} onClick={noop} />
  </Frame>
);
