# Sổ chi tiêu: personal expense tracker

A web app that replaces the user's Excel spending workbook (`references/personal-fund.xlsx`, personal data, **never copy names or figures from it into the app or docs**).
- Vietnamese UI, mobile-first.
- Installable web app (PWA, D55): a static site with no backend that installs from the browser and works offline. Data lives only on the device (IndexedDB), so even the server owner can't see it. Losing the phone loses the data (D56), so the real app ships a JSON export in its first release (import comes later; see `implementation/plan.md` §4.6).
- It will be deployed on the user's server for friends too.

## Repo layout (each phase has its own folder; see the README in each)
- `wireframes/`: **design phase** (closed 2026-10-06, frozen). Use cases, UX docs, wireframes, screen specs, logic rules, decisions D1–D62. Read it for background; don't edit it.
- `prototype/`: **current phase**. A clickable draft that runs locally. `README.md` holds the working mode, `screens.md` the screen map, `changes.md` the change log; the code is in `prototype/app/`.
- `implementation/`: the real product, a **new app** built from scratch. `plan.md` holds the architecture, code layout and data/storage plan; the code goes in `implementation/app/`, and deploy config in `implementation/deploy/`. Everything in `prototype/` is only the prototype: use it as a reference, never import from it, and port code only file by file after review.
- Root: `README.md` (map), `plan.md` (the user's original brief, don't edit), `references/` (Excel, personal data).

## Current phase: IMPLEMENTATION (from 2026-10-08)
The prototype is accepted as the base. Build the real app in `implementation/app/` following `implementation/plan.md` (build order in §7; the data layer comes before any screen).
- **Behavior comes from the prototype:** `prototype/screens.md`, `prototype/changes.md`, the prototype's `domain/` code, and `implementation/plan.md` §2.5 (rules changed after the design phase). Where they differ from `wireframes/`, the prototype wins. Never update `wireframes/`.
- **Screens are named by number** from `prototype/screens.md` (e.g. "5.2", "7.1").
- **Data format is precious:** follow plan §3–4; any change to `data/schema/` needs a migration step, a fixture and tests (plan §5).
- After code changes: `npx tsc --noEmit` and `npm test` in `implementation/app`.
- **Changelog:** every change to the real app (or its deploy) gets a line in `implementation/CHANGELOG.md` (Keep a Changelog), under the newest version block, committed together with the change. A new version block appears only when the version in `implementation/app/package.json` is bumped.

## Prototype (reference, kept runnable)
`prototype/app/`, the clickable draft: `npm run dev -- --host` there. If the prototype itself is changed, log one row per change in `prototype/changes.md` and run `npx tsc --noEmit` and `npm run build` there.

## Background (read when a request needs it)
1. `prototype/screens.md` and `prototype/changes.md`: current state.
2. `wireframes/logic/logic-rules.md`: the hidden behavior behind the code comments (R1 periods, R2 goals, R3 entries, R4 calculations, R5 ＋ button per tab, R6 savings, R7 active period & total wealth).
3. `wireframes/decisions.md` (D1–D62) and `wireframes/screens/specs/`: why things are the way they are, as of the end of the design phase.
4. `wireframes/ux/visual-style.md`: colors and components.

## Working conventions (the user's explicit preferences)
- **Screen names:** `<number>.<sub>. <Name>`, e.g. "5.4. Add Expense". `.0` is the main page; sub-numbers are its tabs and sub-pages. New screens take the next free number and get a row in `prototype/screens.md`.
- **Incremental and simple:** propose the smallest next step, and park extra features.
- **No explanatory text on screen:** no info boxes, hints, taglines, "(không bắt buộc)" markers or status sentences. Show only labels, values and actions. Explanations go in the docs.
- **Don't ask small questions every turn:** pick the simplest default, note it in `prototype/changes.md`, and keep going.
- **Document hidden logic:** any sorting, grouping, default or calculation gets a code comment and a line in `prototype/changes.md`.
- **Saving tokens** (agreed): the user may batch several changes in one message. Skip browser screenshots for small text removals and check visually only for layout changes.

## Notes
- On Windows, set `PYTHONIOENCODING=utf-8` when Python prints Vietnamese.
