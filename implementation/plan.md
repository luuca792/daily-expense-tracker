# Implementation plan

The real product is a **new app built in `implementation/app/`**. `prototype/` is only the prototype: it is reference material (screens, behavior, look), never a dependency. Nothing in `implementation/` imports from `prototype/`.

The prototype was accepted as the base on 2026-10-08, and implementation starts from this plan. Sections 3 and 4 (data) matter most: once friends save real data, the stored format and the way it gets upgraded have to be supported for as long as the app exists.

**Source of truth for behavior**, in order: `prototype/changes.md` and the prototype's `domain/` code, then `wireframes/logic/logic-rules.md` (R1–R7). The wireframes are frozen and some rules changed after them; the important ones are listed in §2.5.

## 1. Constraints (fixed)
- **Installable web app (PWA), D55:** a static site with **no backend** and no accounts. Users install it from the browser and can use it offline. Data never leaves the device unless the user exports it.
- Vietnamese UI, mobile-first, also works on desktop.
- **Local data (D56, updated 2026-10-08):** data lives on one device and is saved automatically. **JSON export ships in the first release** (§4.6); import is still a later feature. Without an export, a migration bug or a change of the app's address would lose everyone's data with no way back.

## 2. Architecture

### 2.1 Stack
| Part | Choice |
|---|---|
| Build | Vite + React + TypeScript (D1), strict mode, Node 20 |
| PWA | `vite-plugin-pwa` (D55) |
| Routing | React Router, hash URLs (`#/periods/:id/goals`) |
| State | One Zustand store, holding the whole `Data` object in memory |
| Storage | IndexedDB via Dexie (§4) |
| Validation | zod: checks data on load, after migrations and on import |
| Dates / money | `date-fns` (vi locale); amounts are integers in thousands of đồng |
| Styling | Plain CSS with tokens from `wireframes/ux/visual-style.md`; Be Vietnam Pro bundled through `@fontsource` (works offline) |
| Tests | Vitest (domain + data layer), Playwright (a few end-to-end flows, §5) |

### 2.2 Layers (dependencies go one way only)
```
screens/ ─▶ components/
   │
   ▼
state/ ─▶ domain/  ◀── data/
             ▲
```
- **`domain/`** contains pure functions and types, with no React and no browser APIs. It holds every rule (R1–R7 as amended in §2.5), which can all be unit-tested.
- **`data/`** is the only code that touches IndexedDB or files: the stored schema, migrations, loading, saving and export. It depends on `domain/` types and nothing else.
- **`state/`** is the Zustand store. It loads through `data/`, changes data by applying recipes that call `domain/` functions, and calls `data/` to save after each change.
- **`screens/`** and **`components/`** read from and write to `state/`. They never call `data/` directly, with one exception: the boot error screen calls export (§4.4).

