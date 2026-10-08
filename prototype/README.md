# prototype/: clickable draft (local)

A **lightweight, live, clickable draft** of the product that runs on the user's machine. Its only purpose is to **test the product experience**: tap through the real flows, enter data, feel the interactions, and give feedback before the real implementation.

It is **not** the product:
- Speed of iteration beats code quality: shortcuts are fine, and there are no tests beyond what helps iteration.
- Deployed only as a test build for testers (Docker, see "Deploy" below); no hardening, no migrations.
- The code may be thrown away. What carries over to `implementation/` is the **decisions and learnings**, recorded in `changes.md`.

## Working mode: forward only (from 2026-10-06)
We are in the **prototype phase**. The design phase is closed.
- **Change the prototype directly.** Don't go back and update `wireframes/` (wireframes.html, specs, registry, decisions, logic rules). It wastes effort. The wireframes stay as a frozen snapshot of the design at the end of that phase.
- **The prototype is now the source of truth.** Where it differs from the wireframes, the prototype wins.
- **Name screens by number** from `screens.md` (e.g. "5.2", "7.1"). New screens take the next free number and get a row there.
- **Log every change** in `changes.md` (one line: date, screen, what changed), so the decisions reach `implementation/`.
- New hidden logic (sorting, defaults, calculations) goes in a code comment on the spot and a line in `changes.md`, not in `wireframes/logic/logic-rules.md`. Existing code comments still cite the old rule IDs (R1–R7), which stay valid.

| Path | Content |
|---|---|
| `screens.md` | **Screen map**: number, name, how to open it, source file |
| `changes.md` | Change log for the prototype phase (replaces `wireframes/decisions.md`) |
| `plan.md` | Prototype plan: scope, stack, how to run (written during the design phase) |
| `feedback/` | One file per feedback round, if a round is written down |
| `app/` | The prototype source code |

**Status:** built (M0–M4, 2026-10-05). Now being refined from the user's feedback.

**Run:** `cd prototype/app && npm install && npm run dev -- --host`, then open `http://localhost:5173/` (or the LAN address on a phone). Every load starts with the sample data; nothing is saved, so a refresh resets it. `?seed=empty` starts with no data (1.0 Welcome). `npm test` runs the domain tests.

## Deploy (Docker test build)
Files: `Dockerfile` (Node builds `app/`, nginx serves `dist/`), `deploy/nginx.conf`, `docker-compose.yml`, `.env.example`. The image is `expense-tracker-prototype` (tag `latest`) and contains the prototype only.

- **Setup:** in `prototype/`, `cp .env.example .env` and set `HOST_PORT` (default 8080).
- **Run:** `docker compose up -d --build`. Use `docker compose stop` / `start` / `down`. After changing `HOST_PORT`, run `docker compose up -d`.
- **Plain Docker:** `docker build -t expense-tracker-prototype prototype`.
- **Publish a new version:** double-click `build_and_push.py` (runs `docker-compose build`, then `docker-compose push` to Docker Hub as `luuca792/expense-tracker-prototype:latest` only if the build passed). Needs Docker Desktop running and `docker login` once.
- **Server without the source:** `docker save expense-tracker-prototype | gzip > ept.tar.gz`, copy it over, then `docker load < ept.tar.gz` and run `docker compose up -d` next to `docker-compose.yml` + `.env`.
- HTTP only. For HTTPS, put it behind the server's reverse proxy. **HTTPS is required to install the app**; over plain `http://` the phone only makes a bookmark. Keep the address stable, because the installed app belongs to it.

### Install on a phone (PWA)
The app is installable and works offline. Each launch still starts with the sample data, and nothing is saved.
1. Deploy as above and open the **https** address on the phone.
2. **Android (Chrome):** menu ⋮ → "Cài đặt ứng dụng" / "Install app" (or tap the install banner) → Install.
3. **iPhone (Safari):** Share → "Thêm vào MH chính" / "Add to Home Screen" → keep "Mở dưới dạng ứng dụng web" / "Open as Web App" on → Add.
4. Open the app from its icon. It runs full screen, with no browser bar.
5. Offline check: turn on airplane mode, close the app fully, then reopen it from the icon.
6. Updates: after a new deploy, open the app once while online, then close it fully. The new version runs from the next launch.

Local check on a PC: `npm run build && npm run preview` in `app/`, then open `http://localhost:4173/` in Chrome. `localhost` counts as secure, so the install icon appears in the address bar. `npm run dev` doesn't register the service worker.
