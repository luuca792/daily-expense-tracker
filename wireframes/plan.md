# Plan: Personal Finance App (Vietnamese UI, client-side data)

## Context
The user has tracked spending in an Excel workbook (`references/personal-fund.xlsx`) for years. They want a web app that covers the same **needs** with a much better experience. It will be deployed on their server for friends too. Money data is sensitive, so **nothing is stored on the server**: data stays on the device only (D56; no backup file for now). The UI is in Vietnamese.

Decisions confirmed with the user:
- **Stack:** React + Vite + TypeScript.
- **Delivery (D55):** an installable web app (PWA): same static site, no backend, installable from the browser, works offline, updates itself. Hosted on the user's own nginx server over HTTPS.
- **Data:** local to the device only, no backup/export for now (D56; supersedes the JSON data file of D2).
- **History:** start fresh, no Excel import.
- **Devices:** mobile-first, works on desktop too.

**Guiding rules**
1. **This is not "Excel on the web".** The workbook only tells us *what the user needs to do and know*. The UI is designed from scratch around tasks. There are no grids, no "add a row" and no formulas visible to the user. The app does the bookkeeping and shows answers.
2. **Generalize, don't copy.** People, banks, services and category names in the workbook are examples of a general need. They are never built into the app.
3. **Design before building.** There is an explicit design phase with review rounds before the real implementation.
4. **Incremental, simple first** (D7). Start from a small core flow and grow it toward the ideal version one step at a time. The round-1 detailed design is a parking lot of later ideas, not a spec.
5. **No explanatory text on screen** (D25). The UI shows only labels, values, data and actions: no info boxes, hints, taglines or "(optional)" markers. Optional fields are just not required. Explanations belong in the docs.

## Current direction: core flow (D8, D9, D22)
1.0. Welcome → 2.0. Home → 4.0. Periods (4.1. Create / Edit Period) → 5.0. Period Detail with a **bottom bar** (5.1. Logging [Chi tiêu / Thu nhập toggle] · 5.2. Goals · 5.3. Statistics; sub-pages 5.4. Add Expense, 5.5. Add Untracked Expense, 5.6. Edit Goal, 5.7. Delete Goal, 5.9. Add Income [not drawn]) · 6.0. Settings via ⚙ · 7.0. Savings from 2.0 (D50; transfers via 5.10 inside a period). 3.0. Overview (D54) shows total wealth = savings + the active period's Số dư. 5.8 is retired (D43).
- **Screen names** (D28): `<number>.<sub_number>. <Name>`. Index: `wireframes/screens/screen-registry.md`.
- **Per-screen specs** (D44): `wireframes/screens/specs/<n>-<name>.md` is the source of truth for how each screen is prototyped and built. Hidden rules: `wireframes/logic/logic-rules.md` (R1–R5). Sample data: `wireframes/screens/sample-data.md`. Every wireframe change updates the affected spec(s), the rules and `decisions.md` in the same step.
- Wireframes: section 0 of `wireframes/screens/wireframes.html` (anchors `#s5-1`…); captions are one line + a spec link.
- Tổng quan (3.0) is drawn for review (D54). Add Income (5.9) is still to design. The clickable prototype covers every drawn screen, built in milestones M0–M4 (`prototype/plan.md`).

## Phases at a glance
| Phase | Output | User review |
|---|---|---|
| 0. Use cases | `wireframes/requirements/use-cases.md` | Confirm the needs list |
| 1. Design | UX principles, navigation, user flows, wireframes, visual style, then a clickable prototype | Two rounds: wireframes, then prototype |
| 2. Implementation | Production app, tests, deployment | Final acceptance |

Each review round has a markdown feedback file that the user fills in, and the decisions are recorded in `wireframes/decisions.md`.