### 2.3 Code layout
```
implementation/
  plan.md · README.md
  app/
    package.json · tsconfig.json · vite.config.ts · pwa-assets.config.ts · index.html
    playwright.config.ts
    public/                    icon.svg + generated PNGs
    src/
      main.tsx                 boot: open DB → load/migrate → render <App> or <BootError>
      App.tsx                  router + layout shell
      routes.tsx               route table, one entry per page number

      domain/                  pure logic; rule IDs in comments (// R4 Dự trữ)
        types.ts               app types = re-export of data/schema/current
        periods.ts             R1 periods, carry-over, lifecycle: createPeriod · closingEnd · normalizePeriods · deletePeriod
        goals.ts               R2
        entries.ts             R3 add/edit/delete, ordering, grouping by day
        calc.ts                R4 totals and reserve, R7 active period, total wealth and shares
        savings.ts             R6 fund balance, transferAllowed / removalAllowed
        dates.ts               local "today" as yyyy-MM-dd (never toISOString, §3.3)
        money.ts               formatting, parsing
        ids.ts                 newId()
        *.test.ts              next to each file

      data/                    persistence; the only code that knows about IndexedDB
        schema/
          v1.ts                FROZEN copy of the stored types of version 1
          current.ts           re-exports the latest vN + CURRENT_VERSION
          zod.ts               zod schema for the current version
        migrations/
          index.ts             ordered list: migrate(raw) → current
          v1_to_v2.ts          (when needed) each step imports only frozen vN types
        db.ts                  Dexie database, table `kv`
        repository.ts          load(), save(); write queue; pre-migration backup
        persist.ts             navigator.storage.persist()
        tabs.ts                BroadcastChannel sync between open tabs
        export.ts              build envelope, share or download file
        __fixtures__/
          v1-sample.json       stored data from each released version (§5)

      state/
        store.ts               Zustand store: data, update(recipe), undo toast
        autosave.ts            subscribe → repository.save()

      screens/                 one file per screen number, sheets inside their parent folder
        S1_0_Welcome/          S1_0_Welcome.tsx · S1_1_YourName.tsx
        S2_0_Home/             S2_0_Home.tsx · S2_1_NameSheet.tsx
        S3_0_Overview.tsx
        S4_0_Periods/          S4_0_Periods.tsx · S4_1_PeriodSheet.tsx · S4_2_DeletePeriod.tsx · S4_3_ClosePeriod.tsx
        S5_0_PeriodDetail/     S5_0_PeriodDetail.tsx · S5_1_Logging.tsx · S5_2_Goals.tsx · S5_3_Statistics.tsx
                               S5_4_ExpenseSheet.tsx · S5_6_GoalSheet.tsx · S5_7_DeleteGoal.tsx
                               S5_9_IncomeSheet.tsx · S5_10_TransferSheet.tsx
        S6_0_Settings/         S6_0_Settings.tsx · S6_1_SettingSheet.tsx
        S7_0_Savings/          S7_0_Savings.tsx · S7_1_BaseSheet.tsx
        BootError.tsx          shown when stored data can't be opened (§4.4)

      components/              shared parts named in prototype/screens.md
        Header.tsx · Sheet.tsx · Dialog.tsx · Toast.tsx · PlusButton.tsx · BottomBar.tsx
        AmountBox.tsx · DateField.tsx · DayBox.tsx · EntryRow.tsx · GoalCard.tsx · Ring.tsx · Bars.tsx · CalendarIcon.tsx
      styles/
        tokens.css · base.css · components.css
    e2e/
      persistence.spec.ts      add → reload → still there; export file contents
      install-offline.spec.ts  service worker serves the app with network off
  deploy/
    nginx.conf · Dockerfile · docker-compose.yml
    huong-dan.md               Vietnamese install guide for friends
```
Screen numbers, Vietnamese labels and behavior come from `prototype/screens.md` and the running prototype, which wins over `wireframes/` where they differ.

### 2.4 What carries over from the prototype
- **Decisions and behavior:** everything in `prototype/changes.md` plus the rules R1–R7.
- **Domain code:** `prototype/app/src/domain/` can be ported **one file at a time**. Each file is reviewed and its tests are copied over; it is never imported directly.
- **UI:** rewritten to the structure above. Prototype markup and CSS can be used as a reference.
- **Not carried over:** the in-memory store, the seed switches (`?seed=demo`, `?seed=empty`) and `uid()`. The sample data (`store/seed.ts`, fictional) can be reused for tests and fixtures.

