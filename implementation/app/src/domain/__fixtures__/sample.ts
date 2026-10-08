// Sample data for tests (fictional, from wireframes/screens/sample-data.md; ported from the prototype's store/seed.ts).
// Filler Sinh hoạt entries make the totals match. Never put real data from references/ here.
import { addDays, format, parseISO } from 'date-fns';
import { Data, DEFAULT_SETTINGS, Expense, Goal, ISODate, LIVING, Period } from '../types';

let clock = Date.UTC(2026, 6, 1);
const tick = () => (clock += 60_000);
let n = 0;
const id = (p: string) => `${p}-${++n}`;

const exp = (date: ISODate, amount: number, category: string | null, description = ''): Expense => ({
  id: id('e'), amount, category, description: category === null ? '' : description, date, createdAt: tick(),
});

/** n amounts near total/n that add up to total exactly */
function spread(count: number, total: number) {
  const avg = Math.round(total / count);
  const out = Array.from({ length: count - 1 }, (_, i) => avg + (((i * 29) % 41) - 20));
  out.push(total - out.reduce((a, b) => a + b, 0));
  return out;
}

const LIVING_DESCS = ['Ăn sáng', 'Đi chợ', 'Cà phê', 'Ăn trưa', 'Siêu thị', 'Ăn tối', 'Trà sữa', 'Bánh mì'];

/** Sinh hoạt fillers spread over [start, start+days) */
function fillers(count: number, total: number, start: ISODate, days: number): Expense[] {
  return spread(count, total).map((amt, i) =>
    exp(format(addDays(parseISO(start), Math.floor((i * days) / count)), 'yyyy-MM-dd'), amt, LIVING, LIVING_DESCS[i % LIVING_DESCS.length]),
  );
}

const goal = (name: string, icon: string, color: Goal['color'], target: number, done = false): Goal => ({
  id: id('g'), name, icon, color, target, done,
});

const living = { max: 4000, icon: '🍜', color: 'orange' as const };

function july(): Period {
  const createdAt = tick();
  const [home, fam, shop, move] = [
    goal('Nhà ở', '🏠', 'green', 2500), goal('Gia đình', '👨‍👩‍👧', 'violet', 2000),
    goal('Mua sắm', '🛍️', 'amber', 1000), goal('Đi lại', '🛵', 'blue', 700),
  ];
  const incomes = [{ id: id('i'), amount: 23000, description: 'Lương tháng 6', date: '2026-07-05', createdAt: tick() }];
  const transfers = [{ id: id('t'), dir: 'in' as const, amount: 4000, date: '2026-07-05', createdAt: tick() }];
  const expenses = [
    exp('2026-07-06', 1900, home.id, 'Tiền nhà'), exp('2026-07-06', 2000, fam.id, 'Biếu ba mẹ'),
    exp('2026-07-10', 600, home.id, 'Tiền điện'), exp('2026-07-12', 60, move.id, 'Đổ xăng'),
    exp('2026-07-20', 450, shop.id, 'Áo sơ mi'), exp('2026-07-22', 55, move.id, 'Đổ xăng'),
    exp('2026-08-01', 65, move.id, 'Đổ xăng'), exp('2026-07-15', 40, null), exp('2026-07-25', 30, null),
    exp('2026-08-02', 50, null),
    ...fillers(26, 3650, '2026-07-05', 31),
  ];
  return { id: 'p-jul', name: 'Kỳ lương 5/7 – 4/8', start: '2026-07-05', end: '2026-08-04', createdAt, living, goals: [home, fam, shop, move], expenses, incomes, transfers };
}

function dalat(): Period {
  const createdAt = tick();
  const hotel = goal('Khách sạn', '🏨', 'indigo', 1200);
  const transfers = [{ id: id('t'), dir: 'out' as const, amount: 2000, date: '2026-08-14', createdAt: tick() }];
  const expenses = [
    exp('2026-08-14', 1200, hotel.id, 'Khách sạn'), exp('2026-08-15', 100, null), exp('2026-08-17', 80, null),
    ...fillers(14, 1820, '2026-08-14', 5),
  ];
  return { id: 'p-dalat', name: 'Du lịch Đà Lạt', start: '2026-08-14', end: '2026-08-18', createdAt, living: { ...living, max: 2000 }, goals: [hotel], expenses, incomes: [], transfers };
}

