# prototype/: clickable draft (local)

A **lightweight, live, clickable draft** of the product that runs on the user's machine. Its only purpose is to **test the product experience**: tap through the real flows, enter data, feel the interactions, and give feedback before the real implementation.

It is **not** the product:
- Speed of iteration beats code quality: shortcuts are fine, and there are no tests beyond what helps iteration.
- No deployment, no hardening, no migrations.
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
