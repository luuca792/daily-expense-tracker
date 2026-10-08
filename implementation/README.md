# implementation/: the real product

The **actual product**, deployed on the user's server for friends to use. Built from `plan.md`; `prototype/` is reference only.

| Path | Content |
|---|---|
| `plan.md` | Implementation plan: architecture and code layout, data model (schema v1), persistence and migrations, JSON export, quality, deployment |
| `app/` | Production source code (Vite + React + TS PWA) |
| `deploy/` | Dockerfile, nginx config, host-proxy example, build-and-push script, Vietnamese install guide (`huong-dan.md`); see `deploy/README.md` |
| `test-script.md` | Manual checks per screen number, device checks, update check |

## Commands (in `app/`)
| Command | What |
|---|---|
| `npm run dev` | Dev server (launch config `app`, port 5174). No seed switch: data starts empty (1.0). |
| `npx tsc --noEmit` · `npm test` | Type-check · unit tests (Vitest, 86) |
| `npm run e2e` | End-to-end (Playwright, mobile Chromium) against a fresh production build; `E2E_BASE_URL=…` targets a running server instead |
| `npm run build` | Static site in `dist/` |

## Status (2026-10-08)
- §7 steps 1–3 done: skeleton, domain port, data layer, **all screens** (1.0–7.1, 4.2, 4.3, BootError) with 6.0 **💾 Dữ liệu · Xuất dữ liệu**.
- §7 step 4: e2e suite done (5 tests: reload keeps data, export file, two tabs, offline via service worker, manifest), passing against the build and the Docker image. Deploy files ready.
- **Waiting on the user:** the final subdomain (replace `SUBDOMAIN` in `deploy/host-nginx.example.conf` and `deploy/huong-dan.md`), the deploy itself, and the device checks in `test-script.md` (Android + iPhone, offline, update check).
- After that, §7 step 5: friends start using it, and **schema v1 is frozen** (plan §3.1, §5 release rule).

## Implementation notes (choices the plan left open)
**Data layer**
- **Validation keeps the stored object as is.** zod only checks; it doesn't return its stripped copy, so a field it doesn't know is never silently dropped.
- **Old tab vs. new app.** `save()` reads the stored `schemaVersion` inside its transaction. If a newer app (in another tab) already migrated the data, the old tab doesn't write and reloads instead, so it picks up the new version.
- **Other tabs** re-read through the full `load()` (validation included). Taking another tab's data drops this tab's undo toast, because its "before" copy is out of date.
- **Save failure** toast: "Chưa lưu được dữ liệu" (no Hoàn tác). The change stays in memory; the next change saves the whole data again.
- **Export cancelled** (share sheet closed) doesn't update the 6.0 date. After an export: toast "Đã xuất dữ liệu" (no Hoàn tác).
- **IndexedDB unavailable** at boot (e.g. blocked): BootError, with nothing to export.
- **Fixture** `data/__fixtures__/v1-sample.json` is the fictional sample data (`domain/__fixtures__/sample.ts`) as JSON.

**Screens**
- **Store recipes live in `domain/`** (`saveExpense`, `saveIncome`, `saveTransfer`, `saveGoal`, `saveLiving`, `removeX`, `editPeriod`). Each finds its period and item by id in the current data and does nothing if they are gone (deleted in another tab), instead of crashing as the prototype's inline recipes would.
- **5.0** with a missing period → 4.0; with an unknown tab → Ghi chép. **Back** on 5.0 and 6.0 returns to where the page was opened from, or to 4.0 / 2.0 when opened directly (reload, link) so it never leaves the app.
- **DateField** has no clear button: every date in the app is required (the prototype's `clearable` was unused).
- **5.3 per-day bars** (`livingPerDay`) and the **7.0 list order** (`transferHistory`) moved from screens into `domain/` with tests; the per-day bars now also count expenses of a deleted goal as untracked.
- **Styles:** the prototype's stylesheet was ported once (`styles/base.css`, `components.css`); its inline styles became small classes at the end of `components.css`. Only data-driven values (colors, widths) stay inline.
- **CSP** (`deploy/nginx.conf`) allows inline style attributes (needed for those values) and nothing else inline.

## Domain port notes (prototype `domain/` → `app/src/domain/`)
| Prototype | Now | Change |
|---|---|---|
| `types.ts` | `data/schema/v1.ts` (stored types, frozen at release) + `domain/types.ts` (re-export, `LIVING`, `emptyData`, `cleanName`) | `COLOR_KEYS` moved into the schema so zod can use it. `uid()` replaced by `ids.ts` `newId()` (UUID, fallback on plain http). |
| `calc.ts` | `calc.ts` (R4, R1.3, R7, 5.3 per day) + `savings.ts` (R6, 7.0 order) | New `categoryOf()`: an expense whose goal no longer exists counts as untracked (plan §3.2). New `isReadOnly()` (plan §2.5). |
| `periods.ts` | `periods.ts` + `goals.ts` (`deleteGoal`, `categoryDisplay`) | `buildPeriod` has no `end` input (always `null`, then `normalizePeriods`). New `editPeriod()` for 4.1 Edit. |
| `entries.ts` | `entries.ts` + `dates.ts` | `todayISO`, `dayLabel` moved to `dates.ts`; new `allEntries()`, `shiftDays()`. |
| `format.ts` | `money.ts` + `dates.ts` | New `parseAmount()` (the amount box's digit parsing, was inline in `ui.tsx`). |
| `palette.ts` | `components/palette.ts` | Colors and icon list are UI only. |
| `store/seed.ts` | `domain/__fixtures__/sample.ts` | Fictional sample data, used by tests only. |
| `domain.test.ts` | one `*.test.ts` per file + `changes.test.ts` | Same cases, plus the `end` rule after every period operation, deleted-goal category, store recipes, dates/money/ids. |
