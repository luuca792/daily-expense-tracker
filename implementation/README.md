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
- §7 step 2a (domain port) done 2026-10-08: `src/domain/` + tests (47). Next: step 2b, `data/` (zod, repository, migrations, export, tabs), store + autosave, BootError.

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