### 2.5 Rules changed after the design phase (not in `logic-rules.md`)
Only the ones that change calculations or the period model are listed; small UI changes are in `prototype/changes.md`.
| Rule | Now |
|---|---|
| **R4 Dự trữ** (reserve) | **Per goal:** Σ max(target − spent, 0) over goals not done. Overspending one goal doesn't lower what the others need. (Design said max(Σ targets − Σ spent, 0).) |
| **R6.4 transfers** | Deposits and withdrawals use one check: allowed if the fund after saving is ≥ 0 **or** not lower than now. A new withdrawal can't overdraw; any edit that raises a negative fund (possible after Số dư ban đầu is lowered or deleted, R6.7) is allowed. |
| **R7.2 shares** | Rounded shares are kept within 1–99%, so a part > 0 never shows 0%. |
| **Period model** | One period at a time. The **active** period (R7.1: newest start date) is the only one that can be changed; all others are read-only history: no ＋, no Gửi tiết kiệm, entries/goals can't be opened, no Sửa kỳ (Xóa kỳ stays). |
| **4.1 Create** | Fields: name and start date only (**no end date field**, any start date allowed). No "Chọn kỳ trước đó": the carry-over (R1.8) always comes from the active period. If the new start ≥ the active start, **4.3 Đóng kỳ “…”?** (Hủy / Tạo kỳ) confirms closing the active period. |
| **Closing / end dates** | `end` is set by the app, never typed. `normalizePeriods()` runs after every period create, edit or delete: the active period has `end = null`; any other period still open gets `end` = day before the next newer period's start, but never before its last entry or its own start. Deleting the active period reopens the one before it. A wrong start date is fixed by re-dating (it flips back). Because past periods are read-only, the carry-over snapshot can't go stale. |
| **4.1 Edit** | Active period only: name and start date (not after its first entry). |
| **Display name** | `userName` in the data. Whenever there is data but no name (the first start), **1.1 Xin chào! Bạn tên gì?** replaces 2.0 and every other page; Tiếp tục is disabled while the name is empty. 2.0's header reads **Xin chào, {name} 👋** with a pencil that opens **2.1 Đổi tên**; saving an empty name changes nothing. Names are trimmed and cut to 30 characters (`cleanName`). |
| **Period icon** | Removed. Every period tile shows a drawn calendar (`CalendarIcon`) in the tile's text color. |

## 3. Data model: schema version 1

### 3.1 Stored types (frozen at the first real release)
This is `data/schema/v1.ts`, copied from the prototype's `types.ts` when implementation starts. Until the first release it can still change for free. After that, every change needs a migration (§4.3).

```ts
type ISODate = string;            // 'yyyy-MM-dd', local calendar day
type ColorKey = 'orange'|'blue'|'pink'|'violet'|'green'|'amber'|'indigo'|'slate'|'red'|'teal'|'cyan'|'lime';

interface Goal     { id: string; name: string; icon: string; color: ColorKey; target: number; done: boolean }
interface Living   { max: number; icon: string; color: ColorKey }
interface Expense  { id: string; amount: number; category: string | null;  // 'living' | goal id | null = untracked
                     description: string; date: ISODate; createdAt: number }
interface Income   { id: string; amount: number;                          // may be negative (carry-over, D60)
                     description: string; date: ISODate; createdAt: number }
interface Transfer { id: string; dir: 'in' | 'out'; amount: number;       // > 0
                     date: ISODate; createdAt: number }
interface Period   { id: string; name: string; start: ISODate; end: ISODate | null; createdAt: number;
                     living: Living; goals: Goal[]; expenses: Expense[]; incomes: Income[]; transfers: Transfer[] }
interface Settings { livingMax: number; largeFrom: number }
interface DataV1   { schemaVersion: 1; settings: Settings; periods: Period[]; baseSavings: number | null;
                     userName: string | null }  // display name on 2.0; null until asked on 1.1
```
Totals are never stored. `domain/` computes them every time.

### 3.2 Rules that are expensive to change later
| Field | Rule | Why |
|---|---|---|
| `id` | `crypto.randomUUID()`, falling back to a time+random string on plain-http dev. Treated as an opaque string. | Unique across devices, so a future import or sync can merge data without clashes. |
| amounts | Integers, **thousands of đồng** (`1700` = 1.700.000 ₫). No decimals. | Changing the unit later means rewriting every amount on every phone. |
| `date` | `'yyyy-MM-dd'` as text, in the user's local calendar. | No time zones. A Date object or UTC timestamp shifts entries to the wrong day. |
| `createdAt` | Epoch milliseconds. Used only for ordering within a day. | |
| `category` | `'living'`, a goal id, or `null`. | A deleted goal leaves its expenses pointing at an id that no longer exists. `domain/` treats that as untracked (R3). |
| `end` | Managed by the app (§2.5): `null` exactly for the active period, a date for every other one. | Read-only and "chưa kết thúc" both depend on it. Unit tests assert this rule after every period operation; the app never asks the user for an end date. |

Considered and parked: an `updatedAt` on every item for a future sync. It can be added later by a migration that sets `updatedAt = createdAt`.

### 3.3 Dates
"Today" is always `format(new Date(), 'yyyy-MM-dd')` in local time (`domain/dates.ts`). `new Date().toISOString()` is never used. Vietnam is UTC+7, so before 7:00 in the morning it would return yesterday.