## Status (updated 2026-10-05)
- [x] **D56 Local-only data:** backup/restore removed from 1.0, 2.0 and 6.0; export/import is a later feature; Q-05 resolved, Q-35 added
- [x] **D55 Delivery form decided:** installable web app (PWA, option B), data in IndexedDB on the device, no backend; APK and client/server rejected for now, encrypted sync parked. `implementation/plan.md` updated
- [ ] **D54 3.0. Overview, for review:** "Tổng tài sản" = savings + active period's Số dư (no reserve); active period = most recent for now (R7); questions Q-33, Q-34
- [ ] **D50 Savings fund, for review:** 2.0 hub card "Tiết kiệm" → 7.0. Savings (fund + transfer history by period); yellow "Gửi tiết kiệm" button under the 5.1 Thu nhập toggle (D51) → 5.10. Savings Transfer (Gửi vào / Rút ra); rules R6; questions Q-27, Q-29–Q-32; D52 base savings "Số dư ban đầu" on 7.0 → 7.1. Base Savings (no period, deletable any time)
- [x] D45–D48: red large-expense amounts on 5.1 (one threshold); 5.3 chart carousel ("Danh mục & không danh mục" · "Mục tiêu"); Sinh hoạt is the non-deletable default goal, edited via 5.6 Sinh hoạt mode; 6.0 trimmed to the Sinh hoạt maximum, one warning threshold and Sao lưu
- [x] Per-screen specs written (D44): `wireframes/screens/specs/` (15 files) + `sample-data.md`. The registry became an index; captions, the IA doc and CLAUDE.md now point to the specs instead of repeating them
- [x] Bottom tab bar adopted on 5.0 (D43): 5.1 Logging · 5.2 Goals · 5.3 Statistics; 5.8 retired
- [x] Repo restructured (2026-10-03): `wireframes/` (design: requirements/, ux/, screens/, logic/, feedback/, plan, decisions, open questions), `prototype/` (README + plan.md for the local clickable draft) and `implementation/` (README + plan.md outline). Root holds README.md, CLAUDE.md, the user's plan.md and references/
- [x] `CLAUDE.md` added at the repo root: session hand-off (doc map, core model, conventions, wireframe editing notes)
- [x] Phase 0: `wireframes/requirements/use-cases.md`
- [x] 1a UX principles: `wireframes/ux/ux-principles.md`
- [x] 1b Information architecture: `wireframes/ux/information-architecture.md`
- [x] 1c User flows + traceability table: `wireframes/ux/user-flows-round1.md`
- [x] 1d Wireframes: `wireframes/screens/wireframes.html` (open in a browser) + index `wireframes/screens/screen-registry.md`
- [x] 1e Visual style draft: `wireframes/ux/visual-style.md`
- [x] Decisions log started: `wireframes/decisions.md` (D1–D6)
- [x] Round-1 feedback: UI too complex → simple core flow (D7–D9); wireframes section 0 added; IA updated
- [x] Month detail + settings designed (D11–D15): wireframes 0.4–0.11 (tabs Chi tiêu · Mục tiêu · Không danh mục · Thu nhập, Sinh hoạt tracker + detail, edit/delete goal, add form with optional category, Cài đặt). C1–C6 answered (D16–D19: tabs, month-scoped data, Sinh hoạt default, untracked counts as living, copy previous month)
- [x] Untracked spending simplified (D20–D21): no description, no tab, total on the Sinh hoạt card and chart; frame 0.8 = quick "Không DM" add
- [x] More colorful UI (D10): section 0 redrawn in color; `visual-style.md` v2 (teal = logging, violet = overview, green/rose = income/spending, pastel category tiles)
- [x] Spending periods replace calendar months (D22–D23): frames 0.3 (period list with start → end) and 0.3b (create period); detail screens use period wording
- [x] Carry-over (D39): "Chọn kỳ trước đó" on 4.1, the "Còn lại từ tháng trước" income entry (R1.8), and 5.3. Income drawn
- [x] Screen naming `N.M. Name` (D28, replaces D27): registry in `screen-registry.md`; wireframes, IA tree and open questions use it
- [x] Info/remark text removed from all current screens; UX principle 10 added (D25)
- [x] Logic-rules spec started: `wireframes/logic/logic-rules.md` (R1 periods, R2 goals, R3 entries, R4 calculations) (D24)
- [x] Small unanswered questions collected in `wireframes/open-questions.md`, each with a proposed default. Design continues on the defaults.
- [x] **Gate before the prototype:** section A answered (D57–D62): Sinh hoạt maximum copied from the previous period (Settings only when there is none), entry dates inside the period (period date edits that exclude entries are blocked), goals can be marked done, negative carry-over, deleting a period undoes its savings transfers, no pace hint, defaults accepted for the rest
- [x] Prototype plan written (`prototype/plan.md`): all drawn screens incl. 3.0 and savings, milestones M0–M4, Vite + React + TS + Zustand/localStorage, `?seed=demo`
- [x] 1f Clickable prototype built (M0–M4, 2026-10-05) in `prototype/app/`: every drawn screen plus 5.9 from its proposed spec; domain tests for R1, R3, R4, R6, R7
- [x] Prototype motion added (D63, 2026-10-06): screen, tab, sheet and list animations, counting amounts, growing charts
- [ ] Feedback round 2: the user tests the prototype and writes `prototype/feedback/round-1.md`
- [ ] Next increments: Tổng quan → then parking-lot features, one at a time
- [ ] Phase 2 Implementation (see `implementation/plan.md`)

