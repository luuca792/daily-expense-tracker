# wireframes/: design phase

Everything about **what** the product is and how it should behave, worked out on static wireframes before any code.

| Path | Content |
|---|---|
| `plan.md` | The design-phase plan: guiding rules, current direction, status checklist (sections from "Phase 0" down are round-1 background) |
| `decisions.md` | Decision log D1… (newest wins) |
| `open-questions.md` | Unanswered questions, each with a proposed default. **Answer section A before the prototype starts** |
| `requirements/use-cases.md` | UC1–UC22: needs derived from the Excel workbook |
| `ux/ux-principles.md` | UX principles (incl. #10: no explanatory text on screen) |
| `ux/information-architecture.md` | Navigation tree (top section only) |
| `ux/visual-style.md` | Colors, typography, components |
| `ux/user-flows-round1.md` | Round-1 flows (*background only*) |
| `screens/wireframes.html` | **The wireframes**: open in a browser. Section 0 = current design; sections 1–6 = round-1 parking lot |
| `screens/screen-registry.md` | Index of all screens (number, name, type, status, links) |
| `screens/specs/` | **One spec per screen**: the source of truth for building it (layout, exact UI text, interactions, states, linked rules) |
| `screens/sample-data.md` | Fictional sample data used in the wireframes and as the prototype seed |
| `logic/logic-rules.md` | Hidden behavior rules R1–R5 (periods, goals, entries, calculations, ＋ button) |
| `feedback/round-1-wireframes.md` | History of feedback round 1 |

**Preview:** from `wireframes/screens/`, run `python -m http.server 8765 --bind 127.0.0.1`, then open `http://127.0.0.1:8765/wireframes.html#s5-1` (or just double-click the HTML file).

**Keeping things in sync:** every wireframe change also updates the affected `screens/specs/*.md` files, `logic/logic-rules.md` (if hidden behavior changed) and `decisions.md`, in the same step.