### 3.4 Size
Ten entries a day for a year is about 3,700 entries, well under 1 MB. That's why storing the whole object as one record (§4.1) is fine.

## 4. Persistence

### 4.1 Storage layout
- Dexie database `so-chi-tieu` with one table `kv` (key → value). Dexie's own `version(1)` stays fixed. **Format changes go through the app's `schemaVersion`, not Dexie versions.**
- Keys:
  - `data`: the whole `Data` object, one record.
  - `backup-v{N}`: the raw data as it was just before migrating away from version N (§4.3). The two most recent are kept.
  - `lastExportAt`: epoch ms of the last export. It is kept outside `data`, so it isn't exported and never needs migrating.
- Reason for a single record: the store already works on the whole object, writes are atomic, and a migration is just "old JSON in, new JSON out". Tables per entity would mean schema changes inside IndexedDB, which is where data-loss bugs happen.

### 4.2 Boot (load)
`main.tsx` waits for this before rendering:
1. Call `navigator.storage.persist()`, so the browser doesn't evict the data when space runs low. The result is ignored.
2. Read `data`. If there isn't one → `data = null` → 1.0 Welcome.
3. `schemaVersion > CURRENT_VERSION` (the data was written by a newer app, e.g. after a rollback) → **BootError**. Nothing is written.
4. `schemaVersion < CURRENT_VERSION` → migrate (§4.3).
5. Validate with zod. If invalid → **BootError**. Nothing is written.
6. Render the app.

### 4.3 Migrations
- `migrations/index.ts` holds an ordered list `[v1→v2, v2→v3, …]`. Each step is a pure function of plain JSON, typed against the **frozen** `schema/vN.ts` files, so later edits to the app types can't silently change old steps.
- **Migrations are never deleted.** A phone that hasn't opened the app for a year, or an old export file, must still upgrade.
- Order on launch:
  1. Run every needed step in memory.
  2. Validate the result with zod.
  3. In **one Dexie transaction**, write `backup-v{old}` (the untouched raw data) and the new `data`.
  4. If a step throws or validation fails, write nothing and show BootError. The old data stays exactly as it was.
- A rollback to an older app version hits rule 3 of §4.2 and stops safely. The fix is to redeploy the newer version.

### 4.4 BootError
A minimal screen: a short error title, an **Xuất dữ liệu** button that exports the **raw** stored record unchanged, and **Thử lại**, which reloads the page. It never offers to delete or reset data. The raw export lets the user (or you) rescue and repair the data by hand, and a later version can import it.

### 4.5 Saving
- After every store change, `autosave.ts` saves the whole `data` with `put`. There's no debounce, because the data is small and IndexedDB is fast.
- Writes go through a **queue** in `repository.ts`, so an older write can never finish after a newer one.
- The undo toast keeps the previous `data` in memory. Undo is just another save.
- **Several tabs or windows:** after each save the tab posts `saved` on a `BroadcastChannel`. Other tabs re-read `data` and replace their store. Every change applies a recipe to the **current** data, so a sheet left open in another tab doesn't overwrite newer changes when it saves.
- If a save fails (storage full or blocked), show a toast. The change stays in memory, and the next save tries again.

### 4.6 JSON export (first release)
- **Where:** 6.0 Settings gets a new section **💾 Dữ liệu** with one row, **Xuất dữ liệu**, whose value is the date of the last export (`08/10/2026`) or `—`. Tapping it exports immediately; there's no extra screen. Afterwards a toast says "Đã xuất dữ liệu". Following the "no explanatory text" rule, nothing else appears on screen. Why to export goes in the install guide (§6).
- **File:** `so-chi-tieu-yyyy-MM-dd.json`, UTF-8, pretty-printed:
  ```json
  { "format": "so-chi-tieu", "schemaVersion": 1, "exportedAt": "2026-10-08T09:30:00+07:00",
    "appVersion": "1.0.0", "data": { …the stored Data… } }
  ```
  The envelope is identical in every version. A future import checks `format`, runs `data` through **the same migration pipeline** (§4.3), validates it, shows a preview and only then replaces the data. Every file ever exported can therefore be imported.
