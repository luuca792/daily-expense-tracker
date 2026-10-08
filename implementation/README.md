# implementation/: the real product

Planning and building the **actual product** that will be deployed on the user's server for friends to use. This starts after the prototype has been approved.

| Path | Content |
|---|---|
| `plan.md` | Implementation plan: architecture and code layout, data model (schema v1), persistence and migrations, JSON export, quality, deployment |
| `app/` | Production source code (created when implementation starts) |
| `deploy/` | nginx config, optional Dockerfile, deployment notes (created later) |

**Inputs:** the per-screen specs in `wireframes/screens/specs/`, `wireframes/logic/logic-rules.md`, `wireframes/decisions.md`, and the running prototype (`prototype/screens.md`, `prototype/changes.md`). The app is new code; `prototype/` is reference only.

**Status:** ready to start (2026-10-08). The prototype is accepted as the base; follow `plan.md` §7 build order.
