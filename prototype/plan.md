# Prototype plan

## Goal
Let the user **use** the designed app on a live, clickable draft, mainly on a phone, and judge the experience before the real implementation. Feedback comes back as design decisions in `wireframes/decisions.md`.

The prototype is throwaway (see `README.md`): iteration speed beats code quality. What carries over is the decisions, plus the domain logic module if it turns out clean.

## Gate
Passed: section A of `wireframes/open-questions.md` is answered (D57–D62).

## Scope
Every screen that is drawn, so the whole design gets reviewed by use, not by looking at pictures. The savings screens and 3.0 are included because they are drawn and the sample data's Thu already contains savings transfers (R6.3).

| In | Out |
|---|---|
| 1.0 Welcome · 2.0 Home · 6.0 Settings | PWA, install, offline, IndexedDB (implementation, D55) |
| 4.0 Periods · 4.1 Create / Edit Period (copy + carry-over, delete) | Export / import, backup (later feature, D56) |
| 5.0 Period Detail: 5.1 Logging · 5.2 Goals · 5.3 Statistics | Math in the amount field (later, D61) |
| 5.4 / 5.5 Add Expense · 5.9 Add Income (built from its proposed spec) | Drag to reorder goals (R2.4 "later"); the "›" filter link on 5.6 |
| 5.6 Edit Goal (edit, create, Sinh hoạt mode, done) · 5.7 Delete Goal | Desktop two-column layout, dark mode |
| 3.0 Overview · 7.0 Savings · 7.1 Base Savings · 5.10 Savings Transfer | Round-1 parking lot (debts, recurring, pay-later…), deployment |

**5.9 Add Income** is not drawn. It is built from the layout proposed in its spec, and the prototype serves as its review.

## Source of truth
- **Screens:** `wireframes/screens/specs/<n>-<name>.md` (layout, exact Vietnamese UI text, interactions, states). The pictures are in `wireframes/screens/wireframes.html` section 0.
- **Behavior:** `wireframes/logic/logic-rules.md` R1–R7. Code comments cite rule IDs (`// R4 Dự trữ`).
- **Look:** `wireframes/ux/visual-style.md` (tokens, category colors, components).
- **Seed:** `wireframes/screens/sample-data.md`.
- If a spec is unclear, follow the wireframe; if both are silent, choose the simplest option and log it in `wireframes/open-questions.md` with that default.

## Stack
| Part | Choice |
|---|---|
| Build | Vite + React + TypeScript (D1), Node 20 |
| Routing | React Router with **hash URLs** (`#/periods/:id/goals`), so it works from any static server or a phone on the LAN |
| State | One **Zustand** store, persisted to `localStorage` (`persist` middleware) |
| Styling | Plain CSS with the tokens from `visual-style.md`, font Be Vietnam Pro, emoji icons as in the wireframes |
| Dates / money | `date-fns` (vi locale); amounts as integers in thousands, formatted `vi-VN` (`1.700`) |
| Charts (5.3, 3.0) | Hand-drawn SVG rings and bars; no chart library |
| Inputs | Native `<input type="date">` with `min`/`max` from the period (R3.5); numeric keyboard (`inputmode="numeric"`) for amounts |
| Tests | Vitest for the domain module only (R1.6, R1.8, R4, R6, R7) |

## Code layout (`prototype/app/`)
```
src/
  domain/      types.ts · calc.ts (R4, R6, R7) · periods.ts (R1) · entries.ts (R3) · *.test.ts
  store/       store.ts (Zustand + persist) · seed.ts (sample-data.md)
  screens/     S1_0_Welcome.tsx · S2_0_Home.tsx · S5_0_PeriodDetail.tsx · S5_4_AddExpense.tsx …
  components/  SummaryCard · DayBox · EntryRow · GoalCard · Sheet · Toast · AmountBox …
  styles/      tokens.css · components.css
```
Screen numbers become component names (`S5_4_AddExpense`), sheets and dialogs are overlays inside their parent route, and the ＋ button follows R5.

**Data shape:** `{ schemaVersion, settings, periods[], baseSavings? }`. A period holds its goals (with `done`), `livingMax`, expenses, incomes and savings transfers. All totals are computed by `domain/`, never stored.

## Demo data
- `?seed=demo` loads the fictional sample (4 periods, Tháng 9/2026 in detail, the savings history) and replaces whatever is stored.
- `?seed=empty` clears the data, so 1.0 Welcome appears.
- These are URL switches only, with nothing on screen (D25). The Tháng 9 seed adds filler Sinh hoạt entries so the totals match `sample-data.md`.

## Milestones
Each ends with something the user can tap through. A quick look after **M1** is worth it, since logging is the flow used daily.

| # | Build | User can try |
|---|---|---|
| **M0** | Project setup, tokens, store, seed, domain module with tests | — |
| **M1** | 5.0 shell (header, summary card, bottom bar) · 5.1 both toggles · 5.4 / 5.5 · 5.9 · edit and delete entries with undo | Log expenses and incomes in Tháng 9; watch Thu, Chi, Số dư and Còn lại update; red large amounts |
| **M2** | 4.0 · 4.1 create and edit · copy goals and Sinh hoạt maximum · carry-over (negative too) · delete period with confirmation + undo · date rules | Start a new period from Tháng 10; block date edits that exclude entries |
| **M3** | 5.2 · 5.6 (all modes, done) · 5.7 with the Sinh hoạt move (R2.3) · 5.3 both charts | Create, edit, finish and delete goals; see the reserve change Còn lại |
| **M4** | 1.0 · 2.0 · 6.0 · 3.0 · 7.0 · 7.1 · 5.10 with the fund rules | The whole app from first launch, including savings and Tổng tài sản |

Each milestone ends with a check against the specs at a 375 px phone width.

## Run
```bash
cd prototype/app
npm install
npm run dev -- --host
```
- On the PC: open the printed `http://localhost:5173/?seed=demo`.
- On a phone on the same Wi-Fi: open `http://<PC LAN IP>:5173/?seed=demo`. Windows may ask to allow Node through the firewall once.
- On desktop the app is shown at phone width, centered.

## Feedback loop
1. The user tests and writes notes in `prototype/feedback/round-N.md`, referring to screens by number (e.g. "5.4: …").
2. Changes are applied to the prototype. Design changes also update the specs, `logic-rules.md` and `decisions.md` in the same step, as during the wireframe phase.
3. Repeat until the experience is approved, then hand off to `implementation/`.
