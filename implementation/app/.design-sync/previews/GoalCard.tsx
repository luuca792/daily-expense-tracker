import { GoalCard } from 'so-chi-tieu-ui';

// card framing only: base.css paints the app backdrop (#e2e8f0) on <html>; white it out for the card
const Frame = ({ children, w = 380, bg = '#fff' }: { children: React.ReactNode; w?: number; bg?: string }) => (
  <div style={{ width: w, padding: 12, background: bg }}>
    <style>{'html{background:#fff}'}</style>
    {children}
  </div>
);
const noop = () => {};
const goal = (name: string, icon: string, color: 'blue' | 'pink' | 'green' | 'violet', target: number, done = false) =>
  ({ id: name, name, icon, color, target, done });

export const List = () => (
  <Frame bg="var(--bg)">
    <GoalCard g={goal('Đi lại', '🛵', 'blue', 600)} spent={240} onClick={noop} />
    <GoalCard g={goal('Sức khỏe', '💊', 'green', 500)} spent={430} onClick={noop} />
    <GoalCard g={goal('Mua sắm', '🛍️', 'pink', 1500)} spent={1850} onClick={noop} />
  </Frame>
);

export const Done = () => (
  <Frame bg="var(--bg)"><GoalCard g={goal('Quà sinh nhật mẹ', '🎁', 'violet', 800, true)} spent={760} onClick={noop} /></Frame>
);
