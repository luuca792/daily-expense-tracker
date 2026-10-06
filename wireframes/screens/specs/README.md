# Screen specs

**One file per screen or sub-screen.** Each spec is the **source of truth** for building that screen in `prototype/` and `implementation/`, so later phases can work on a few screens at a time.

## How the docs fit together (no duplication)
| What | Where |
|---|---|
| How a screen looks and behaves | **`specs/<number>-<name>.md`** (this folder) |
| The picture | `../wireframes.html#s<n>-<m>` (the captions there are one line plus a link back here) |
| Rules shared by several screens (sorting, defaults, calculations) | `../../logic/logic-rules.md`, referenced by ID (R1.6…), never copied |
| Colors, typography, shared components | `../../ux/visual-style.md`, referenced by component name |
| Fictional data used in the wireframes / prototype seed | `../sample-data.md` |
| Why something is the way it is | `../../decisions.md` (D-numbers) |
| Undecided details (with defaults) | `../../open-questions.md` (Q-numbers) |
| List of all screens | `../screen-registry.md` |

## Keeping them up to date
Every wireframe change updates, **in the same step**:
1. the affected spec files (and their "Last updated" line),
2. `logic-rules.md` if hidden behavior changed,
3. `decisions.md` with one row.

## Template
```markdown
# <n>.<m>. <Name> · <Vietnamese title>
| | |
|---|---|
| Type | Page / Tab / Sheet / Dialog |
| Status | Designed / Not drawn |
| Wireframe | `wireframes.html#s<n>-<m>` |
| Last updated | YYYY-MM-DD (D-numbers) |

## Purpose
## Entry & exits
## Layout (top → bottom, exact UI text in Vietnamese)
## Interactions
## States & variants
## Rules (links to logic-rules.md)
## Related decisions · Open questions
```

UI text in quotes is the exact Vietnamese copy. Amounts are in thousands of đồng (fixed, D48), with `vi-VN` grouping (`10.500`). There is **no explanatory text on any screen** (UX principle 10, D25).
