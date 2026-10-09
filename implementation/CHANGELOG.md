# Changelog

All notable changes to Sổ chi tiêu (`implementation/app`) are recorded here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/). The version is the one in `app/package.json`: the git tag, the
Docker image tag, and the version shown at the bottom of 6.0 Settings.

## [1.0.2] - 2026-10-10
### Added
- `app/.design-sync/`: sync the shared UI components, styles and font to a Claude Design design-system project (`/design-sync`), with a preview per component and notes for the design agent.

### Fixed
- Fix a white screen when a screen crashes; show an error screen with Xuất dữ liệu (the data in memory) and Thử lại instead.
- Fix changes silently not being saved when the phone's storage stops answering (e.g. after the app was in the background): each save now has a time limit, reconnects and retries, shows "Chưa lưu được dữ liệu" if it still fails, and saves again when the app comes back to the foreground.
- Fix a white screen on launch when storage doesn't answer; show the "Không mở được dữ liệu" screen instead.
- Close the storage connection when switching to another app and open a fresh one on return, so a connection broken while the phone had the app in the background is never used; failed saves are retried on leaving too, and a save now gives up after 2 s instead of 5 s.

## [1.0.1] - 2026-10-09
### Added
- `deploy/package_and_deploy.py` (`npm run package-and-deploy` in `app/`): tag the repo with the version, push main and the tag, build and push the Docker image, then bump to the next patch version (all version references and a new changelog block), commit and push; a `-SNAPSHOT` version only builds and pushes the image.

### Fixed
- Fix the on-screen keyboard covering add/edit sheets (e.g. 5.4 Add Expense) on Android when the amount field gets the cursor as the sheet opens; the keyboard now pushes the sheet up.

## [1.0.0] - 2026-10-09
### Added
- First version: installable web app (PWA) that works offline, with all data kept on the device (IndexedDB).
- 1.0 Welcome and 1.1 Your Name for first launch; 2.0 Home and 2.1 Edit Name.
- 3.0 Overview: total wealth across the active period and savings.
- 4.0 Periods with 4.1 Create / Edit Period, 4.2 Delete Period and 4.3 Close Period.
- 5.0 Period Detail: 5.1 Logging (expenses and income), 5.2 Goals, 5.3 Statistics, with sheets 5.4–5.10 to add and edit expenses, untracked expenses, goals, income and savings transfers.
- 6.0 Settings with 6.1 Edit Setting, JSON data export, and the app version at the bottom.
- 7.0 Savings with 7.1 Base Savings.
- Versioned data format with migrations, and autosave.
- Docker image (`luuca792/expense-tracker:<version>`) with nginx, docker-compose and `deploy/build_and_push.py`.
