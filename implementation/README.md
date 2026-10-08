# implementation/: the real product

Planning and building the **actual product** that will be deployed on the user's server for friends to use. This starts after the prototype has been approved.

| Path | Content |
|---|---|
| `plan.md` | Implementation plan: architecture and code layout, data model (schema v1), persistence and migrations, JSON export, quality, deployment |
| `app/` | Production source code (created when implementation starts) |
| `deploy/` | nginx config, optional Dockerfile, deployment notes (created later) |

**Inputs:** the per-screen specs in `wireframes/screens/specs/`, `wireframes/logic/logic-rules.md`, `wireframes/decisions.md`, and the running prototype (`prototype/screens.md`, `prototype/changes.md`). The app is new code; `prototype/` is reference only.

**Status** (run with `npm run dev` in `app/`, launch config `app`, port 5174):
- §7 step 1 (skeleton) done 2026-10-08: Vite + React + TS app in `app/`, hash routes per page number (placeholders), tokens, PWA config, Vitest.
- §7 step 2a (domain port) done 2026-10-08: `src/domain/` + tests (47).
- §7 step 2b (data layer) done 2026-10-08: `src/data/` (zod, repository with write queue and pre-migration backup, empty migration list, export, tabs, persist), `src/state/` (store, autosave, exportNow), BootError, boot in `main.tsx`; 1.0 placeholder already saves. Tests: 77.
- §7 step 3 (screens) started 2026-10-08. Done: 1.0, 1.1, 2.0, 2.1; shared Header, Sheet + Field, Dialog, Toast (Hoàn tác only when undoable), icons, motion; page-slide transitions; prototype CSS ported into `styles/base.css` + `components.css`. Placeholders (with back button): 3.0, 4.0, 5.0, 6.0, 7.0. Next: 3.0 Overview.

## Data layer notes (choices the plan left open)
- **Validation keeps the stored object as is.** zod only checks; it doesn't return its stripped copy, so a field it doesn't know is never silently dropped.
- **Old tab vs. new app.** `save()` reads the stored `schemaVersion` inside its transaction. If a newer app (in another tab) already migrated the data, the old tab doesn't write and reloads instead, so it picks up the new version.
- **Other tabs** re-read through the full `load()` (validation included). Taking another tab's data drops this tab's undo toast, because its "before" copy is out of date.
- **Save failure** toast: "Chưa lưu được dữ liệu". The change stays in memory; the next change saves the whole data again.
- **Export cancelled** (share sheet closed) doesn't update the 6.0 date. The export toast is "Đã xuất dữ liệu".
- **IndexedDB unavailable** at boot (e.g. blocked): BootError, with nothing to export.
- **Fixture** `data/__fixtures__/v1-sample.json` is the fictional sample data (`domain/__fixtures__/sample.ts`) as JSON.

## Domain port notes (prototype `domain/` → `app/src/domain/`)
| Prototype | Now | Change |
|---|---|---|
| `types.ts` | `data/schema/v1.ts` (stored types, frozen at release) + `domain/types.ts` (re-export, `LIVING`, `emptyData`, `cleanName`) | `COLOR_KEYS` moved into the schema so zod can use it. `uid()` replaced by `ids.ts` `newId()` (UUID, fallback on plain http). |
| `calc.ts` | `calc.ts` (R4, R1.3, R7) + `savings.ts` (R6) | New `categoryOf()`: an expense whose goal no longer exists counts as untracked (plan §3.2). New `isReadOnly()` (plan §2.5). |
| `periods.ts` | `periods.ts` + `goals.ts` (`deleteGoal`) | `buildPeriod` has no `end` input (always `null`, then `normalizePeriods`). New `editPeriod()` for 4.1 Edit. |
| `entries.ts` | `entries.ts` + `dates.ts` | `todayISO`, `dayLabel` moved to `dates.ts`; new `allEntries()`, `shiftDays()`. |
| `format.ts` | `money.ts` + `dates.ts` | New `parseAmount()` (the amount box's digit parsing, was inline in `ui.tsx`). |
| `palette.ts` | not ported yet | Colors and icon list are UI; they come with `components/` in step 3. |
| `store/seed.ts` | `domain/__fixtures__/sample.ts` | Fictional sample data, used by tests only. |
| `domain.test.ts` | one `*.test.ts` per file | Same cases, plus the `end` rule after every period operation, deleted-goal category, dates/money/ids. |