function september(): Period {
  const createdAt = tick();
  const home = goal('Nhà ở', '🏠', 'green', 2500);
  const fam = goal('Gia đình', '👨‍👩‍👧', 'violet', 2000, true); // done (D59)
  const shop = goal('Mua sắm', '🛍️', 'amber', 1000);
  const move = goal('Đi lại', '🛵', 'blue', 700);
  const health = goal('Sức khỏe', '💊', 'pink', 600);
  const incomes = [
    { id: id('i'), amount: 1250, description: 'Còn lại từ tháng trước', date: '2026-09-01', createdAt: tick() },
    { id: id('i'), amount: 21750, description: 'Lương tháng 8', date: '2026-09-05', createdAt: tick() },
  ];
  const transfers = [{ id: id('t'), dir: 'in' as const, amount: 3000, date: '2026-09-05', createdAt: tick() }];
  const expenses = [
    // days 1–27: the entries not shown on the sample screens
    exp('2026-09-02', 1954, home.id, 'Tiền nhà'), exp('2026-09-05', 1500, fam.id, 'Biếu ba mẹ'),
    exp('2026-09-15', 650, shop.id, 'Giày'), exp('2026-09-04', 180, move.id, 'Đổ xăng'),
    exp('2026-09-12', 175, move.id, 'Sửa xe'), exp('2026-09-21', 176, move.id, 'Đổ xăng'),
    exp('2026-09-08', 80, null), exp('2026-09-16', 74, null), exp('2026-09-24', 80, null),
    ...fillers(22, 2663, '2026-09-01', 27),
    // 28/09 → 30/09 as on 5.1 (created oldest first)
    exp('2026-09-28', 500, fam.id, 'Biếu ba mẹ'), exp('2026-09-28', 646, home.id, 'Tiền điện'),
    exp('2026-09-28', 92, LIVING, 'Đi chợ'),
    exp('2026-09-29', 250, shop.id, 'Áo khoác'), exp('2026-09-29', 318, health.id, 'Khám bệnh'),
    exp('2026-09-30', 35, LIVING, 'Cà phê'), exp('2026-09-30', 51, move.id, 'Đổ xăng'),
    exp('2026-09-30', 16, null), exp('2026-09-30', 60, LIVING, 'Ăn trưa'),
  ];
  return { id: 'p-sep', name: 'Tháng 9/2026', start: '2026-09-01', end: '2026-09-30', createdAt, living, goals: [home, fam, shop, move, health], expenses, incomes, transfers };
}

function october(sep: Period): Period {
  const createdAt = tick();
  const goals = sep.goals.map((g) => ({ ...g, id: id('g'), done: false }));
  const move = goals.find((g) => g.name === 'Đi lại')!;
  const incomes = [{ id: id('i'), amount: 10500, description: 'Còn lại từ tháng trước', date: '2026-10-01', createdAt: tick() }];
  const expenses = [
    exp('2026-10-02', 45, LIVING, 'Ăn sáng'), exp('2026-10-03', 50, move.id, 'Đổ xăng'),
    exp('2026-10-04', 150, LIVING, 'Đi chợ'),
  ];
  return { id: 'p-oct', name: 'Tháng 10/2026', start: '2026-10-01', end: null, createdAt, living, goals, expenses, incomes, transfers: [] };
}

export function demoData(): Data {
  clock = Date.UTC(2026, 6, 1);
  n = 0;
  const jul = july();
  const dl = dalat();
  const sep = september();
  const oct = october(sep);
  return { schemaVersion: 1, settings: { ...DEFAULT_SETTINGS }, periods: [jul, dl, sep, oct], baseSavings: 1000, userName: 'Lan' };
}
