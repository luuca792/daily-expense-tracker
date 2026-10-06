# Implementation plan (outline, filled in after the prototype)

Topics this plan must settle, with current assumptions. Nothing here is final until the prototype is approved.

## 1. Constraints (fixed)
- **Installable web app (PWA), D55:** a static site with **no backend** and no accounts that users can install from the browser and use offline. Data never leaves the device.
- Vietnamese UI, mobile-first, also works on desktop.
- **Local only (D56):** data lives on one device and is saved automatically. No backup, export or import for now; losing the device loses the data, and that is accepted. Export/import for moving devices is a later feature.

## 2. Architecture (assumption)
- Work **screen by screen**: each screen is built and tested against its spec in `wireframes/screens/specs/`.
- React + Vite + TypeScript (D1) + **vite-plugin-pwa** (D55). Routes and components are named after screen numbers (e.g. `5.4 AddExpense`).
- A pure domain layer (calculations from `wireframes/logic/logic-rules.md` R1–R7), separate from the UI. All logic runs on the device so it can be unit-tested.
- Decide whether to reuse prototype code or rewrite: depends on its quality.

## 3. Data model (to finalize)
- `Period { id, name, startDate, endDate?, createdAt, goals[], livingMax, expenses[], incomes[] }`, all period-scoped (D16, D23).
- `Expense { id, date, description?, amount, categoryId|null }` (null = untracked).
- `Income { id, date, description, amount }`. The carry-over entry is an ordinary Income (R1.8).
- `Settings { startingLivingMax, startingGoals[], untrackedCountsAsLiving, warnThresholds, unit }`.
- Stored shape: `{ schemaVersion, settings, periods[], savings }`, with versioned migrations. The same shape can later become the export file.

## 4. Persistence
- Autosave to **IndexedDB via Dexie** (D55). Call `navigator.storage.persist()` on first start so the browser doesn't evict the data.
- Every app update must still read data written by older versions: on launch, migrate stored data up to the current `schemaVersion`.
- Later feature (not now, D56): export / import with validation (zod), a preview before replacing data, and Vietnamese error messages.

## 4b. Install, offline and updates (PWA, D55)
- **vite-plugin-pwa** generates `manifest.webmanifest` (name "Sổ chi tiêu", icons, theme color, `display: standalone`) and `sw.js` (precaches every built file, keyed by content hash).
- Install comes from the browser itself: "Install app" on Android Chrome, Share → "Add to Home Screen" on iPhone Safari. The install link is the app's normal address; there's no separate download.
- Offline: the app opens from the precache with no network. Nothing in the app makes network requests.
- Updates: deploy a new `dist/`; the browser re-checks `sw.js` when the app opens online and downloads the changed files. **The new version takes over on the next launch** (no prompt, so a half-filled entry is never reloaded away). Optional later: a periodic `registration.update()` for apps left open for days.

## 5. Quality
- Unit tests for every rule in `logic-rules.md`, e.g. reserve, carry-over and grouping/ordering.
- A migration test: data saved by version N opens correctly in version N+1.
- Manual test script per screen number.
- Install and offline check on a real Android phone and an iPhone; an update check (deploy v2, reopen, confirm v2 runs and the data is intact).

## 6. Deployment
- Target: the user's own server (nginx, DNS, their own certificate), on its own subdomain, like their other frontends.
- `npm run build` produces static files in `dist/` served by nginx: SPA fallback to `index.html`, CSP `connect-src 'self'` (no data can leave), **HTTPS (required for the service worker)**.
- `sw.js`, `index.html` and the manifest are served with `Cache-Control: no-cache` so update checks always see the latest; hashed assets can be cached long-term.
- Optional Docker image (nginx:alpine).
- A short Vietnamese guide for friends: how to install (Android / iPhone), and that the data lives only on their phone. Accepted risks (D56): clearing Chrome's site data (Android) or removing the home-screen icon (iPhone) deletes the data, so the guide says not to; on iPhone, use the icon, not a Safari tab.
- **Keep the subdomain stable:** data belongs to the address, so moving the app to a new address starts everyone empty.

## 7. Open items carried from design
- See `wireframes/open-questions.md` sections A and B (Overview, debts, savings…).
- Parked (D55): optional end-to-end encrypted sync, one encrypted blob per user on the same server (option E). This would be the first backend piece; nothing above needs replacing for it.
