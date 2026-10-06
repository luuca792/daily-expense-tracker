# 07 · Logic rules (behavior that isn't visible in the UI)

This file is the single place for **rules the app follows behind the scenes**: sorting, grouping, defaults and calculations. Screens and wireframes show *what* the user sees; this file says *why it appears that way*. When a rule changes, update it here, log a decision in `wireframes/decisions.md`, and reference the rule ID.

---

## R1 · Spending periods (kỳ chi tiêu)

### R1.1 · Which year a period is listed under
- A period is listed under the **year of its start date**, and only under that year.
- A period that crosses into the next year (e.g. 20/12/2025 → 19/01/2026) appears **only under 2025**.
- The end date never affects grouping.

### R1.2 · Order of the year groups
- Years are shown **newest first** (2026, then 2025, …).
- Only years that contain at least one period are shown.
- The current year is expanded by default and other years are collapsed. If the current year has no periods, the newest year that has periods is expanded.

### R1.3 · Order of periods inside a year
1. **Start date, newest first.**
2. If two periods share a start date: the one **created more recently** comes first.

The end date and the name do **not** affect order.

### R1.4 · End date display (no open/closed status, D31)
- There is **no open/closed status** and no badge. Every period can be edited at any time, whatever its dates.
- No end date: the card shows "start → chưa kết thúc".
- With an end date (past or future): the card shows "start → end".
- The end date can be set, changed or cleared at any time (⋯ → 4.1).

### R1.5 · No constraints between periods
- Periods may overlap, leave gaps, or share the same name. The app never adjusts one period because of another.
- The end date must be on or after the start date.
- Editing a period's dates so that existing entries would fall outside them is **blocked** with an error next to the date field (R3.5, D62). The user moves or deletes those entries first.

### R1.6 · Creating a period: "Chọn kỳ trước đó" (D39)
- 4.1 has a selector **"Chọn kỳ trước đó"** (only when creating, not when editing).
- **Default:** the nearest period, i.e. the existing period whose start date is closest to the new period's start date. On a tie, the earlier one wins; if still tied, the most recently created (D61).
- The last option is **"Không chọn"**: nothing is copied and there is no carry-over (D61).
- The selected period is the source for:
  1. **Goals** (category, icon, color, target) and the **Sinh hoạt maximum**, which are copied. The "done" mark is never copied (R2.5).
  2. **Carry-over**: see R1.8.
- Expenses and other incomes are never copied.
- **Sinh hoạt maximum** (D62): copied from the selected previous period. Only when there is none (no periods yet, or "Không chọn") does the new period take "Mức sinh hoạt tối đa mong đợi" from 6.0. Settings. Changing the setting never changes existing periods.
- With no periods at all, the selector is hidden. The new period gets only Sinh hoạt (with the maximum from 6.0. Settings), no other goals and no carry-over (D48).
- Copying happens once, at creation. Editing a period later doesn't re-copy anything.

### R1.7 · Name
- Free text, entered by the user. No suggestions are offered (D26).
- The name doesn't have to be unique (see R1.5).

### R1.8 · Carry-over from the previous period (D39)
- On creation, the app adds **one income entry** to the new period:
  - description: **"Còn lại từ tháng trước"** (the same text whatever the period names are),
  - date: the new period's **start date**,
  - amount: the selected previous period's **Số dư (Thu − Chi)**, calculated at that moment (D61).
- After creation the entry is an **ordinary income entry**. It has **no link** to the previous period: later changes to that period don't update it, and the user can edit its amount, date or text, or delete it, with no constraints.
- If the leftover is 0, no entry is created. A **negative** leftover is carried over as a negative income entry, e.g. "Còn lại từ tháng trước" −1.200 (D60).

---

## R2 · Goals & categories (within one period)