- **How it reaches the user:**
  - If `navigator.canShare({ files })` is true (iPhone, Android), the share sheet opens, so the user can save to Files or Drive, send it to themselves on Zalo, and so on. On iPhone, plain downloads from a home-screen app are unreliable.
  - Otherwise (desktop), a `Blob` download link.
- The export reads from the store (the current, validated data), except on BootError, which exports the raw record (§4.4).
- Import remains a later feature (D56): file picker → validate → preview → replace, with Vietnamese error messages.

## 4b. Install, offline and updates (PWA, D55)
- `vite-plugin-pwa` generates `manifest.webmanifest` (name "Sổ chi tiêu", icons, theme color, `display: standalone`) and `sw.js`, which precaches every built file, keyed by content hash.
- Install comes from the browser: "Install app" on Android Chrome, Share → "Add to Home Screen" on iPhone Safari.
- Offline: the app opens from the precache. It makes no network requests.
- Updates: the new version takes over **on the next launch**, with no prompt and no reload while in use. Data written by the old version is migrated at that launch (§4.3).

## 5. Quality
- **Unit tests (Vitest)** for every rule (R1–R7 with §2.5): per-goal reserve, carry-over, period lifecycle (create closes, delete reopens, re-dating flips back, `end` rule), grouping and ordering, savings checks, shares, active period. Port the prototype's `domain.test.ts` first; it already covers most of these.
- **Data layer tests:**
  - *Fixtures:* every release that changes `schemaVersion` adds `__fixtures__/vN-sample.json` (fictional data only, never from `references/`). The test loads every fixture through `migrate()` and validates it against the current zod schema.
  - *Migration safety:* a failing step leaves `data` untouched; data from a newer version is refused and nothing is written.
  - *Export round-trip:* export → parse → `migrate` → equals the store data.
  - *Write queue:* rapid saves land in order.
- **End-to-end (Playwright, mobile viewport):** add an expense → reload → it's still there. Export produces a valid file. With two tabs open, a change in one shows up in the other.
- **Manual:** a test script per screen number; install and offline on a real Android phone and an iPhone; the **update check**: install v1 with data, deploy v2, reopen, confirm v2 runs with the data intact.
- **Release rule:** a change to anything in `data/schema/` can't ship without a migration step, a new fixture and passing tests.

## 6. Deployment
- Target: the user's server (nginx, own certificate), on its own subdomain. `implementation/deploy/` is new; the prototype's deploy files are reference only.
- `npm run build` produces static files in `dist/`. nginx serves them with SPA fallback, CSP `connect-src 'self'`, and **HTTPS** (required for the service worker and `crypto.randomUUID`).
- `sw.js`, `index.html` and the manifest (`application/manifest+json`) are served with `Cache-Control: no-cache`. Hashed assets are cached long-term.
- Optional Docker image (nginx:alpine).
- **Keep the subdomain stable forever.** Data belongs to the address. If moving is ever unavoidable, the way across is export → import, which is another reason export ships first.
- `deploy/huong-dan.md`, a short Vietnamese guide for friends:
  - How to install on Android and iPhone.
  - The data lives only on this phone.
  - Tap **Xuất dữ liệu** now and then and keep the file somewhere safe.
  - Don't clear Chrome's site data (Android) or remove the home-screen icon (iPhone).
  - On iPhone, use the icon, not a Safari tab.

## 7. Build order
1. **Skeleton:** Vite app, routing shell, tokens, PWA config.
2. **Data layer before any screen:** `domain/` port + tests, `data/` (schema v1, zod, repository, migrations framework with an empty list, export, tabs) + tests, store + autosave, BootError.
3. **Screens** in number order, each checked against the prototype (`prototype/screens.md`, including 4.3). 6.0 includes Xuất dữ liệu; past periods in 5.0 are read-only.
4. **E2E + manual device checks**, then deploy under the final subdomain.
5. **Friends start using it.** From here on, §3.1 is frozen and §5's release rule applies.

## 8. Open items
- See `wireframes/open-questions.md` sections A and B (Overview, debts, savings…).
- Later: import (§4.6), optional reminder when the last export is old, `updatedAt` for sync.
- Parked (D55): optional end-to-end encrypted sync, one encrypted blob per user on the same server. The export envelope and migration pipeline are reused for it unchanged.