---

> ⚠️ **Everything from here down is round-1 background.** Where it conflicts with "Current direction" above, `wireframes/decisions.md` or `wireframes/logic/logic-rules.md`, those win. In particular, the bottom nav, plan wizard, months, folder names and the data-model draft in "Technical foundation" are outdated.

## Phase 0: Use cases (needs, not UI)
Each entry has two parts. **Seen** is the behavior observed in the workbook, described generically. **Need** is what the user must be able to do or know. Solutions belong to Phase 1.

### A. Day-to-day recording
- **UC1 · Record spending quickly.**
  - Seen: a date, description, amount and category for every expense, all typed by hand. Amounts are in thousand VND.
  - Need: logging an expense must take seconds, especially on a phone.
- **UC2 · Work out an amount from several numbers.**
  - Seen: formulas like `100+218` and `148-59-43`, where the user sums a bill or removes other people's shares.
  - Need: compute the amount while entering it.
- **UC3 · Refunds and reimbursements.**
  - Seen: negative amounts.
  - Need: record money coming back against earlier spending.
- **UC4 · Record income.**
  - Seen: salary, bonus, support from others, and borrowed money all recorded as income.
  - Need: record income and distinguish what kind it is.
- **UC5 · Spending that was never logged.**
  - Seen: a manual "untracked/minor spent" adjustment.
  - Need: reconcile records with reality without itemizing everything.
- **UC6 · Notice unusually large everyday spending.**
  - Seen: colored rows at ≥200 and >500.
  - Need: be warned when an everyday expense is unusually big.
- **UC7 · Explain an entry.**
  - Seen: comments that break down bills or planned amounts.
  - Need: attach an explanation.

### B. Monthly planning and "free money"
- **UC8 · Think in months.**
  - Seen: one sheet per month.
  - Need: see and manage one month at a time, and start a new month easily.
- **UC9 · Carry the leftover into next month.**
  - Seen: last month's remaining money is added to this month's income.
- **UC10 · Plan spending for the month.**
  - Seen: planned vs actual amounts per category, plus one-off goals for that month (a trip, helping someone, paying back a loan).
  - Need: set a plan and see progress against it.
- **UC11 · Know my real "free money".**
  - Seen: unspent planned money is reserved until the item is marked done, and free money = income − spent − reserved.
  - Need: always know how much is truly available.
- **UC12 · Pay later (credit card, pooled fund).**
  - Seen: these purchases don't count as spent when made; paying back the card or fund counts.
  - Need: track what is owed on each pay-later source.

### C. Obligations
- **UC13 · Money I owe.**
  - Seen: a list of creditors; borrowed money appears as income; repayments are expenses under per-person categories.
  - Need: know whom I owe, how much is left, and record repayments.
- **UC14 · Paying back toward a total.**
  - Seen: numbered installments with "paid / total".
  - Need: see progress toward paying off a debt.
- **UC15 · Money others owe me.**
  - Seen: debtors with a reason; some are likely lost.
  - Need: track what others owe me, including partial repayments and write-offs.
- **UC16 · Split a shared bill.**
  - Seen: comments listing each person's share; other people's shares subtracted from the amount.
  - Need: pay for a group and keep only my share as spending.
- **UC17 · Recurring payments.**
  - Seen: fixed monthly charges with a charge day, plus a note about reminders.
  - Need: be reminded and record each payment easily.

### D. Insight
- **UC18 · Quick glance.**
  - Seen: the dashboard sheet exists so the user can check the essentials at a glance.
- **UC19 · Trends across months.** *(New)*
- **UC20 · Savings.** *(New; the "Saving" cell is never used.)*

### E. Data and customization
- **UC21 · Consistent, customizable categories.**
  - Seen: the same concept is spelled several ways, and categories are invented for one-off purposes.