- **R2.1 · Period scope.** Goals and their targets belong to one period. Editing or deleting a goal never changes another period (D16, D23).
- **R2.2 · Sinh hoạt is the default goal** (D47). Every period has it, and it can't be deleted or renamed. Its maximum and icon/color are edited on 5.6 (Sinh hoạt mode, no delete action). Untracked spending always counts toward it (no setting). It is shown as its own tracker at the top of 5.2. Goals (not as a goal card) and in the charts on 5.3. Statistics.
- **R2.3 · Deleting a goal.** All entries in that period with that category move to **Sinh hoạt**. An undo toast is offered.
- **R2.4 · Goal order** in the Mục tiêu tab: the order the user set (drag to reorder, later). New goals are added at the end.
- **R2.5 · Done goals** (D59). A goal can be marked **done** on 5.6 ("✓ Hoàn thành mục tiêu") at any time, and reopened ("↺ Mở lại mục tiêu"). A done goal reserves nothing: it is left out of Dự trữ (R4), so its unspent amount becomes free money (Còn lại). It keeps its place and its numbers on 5.2, is drawn dimmed with a ✓, still counts in the 5.2 summary line and the 5.3 charts, and can still be chosen on 5.4. Sinh hoạt can't be marked done (it is never reserved). A new period copies goals as not done (R1.6).

## R3 · Entries

- **R3.1 · Untracked spending** is an expense with **no category**. It needs no description (D20).
- **R3.2 · Add-form defaults:**
  - The category is **Sinh hoạt** (D17).
  - The date is **today** if today falls within the period (or the period is open and today ≥ start). Otherwise it is the date of the **last entry** added in that period, or the period's start date if there are no entries.
- **R3.3 · Chi tiêu list order:** grouped by day, newest day first. Within a day, the most recently added entry comes first.
- **R3.4 · Large-expense highlight** (D45): on 5.1, an expense whose amount is **≥ the 6.0 threshold** "Tô màu khoản chi lớn từ" (one number, sample 200) shows its amount in **red** (`#E11D48`). It applies to every expense, categorized or untracked; incomes are never highlighted. The row background stays the category color.
- **R3.5 · Entry dates stay inside the period** (D58). Every entry (expense, income, savings transfer) has a date on or after the period's start date and, if the period has an end date, on or before it. The date picker offers only those dates. The defaults in R3.2 always fall inside.

## R5 · The ＋ button on 5.0 Period Detail (context-sensitive, D43)

| Bottom tab | ＋ opens |
|---|---|
| 5.1. Logging, toggle **Chi tiêu** | 5.4. Add Expense (Sinh hoạt preselected, D17) |
| 5.1. Logging, toggle **Thu nhập** | 5.9. Add Income (not drawn yet). Savings transfers have their own yellow "Gửi tiết kiệm" button under the toggle → 5.10 (D51) |
| 5.2. Goals | 5.6. Edit Goal in **create mode** ("Thêm mục tiêu": name, icon/color, target; no delete button) |
| 5.3. Statistics | No ＋ button |

The button looks the same wherever it appears; only its action changes. The bottom bar always shows the three tabs; the Chi tiêu / Thu nhập toggle is remembered while you stay in the period.

## R4 · Calculations (per period)

| Value | Rule |
|---|---|
| **Thu** | Sum of the period's incomes **+ withdrawals from savings − deposits to savings** in that period (R6.3) |
| **Chi** | Sum of all the period's expenses (categorized + untracked) |
| **Số dư** (balance) | Thu − Chi: the money actually left in the account. Shown small on the summary card |
| **Dự trữ** (reserve) | The money still needed to reach all goals: **max(Σ goal targets − Σ spent on those goals, 0)** over the period's goals on 5.2 that are **not done** (D36, D59). Overspending on one goal reduces the reserve for the others; the reserve never goes below 0. Marking an overspent goal done therefore raises the reserve of the others. **Sinh hoạt is not included** (D61). Example: targets 6.800, spent 6.400 → reserve 400. **Not displayed** on screen; it is only used to compute Còn lại (D37) |
| **Còn lại** (free money) | Số dư − Dự trữ = Thu − Chi − Dự trữ (e.g. 10.500 − 400 = 10.100). The **headline number** on the summary card (large, emphasized) (D35) |
| **Sinh hoạt spent** | Sinh hoạt expenses + untracked expenses (always; the Cài đặt toggle was removed, D47) |
| **Sinh hoạt remaining** | Sinh hoạt maximum − Sinh hoạt spent (shown on 5.3 only) |
| **Goal progress** | Sum of expenses in that category ÷ target. The bar is capped at 100% visually. No status text is shown (D34) |
| **Goal bar color** | Three colors only (D38): **yellow** while spent < target · **green** when spent = target · **red** when spent > target |
| **Over target** | When spent > target (goal) or spent > maximum (Sinh hoạt card), the **spent amount** is shown in rose on a light rose pill and the bar turns rose. Spent = target counts as *not* over |

