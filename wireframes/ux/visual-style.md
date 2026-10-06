# 06 · Visual style (draft v2: more colorful)

> Note: the category list below uses round-1 names. The current built-in default category is **Sinh hoạt** (🍜, orange); other goals are user-created. Goal bars use only yellow/green/red (D38).

Section 0 of `wireframes.html` shows this style. The user asked for a more colorful, engaging UI (D10), so color is used to give each part of the app its own identity, not just for warnings.

## Typography
- **Be Vietnam Pro** (Google Fonts), which was designed for Vietnamese diacritics. Fallback: `system-ui`.
- Scale: 12 caption · 14 body · 16 input/label · 20 section title · 26–32 headline number.
- Headlines and amounts use weight 800. Money uses `font-variant-numeric: tabular-nums`.

## Color tokens (light)
| Token | Value | Use |
|---|---|---|
| `--bg` | `#F8FAFC` | page |
| `--surface` | `#FFFFFF` | cards, sheets |
| `--text` | `#0F172A` | primary text |
| `--muted` | `#64748B` | secondary text |
| `--border` | `#E2E8F0` | card and input borders |
| `--primary` | `#0D9488` → `#0F766E` (teal gradient) | primary buttons, the **Ghi chép** area, selected states |
| `--primary-soft` | `#E6F6F4` | selected category, amount box, info boxes |
| `--accent` | `#7C3AED` → `#5B21B6` (violet gradient) | the **Tổng quan** area |
| `--income` | `#16A34A` | income amounts, "+" values |
| `--expense` | `#E11D48` (rose) | spending totals, daily totals |
| `--warn` | `#D97706` on `#FFFBEB` | backup reminder, due soon |

- **Gradients** are used sparingly: the welcome header, the two hub cards, the month summary card and primary buttons. Everything else is white cards on a light slate background.
- **Shadows** are soft and tinted with the card color (e.g. `0 8px 18px #0D948833`).
- **Dark mode** comes later. The plan is to keep the same hues, use a `#0B1120` background and lighten the gradients slightly.

## Category colors
Each category has a pastel background tile and an icon. Emoji are used in the wireframes; the app may switch to Lucide icons drawn in the category color.

| Category | Tile / row background | Tag text | Icon (5.4 only) |
|---|---|---|---|
| Sinh hoạt (built-in) | `#FFEDD5` (orange) | `#C2410C` | 🍜 |
| Đi lại | `#DBEAFE` (blue) | `#1D4ED8` | 🛵 |
| Sức khỏe | `#FCE7F3` (pink) | `#BE185D` | 💊 |
| Gia đình | `#EDE9FE` (violet) | `#6D28D9` | 👨‍👩‍👧 |
| Nhà ở | `#DCFCE7` (green) | `#15803D` | 🏠 |
| Mua sắm | `#FEF3C7` (amber) | `#B45309` | 🛍️ |
| Giải trí | `#E0E7FF` (indigo) | `#4338CA` | 🎬 |
| Khác | `#F1F5F9` (slate) | `#475569` | ✨ |

Users can change a category's color and icon later, picking from a palette of 12.

## Money display
- Grouping follows `vi-VN`: `1.700`. Amounts are always in thousands of đồng (D48).
- **Large expense** on 5.1: the amount in rose `#E11D48` when ≥ the 6.0 threshold (R3.4).
- Income is shown as `+20.000` in green and spending totals as `−9.500` in rose. Individual expense rows show the amount with a "−" sign (`−60`) in dark text, so the list stays calm (D49).

## Components (used so far)
- **Hub card**: a gradient card with the icon tile, title and "›" circle on one row (no description)
- **Period card**: icon badge · name · start → end dates · income/spending · entry count
- **Summary card**: a teal gradient. On the left, "Còn lại" (after reserve) is the large headline, with a smaller line "Số dư …" below it. Thu / Chi are on the right
- **Day box** (5.1): every day's entries sit in one rounded, neutral light-grey box (`#F1F5F9`), with a header row showing only the day label (D40). Expense rows are category-colored; income rows are green (`#DCFCE7`, amount `#15803D`).
- **Entry row** (5.1, D42): one compact line with **no icon and no subtext**: description · category tag · amount. The **row background is the category's pastel color**, and the **tag** (small, bold, rounded, on a translucent white pill) shows the category name in a darker shade of that color. Untracked entries are white with a dashed border and "Không danh mục" in grey italics. Rows are separated by 4px gaps, not lines. Icons appear only where a category is picked (5.4).
- **Goal progress bar** (5.2, 5.6): three colors only, never the category color. Yellow `#EAB308` = in progress, green `#22C55E` = met, red `#E11D48` = overspent
- **Over-target amount**: the spent amount in rose (`#E11D48`) on a light rose pill (`#FFE4E6`), with the bar also rose. Used on goal cards (5.2) and the Sinh hoạt card
- **Segmented control**: a slate track with a white active pill that slides to the chosen side
- **Bottom sheet**: a form with an amount box, category grid, inputs, and two buttons (secondary + primary)
- **Reminder bar**: amber, with an icon, text and action

## Motion (D63)
Short and quiet: 0.2–0.35 s, ease-out on the way in, faster ease-in on the way out. All motion is switched off under the system's "reduce motion" setting.
| What | Motion |
|---|---|
| Screen change | Header and content slide 28 px + fade: from the right going deeper (2.0 → 4.0 → 5.0 → 6.0), from the left going back. Bottom bar and ＋ stay still |
| 5.0 tabs, 5.3 charts | Content slides toward the tapped side |
| Bottom sheet | Slides up over a fading dim; slides down on every close (✕, tap outside, Lưu, Xóa) |
| Dialog · menu · toast | Dialog pops in (slight overshoot); ⋯ menu grows from its corner; toast rises from below |
| ＋ button | Spins in when its tab has one, spins out when it hasn't (5.3) |
| Lists | Cards and day boxes fade up one after another (30 ms apart) |
| New entry | The just-saved row flashes once with a teal outline |
| Money | Summary-card amounts count to their new value (0.45 s) |
| Bars, rings | Grow from zero when shown; glide to new values |
| Press | Buttons and cards shrink to 97 % while pressed; a chosen category, color or icon pops |