- **UC22 · Private data, many users.**
  - Need: data lives on the user's own device, with backup and restore through a file. Friends use the same site with their own data and no accounts.

**Deliverable:** `wireframes/requirements/use-cases.md` (Vietnamese and English), with a keep/change/drop column for the user.

---

## Phase 1: Design (the main focus before any real build)

### 1a. UX principles: `wireframes/ux/ux-principles.md`
- **One primary action:** a "＋" button that is always reachable opens entry. There are never rows to fill in.
- **Show answers, not formulas.** The headline is "Bạn còn **X** tiền tự do"; tapping it explains how X was calculated.
- **Smart defaults and progressive disclosure:**
  - Defaults: date = today, the last-used category, payment = cash.
  - Advanced options (note, split bill, pay-later, link to a debt) sit behind "Thêm chi tiết".
- **Mobile-first and thumb-friendly:** bottom navigation, bottom sheets and large tap targets. On desktop the same screens get a two-column layout.
- **Friendly Vietnamese copy and forgiving input:** undo after delete, and edit by tapping any item.

### 1b. Information architecture: `wireframes/ux/information-architecture.md`
Proposed navigation, to be validated in review:
- **Trang chủ** (home): the free-money card, due-soon payments, plan progress and alerts. *(UC11, UC17, UC18, UC6)*
- **Giao dịch** (transactions): a timeline grouped by day with daily totals, plus search and filter chips. *(UC1–UC7)*
- **＋** (center button): the entry sheet.
- **Kế hoạch** (plan): this month's plan as progress cards, and the month switcher. *(UC8–UC10)*
- **Sổ nợ** (debts and receivables): "Tôi nợ" / "Nợ tôi", pay-later sources, and recurring payments. *(UC12–UC17)*
- **Thêm / Cài đặt** (more/settings): savings, reports, categories, and data backup. *(UC19–UC22)*

### 1c. User flows: `wireframes/ux/user-flows-round1.md`
Each flow is written step by step and mapped to its use cases. These are the initial design ideas to evaluate:
- **Log an expense (UC1, UC2, UC6):**
  1. Tap ＋.
  2. Type the amount on a built-in keypad that has `+ −` keys, so it doubles as a calculator.
  3. Pick a category from an icon grid (recent categories first).
  4. Optionally add a description, with suggestions from history.
  5. Save, or save and add another.
  A large everyday expense shows a gentle warning chip.
- **Log income (UC4):** the same sheet with a Chi/Thu (expense/income) toggle and type chips. Choosing "Vay" (borrowed) asks "từ ai?" (from whom?) and creates or updates a debt automatically. *(UC13)*
- **Refund (UC3):** a "Hoàn tiền" action on an existing expense, or a toggle in the sheet.
- **Never-logged spending (UC5):** "Đối chiếu số dư" (reconcile balance). The user enters the cash and account balance they actually have, and the app records the difference as unlogged spending. This replaces typing an adjustment formula.
- **Split a bill (UC16):** under "Thêm chi tiết → Chia hóa đơn", enter the total, add people and their shares, and only my share counts as spending. The other shares become "Nợ tôi" (owed to me), each with an "Đã nhận" (received) button.
- **Pay later (UC12):** choose a source such as "Thẻ tín dụng". Sổ nợ shows the balance, and "Thanh toán thẻ" (pay the card) records the payment.
- **Plan and free money (UC8–UC11):** a "Lập kế hoạch tháng mới" (plan a new month) wizard:
  1. Confirm the carried-over money.
  2. Review the plan items from last month and the recurring payments.
  3. Add one-off goals.
  4. Done.
  Each plan card shows actual vs planned and has a "Xong" (done) action that releases its reserve.
- **Repay a debt or recurring payment (UC13, UC14, UC17):** debt cards show progress, and "Ghi nhận trả" (record a payment) opens a prefilled entry sheet. A due-soon item on Trang chủ is marked paid with one tap.
- **Receivables (UC15):** person cards with status, plus "Nhận một phần" (received part) and "Xóa nợ" (write off).
- **Savings and trends (UC19, UC20):** savings deposit/withdraw entries, a balance and optional goals. A reports screen with monthly income vs spending and category breakdowns.
- **Data (UC22):**
  - First-run onboarding: start new / upload a file / try demo data.
  - A "Sao lưu" (backup) download.
  - A banner when the data hasn't been backed up recently.

