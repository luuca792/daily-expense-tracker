# deploy/: running Sổ chi tiêu on the server

| File | What |
|---|---|
| `Dockerfile` | Node builds `app/` (unit tests must pass), nginx serves `dist/`. Build context: `implementation/`. |
| `nginx.conf` | nginx inside the container: SPA fallback, CSP (`connect-src 'self'`), `no-cache` for `index.html`, `sw.js`, `registerSW.js`, `workbox-*.js` and the manifest (`application/manifest+json`), one-year cache for hashed `/assets/`. |
| `docker-compose.yml` | Builds and runs the container on `HOST_PORT` (default 8081). |
| `host-nginx.example.conf` | Server block for the host nginx that holds the certificates (HTTPS is required for the service worker). Replace `SUBDOMAIN`. |
| `build_and_push.py` | Double-click: `docker-compose build`, then `push` to Docker Hub (`luuca792/so-chi-tieu`). |
| `huong-dan.md` | Vietnamese install guide for friends. Replace `SUBDOMAIN` before sharing. |

## First deploy
1. **Choose the final subdomain and never change it** (plan §6): each phone's data belongs to that exact address.
2. DNS record → the server; certificate for the subdomain (certbot, as for the prototype's IP certificate).
3. On the server: pull or build the image, `docker-compose up -d` (from this folder, or with the pushed image).
4. Add the server block from `host-nginx.example.conf` to the host nginx, `nginx -t`, reload.
5. Open `https://SUBDOMAIN` on a phone and run the device checks in `../test-script.md`.

## Every later deploy
`build_and_push.py` → on the server `docker-compose pull && docker-compose up -d`. Installed apps pick up the new
version on their next launch (plan §4b). If the release changes `app/src/data/schema/`, it must include a migration
step, a new fixture and passing tests (plan §5).

## Checked locally (2026-10-08)
The image was built and run on port 18081; the e2e suite passed against it (`E2E_BASE_URL=http://localhost:18081/ npm run e2e`
in `app/`), including a check for console errors, so the CSP doesn't block anything.
