# design-sync notes (implementation/app)

Config home is `implementation/app` (run every command from there). Shape: package, no Storybook.

- **No library build in the app**: `node .design-sync/build-lib.mjs` (the `buildCmd`) makes a mini package in `.design-sync/.cache/pkg/`:
  esbuild bundles `.design-sync/lib-entry.ts` (react external), `tsc -p .design-sync/tsconfig.lib.json` emits `.d.ts`,
  and the three app stylesheets are concatenated into `dist/styles.css` (`cssEntry`). Needs `.ds-sync/node_modules/esbuild` (staged converter deps).
- **Component list = `.design-sync/lib-entry.ts`**. A new shared component in `src/components/` must be added there by hand. `Toast` is left out on purpose (reads the zustand store, not props).
- `srcDir`/`componentSrcMap`/`extraFonts` paths are relative to the mini package (`.design-sync/.cache/pkg`), hence `../../../`.
- Domain types (Period, Expense, Goal, ColorKey) don't resolve through the converter's `.d.ts` extraction → hand-written `dtsPropsFor` with structural types. **If `src/data/schema` changes, update `dtsPropsFor`.**
- Groups come from stub docs in `.design-sync/groups/<Group>.md` (frontmatter `category` only), mapped via `docsMap`.
- Fonts: `@fontsource/be-vietnam-pro` 400–800 via `extraFonts` (the app bundles the font, no Google Fonts).
- Previews: `base.css` paints `html` grey (#e2e8f0); each preview's `Frame`/`Phone` injects `html{background:#fff}` for the card only.
  Fixed-position components (`Sheet`, `Dialog`, `BottomBar`, `PlusButton`) render inside a `Phone` box with `transform: translateZ(0)` so `position: fixed` anchors to it; these four use `cardMode: single`, the rest `column` (phone-width rows overflow the 320px grid).
- Playwright for the render check: install the same version as the repo's `@playwright/test` into `.ds-sync` (`npm i playwright@<ver>`); the cached chromium (`%LOCALAPPDATA%/ms-playwright/chromium-1248`) matches 1.64.0.
- On Windows, Python reading `config.json` needs `encoding='utf8'` (default codepage is cp1258).

## Known render warns
- none (validate is clean)

## Re-sync risks
- `dtsPropsFor` duplicates the schema shapes by hand: stale after any schema change (silent; the agent would code against old props).
- `lib-entry.ts` is a manual export list: new components are invisible until added.
- Previews hard-code realistic sample data (period/goal objects); a prop rename in `EntryRow.tsx`/`GoalCard.tsx` breaks them (shows as a preview build failure → floor card).
- Grades were by eye only on the absolute rubric (no reference render).