---

## R6 · Savings fund (Tiết kiệm, D50)

- **R6.1 · One fund, moved only inside a period.** There is one app-wide savings fund. Money goes in or out only through a **transfer** recorded in a period (5.10): **Gửi vào** (deposit: income of this period → fund) or **Rút ra** (withdrawal: fund → income of this period). Each transfer has a direction, an amount > 0, a date and the period it belongs to. 7.0 has no ＋.
- **R6.2 · Fund balance and history (7.0).** The fund starts at **0**. Balance = **base savings (R6.7) + Σ deposits − Σ withdrawals** over all periods. "Gửi" and "Rút" on the fund card are the two period sums only (the base is not in "Gửi"). The transfer list is sorted by **date, newest first**; same date → most recently added first. The base savings row is always **last**. Each row shows the period's current name (renaming a period renames it here).
- **R6.3 · Effect on the period.** A transfer is listed with the period's incomes on 5.1 (toggle Thu nhập) and counted in **Thu** as a signed amount: deposit **−**, withdrawal **+**. So it flows into Số dư, Còn lại and the carry-over (R1.8). It is **not** an expense: Chi, goals, Sinh hoạt and the 5.3 charts ignore it. The row text is fixed: "Gửi tiết kiệm" / "Rút tiết kiệm".
- **R6.4 · The fund never goes below 0.** On 5.10, "Quỹ tiết kiệm" is the balance without the entry being edited. Saving a withdrawal larger than that, or lowering/deleting a deposit when the result would be negative, is blocked with the error "Vượt quá quỹ tiết kiệm". A deposit is not limited by the period's Số dư: it may make the period's Số dư and Còn lại negative (D61). Only the current balance is checked, not the balance on each past date.
- **R6.5 · From 7.0 to the period.** Tapping a transfer on 7.0 opens 5.0 of its period on the 5.1 tab with the toggle on Thu nhập.
- **R6.7 · Base savings (Số dư ban đầu, D52).** At most **one** base entry: an amount > 0 with **no period and no date**, entered on 7.1 from 7.0. It adds to the fund but not to any period's Thu. It can be edited or **deleted at any time**, even if the fund then drops below 0: R6.4 doesn't block it. While the fund is below 0, withdrawals on 5.10 are blocked (any amount exceeds the fund) and 7.0 shows the balance with "−".
- **R6.6 · Deleting a period** deletes its transfers too, which changes the fund; the delete confirmation must refuse it if the fund would go below 0 (D62).

---

## R7 · Overview: active period and total wealth (D54)

- **R7.1 · Active period (kỳ đang theo dõi).** Exactly one period is active whenever at least one period exists. **For now it is always the first period in R1.3 order**: the latest start date, ties broken by the most recently created. It changes automatically when a newer period is created or a start date is edited. There is no manual choice yet (D61). It is the outlined card on 4.0 (D61).
- **R7.2 · Total wealth (Tổng tài sản)** = fund balance (R6.2, including the base savings) + the active period's **Số dư** (Thu − Chi, R4). The goal reserve is **not** subtracted (so it is not Còn lại). Older periods are not added: their leftover already reached the active period through the carry-over (R1.8), and savings transfers already moved money into the fund (R6.3). Shares = each part ÷ total, rounded to whole percent so they add up to 100; shares and the bar are shown only when both parts are > 0. Sample: 6.000 + 10.255 = **16.255** (37% · 63%).

---

### R4.1 · Chart 2 "Mục tiêu" on 5.3 (D46)
- One ring segment per goal of the period, **Sinh hoạt first**, then the goals in their 5.2 order (R2.4). The legend uses the same order.
- Segment size = the goal's spent ÷ the period's **Chi** (total spent). Sinh hoạt's spent includes untracked spending, so the segments always add up to 100%.
- Goals with nothing spent are left out of the ring and the legend.
- Segment color = the goal's own color (its icon tile on 5.2, chosen on 5.6).

---

*IDs (R1.1, R3.2…) are stable. Reference them in decisions, questions and code comments.*
