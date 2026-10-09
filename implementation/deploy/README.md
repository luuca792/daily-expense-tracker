# deploy/: running Sổ chi tiêu on the server

| File | What |
|---|---|
| `Dockerfile` | Node builds `app/` (unit tests must pass), nginx serves `dist/`. Build context: `implementation/`. |
| `nginx.conf` | nginx inside the container: SPA fallback, CSP (`connect-src 'self'`), `no-cache` for `index.html`, `sw.js`, `registerSW.js`, `workbox-*.js` and the manifest (`application/manifest+json`), one-year cache for hashed `/assets/`. |
| `docker-compose.yml` | Builds and runs the container on `HOST_PORT` (default 8081). Image `luuca792/expense-tracker:${APP_VERSION}` (default `1.0.3`). |
| `build_and_push.py` | Double-click: reads the version from `app/package.json`, `docker-compose build`, then `push` to Docker Hub (`luuca792/expense-tracker:<version>`). |
| `package_and_deploy.py` | Double-click or `npm run package-and-deploy` in `app/`: checks the repo is on main, tags the last commit with the version, pushes main and the tag, runs `build_and_push.py`, then `bump_version.py`. A `-SNAPSHOT` version only builds and pushes the image. |
| `bump_version.py` | Double-click or `npm run bump-version` in `app/`: bumps the patch version everywhere (`BUMP_FILES`, `package.json`, a new empty `CHANGELOG.md` block dated today), commits "Increase version to x.y.z" and pushes main. The last step of `package_and_deploy.py`; run it by hand when a release stopped before it (e.g. the Docker Hub push failed). By hand it only runs on main and only when the current version already has its git tag. |

## First deploy
1. **Choose the final subdomain and never change it** (plan §6): each phone's data belongs to that exact address.
2. DNS record → the server; certificate for the subdomain (certbot, as for the prototype's IP certificate).
3. On the server: pull or build the image, `docker-compose up -d` (from this folder, or with the pushed image).
4. In the host nginx (the one holding the certificates; HTTPS is required for the service worker), add a server block for the subdomain that proxies to the container on `HOST_PORT`, `nginx -t`, reload.
5. Open `https://SUBDOMAIN` on a phone and run the device checks in `../test-script.md`.

## Every later deploy
The version in `app/package.json` is already the next one (the git tag, the image tag and the version shown at the bottom of
6.0); check its block in `../CHANGELOG.md`, commit, run `package_and_deploy.py` (or `npm run package-and-deploy` in `app/`)
→ on the server `APP_VERSION=<version> docker-compose pull && APP_VERSION=<version> docker-compose up -d`. The script ends by
bumping to the next patch version, so later work is logged under it; for a minor or major release, change the version (and the top
`CHANGELOG.md` block) by hand before running it. For a test build, use a `-SNAPSHOT` version: only the image is built and pushed. Installed apps pick up the new
version on their next launch (plan §4b). If the release changes `app/src/data/schema/`, it must include a migration
step, a new fixture and passing tests (plan §5).

## Checked locally (2026-10-08)
The image was built and run on port 18081; the e2e suite passed against it (`E2E_BASE_URL=http://localhost:18081/ npm run e2e`
in `app/`), including a check for console errors, so the CSP doesn't block anything.
