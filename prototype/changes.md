# Prototype changes

Every change made during the prototype phase, newest at the bottom. Design decisions before 2026-10-06 are in `wireframes/decisions.md` (D1–D62). Screen numbers are from `screens.md`.

| Date | Screen | Change |
|---|---|---|
| 2026-10-06 | Header (all pages with a back button) | The arrow and the page title form one back button, with a hit area that reaches past the text. The gap between the arrow and the title grew from 8px to 14px. Pressing it gives a light grey background. |
| 2026-10-06 | (process) | Forward-only working mode: the prototype is the source of truth and `wireframes/` is frozen. `screens.md` is the screen map. The unnumbered screens were given numbers: 4.2. Delete Period and 6.1. Edit Setting. |
| 2026-10-06 | 5.2. Goals | Stronger goal colors. The icon tiles in the goal list now use the goal's own color (chosen in 5.6) at about 33% strength instead of the pale tint. The Sinh hoạt card uses the full pale tint as its background, and its border and bar outline use the color at 50%. The other screens keep the pale tiles. |
| 2026-10-06 | 5.2. Goals | Still too pale, so the colors are stronger again. Goal icon tiles are filled with the goal's full color. The Sinh hoạt card background is its color at 25%, and the border and bar outline use the full color. |
| 2026-10-06 | 5.2. Goals | Reverted the previous row. The 33% icon tiles and the Sinh hoạt card from the first change are back. |
| 2026-10-06 | 5.3. Statistics | In the Mục tiêu chart, the ring segments and legend dots now use each goal's full color instead of the pale tint. |
| 2026-10-06 | 4.0. Periods | The period cards were cramped. There is now a 5px gap between the name, the dates and the totals line, and the card padding is 12px (was 9px) top and bottom, 14px on the sides. Only 4.0 changes (class `mcard period`); the cards on 3.0 and 7.0 are unchanged. |
| 2026-10-06 | 5.3. Statistics | Swiping between charts no longer shrinks the bottom bar or shows a scrollbar. The slide-in animation started 28px outside the column, so for a moment the page was wider than the screen and the browser zoomed out. The app column now clips horizontal overflow (`.app { overflow-x: clip }`). This also covers the 5.0 tab and page slide-ins, which use the same animation. |
| 2026-10-06 | All screens | Data is no longer saved. It lives in memory only, so a page refresh resets the app to 1.0 Welcome. The zustand `persist` wrapper is removed, and on load the old saved copy (localStorage key `so-chi-tieu`) is deleted. |
| 2026-10-06 | All screens | Every page load now starts with the sample data (`demoData()` in `store/seed.ts`), so testers can tour the prototype right away. A refresh throws away any edits and brings the sample back. `?seed=empty` starts with no data and opens 1.0 Welcome; `?seed=demo` still works but is now the default. |