### 1d. Wireframes
Low-fidelity wireframes for every screen and sheet above, mobile and desktop. They go in `wireframes/screens/screen-registry.md` as ASCII, and also on a single static HTML wireframe page so they're easy to view. The user reviews them in **feedback round 1** (`wireframes/feedback/round-1-wireframes.md`: a per-screen keep/change/drop table and open questions).

### 1e. Visual style: `wireframes/ux/visual-style.md`
Color tokens (light and dark), typography that supports Vietnamese diacritics (e.g. Be Vietnam Pro), category icons and colors, money formatting, and the component list (sheet, keypad, card, progress, chip, toast).

### 1f. Clickable prototype (run locally)
The approved wireframes are built in the real React codebase, running on in-memory **generic** demo data. All flows are clickable, and persistence is minimal (localStorage plus a Download/Upload stub). The user reviews it in **feedback round 2** (`docs/feedback/round-2-prototype.md`).

This reuses code for production. The project scaffold, `domain/` logic and the UI components are written properly here and carried into Phase 2.

---

## Phase 2: Implementation
- Apply the round-2 decisions and record them in `wireframes/decisions.md`.
- Finish persistence:
  - zustand `persist` to localStorage.
  - JSON export/import validated with zod.
  - `schemaVersion` migrations.
  - Vietnamese error messages.
  - Backup reminders.
- Complete all flows, empty states, undo, search and filter, and the desktop two-column layout. A PWA is optional.
- Deployment:
  - `deploy/nginx.conf` with an SPA fallback and CSP `connect-src 'self'`.
  - An optional Dockerfile (nginx:alpine).
  - A Vietnamese README.

## Technical foundation (used from Phase 1f onward)
- **Stack:** Vite (react-ts), Tailwind CSS, react-router, zustand, zod, date-fns (vi), Recharts, vitest.
- **i18n:** strings live in `src/i18n/vi.ts`. Numbers use `Intl.NumberFormat('vi-VN')` and dates use `dd/MM/yyyy`.
- **Folder structure:**
  ```
  src/
    domain/   types.ts, calc.ts, schema.ts, migrations.ts, defaults.ts (generic categories)
    store/    useAppStore.ts
    io/       exportJson.ts, importJson.ts
    lib/      format.ts, evalAmount.ts (safe + − × ÷ parser for the keypad), id.ts
    features/ home/, transactions/, entry/ (EntrySheet, Keypad, SplitBill), plan/, ledger/ (debts,
              receivables, pay-later, recurring), savings/, reports/, settings/, onboarding/
    components/ui/
  docs/  use-cases.md, design/*, feedback/*, decisions.md
  ```
- **Data model (draft, finalized after design):**
  - Transactions: expense/income with kind, category, payment source, note, split and debt links.
  - Monthly plan items with a done flag.
  - Reconcile adjustments.
  - Debts and receivables with payment history and an optional target.
  - Pay-later sources.
  - Recurring payments with a charge day.
  - Savings entries and goals.
  - Categories with icon, color and warning thresholds.
- **Pure calculations in `domain/calc.ts`:**
  - Free money = income + carry-over − spent − reserved.
  - Spent excludes pay-later purchases and includes card payments and reconcile adjustments.
  - Reserved = Σ max(planned − actual, 0) over plan items not marked done.
  - Debt and receivable balances.
  - Due-soon payments.
  - Savings balance.

## Verification
- **Phase 1:** the user signs off feedback rounds 1 and 2. Every use case maps to at least one flow and screen; this is checked with a traceability table in `user-flows-round1.md`.
- **Unit tests (`npm run test`):** `calc.ts`, using fixtures that reproduce the workbook's monthly logic (free money, reserve, pay-later exclusion, reconcile), plus `evalAmount.ts` and an export → import round-trip.
- **Manual check (`npm run dev`, mobile viewport):**
  - Log an expense with keypad math.
  - Split a bill, then receive a share.
  - Borrow money, then repay it.
  - Make a card purchase, then pay the card.
  - Plan a new month with carry-over, then mark a plan item done.
  - Reconcile the balance.
  - Back up → clear → restore.
- **Production build (`npm run build && npx vite preview`):** it works, and the network tab shows no data leaving the browser.
