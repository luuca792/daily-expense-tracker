# Feedback round 1 · Use cases & wireframes

> **Note (2026-10-02):** all unanswered questions from this file are now collected in **`wireframes/open-questions.md`**. Answer them there before the prototype is built. This file is kept as a history of the feedback rounds.

**What to review**
1. `wireframes/requirements/use-cases.md`: fill in the Decision column (Keep / Change / Drop).
2. `wireframes/screens/wireframes.html`: open it in a browser and look at each frame.
3. Optional reading: `wireframes/ux/ux-principles.md`, `information-architecture.md`, `user-flows-round1.md`.

Write your answers directly in this file. Short answers are fine.

---

## Round 1b · main flow (wireframes section 0)

**Your feedback so far (2026-10-02):** the round-1 UI is too complicated. Build toward the ideal version slowly. After the welcome page comes a choice between **Tổng quan** and **Ghi chép**. Ghi chép shows a list of months grouped by year, and choosing a month (e.g. 09/2026) starts logging for it. → Recorded as D7–D9 and drawn in frames 0.1–0.5.

**Questions on the new frames**

**B1 · Hub extras.** Is the backup button on the hub (0.2) fine? Should Cài đặt open from the top-right icon?
> Answer:

**B2 · Future months.** Should the month list show months after the current one, or stop at the current month?
> Answer:

**B3 · Month page.** Is "Thu · Chi · Còn lại" plus a Khoản chi / Thu nhập tab switch the right amount of information to start with?
> Answer:

**B4 · Add form.** Should the amount field accept math like `100+218` from the start?
> Answer:

**B5 · Units (was Q1).** Type amounts in thousands like the Excel file (`60` = 60.000 ₫), or in full đồng?
> Answer:

---

## Round 1c · month detail & settings (wireframes 0.4–0.11)

**Your request (2026-10-02):** each month should have a spending list, monthly goals with progress (edit, delete or adjust; a goal is a category, and deleting it moves its entries to the default Sinh hoạt), a place for untracked spending (entries with no category), and a Sinh hoạt tracker with a progress bar, plus a dedicated settings page. → Recorded as D11–D15.

**C1 · Layout.** The summary and Sinh hoạt tracker sit on top, with four tabs below (Chi tiêu · Mục tiêu · Không danh mục · Thu nhập). Is that easy enough to reach, or would you prefer one long scrolling page with sections?
> Answer: Tabs. (D19)

**C2 · Deleting a goal.** Should deleting a goal affect only *this month* (the proposal), or also remove it from later months?
> Answer: Only this month; every piece of monthly data is month-scoped. (D16)

**C3 · Default category in the add form.** When the form opens, should "Không danh mục" be pre-selected (fastest for untracked spending), or Sinh hoạt?
> Answer: Sinh hoạt. (D17)

**C4 · Untracked counts as Sinh hoạt.** In your Excel file, untracked spending is added to Living expense. Keep that as the default (there's a toggle in Cài đặt)?
> Answer: Yes. (D19)

**C5 · New month goals.** Copy them from the previous month, or from a fixed default list in Cài đặt?
> Answer: Dynamically copy the previous month's goals. (D18)

**C6 · More settings.** What else should be configurable on the Cài đặt page?
> Answer: Nothing more for now. (D19)

---

## Round 1d · untracked spending

**Your feedback (2026-10-02):** untracked spending shouldn't need a reason; a tab listing it isn't needed; showing the total (and the tracked vs untracked chart) is enough. → D20, D21; frame 0.8 is now the quick "Không DM" add form.

---

## Round 1 · original open questions (answer only if relevant; many are for later features)

**Q1 · Units.** In Excel you type amounts in thousands (`1700` = 1.700.000 ₫). Which do you prefer?
- (a) Type in thousands, shown as `1.700` *(like now)*
- (b) Type in đồng with a `000` key, shown as `1.700.000 ₫` / `1,7 tr`
- (c) A setting, so each user chooses

> Answer:

**Q2 · Navigation.** Bottom bar: Trang chủ · Giao dịch · ＋ · Kế hoạch · Sổ nợ. Savings, Reports and Settings sit behind the avatar menu. Is that right, or should something else be in the bar (e.g. Báo cáo instead of Sổ nợ)?
> Answer:

**Q3 · Home.** Order of cards: Free money → Due soon → Plan progress → Debt/Savings summary → Alerts. Anything to add, remove or reorder?
> Answer:

**Q4 · Reserve logic.** Should we keep the Excel idea "unspent plan money is reserved until marked Xong"? Free money is then *after* reserves. Or should free money simply be income − spent, with the plan shown only as progress?
> Answer:

**Q5 · Unlogged spending.** Do you like **Đối chiếu số dư** (enter what you actually have, and the app records the difference)? Or do you prefer typing an "untracked" amount directly, like now? Or both?
> Answer:

**Q6 · Recurring payments.** Should they be recorded **automatically** on the charge day, or only when you tap **Đã trả**? (Default proposal: tap, with auto as an option per item.)
> Answer:

**Q7 · Savings.** One savings balance with optional goals, or separate pots (e.g. emergency fund, travel) that each have their own balance?
> Answer:

**Q8 · Pay-later.** Is "Trả sau" (credit card / fund with an outstanding balance, which only counts as spent when you pay it) the right model for how you use the credit card and fund?
> Answer:

**Q9 · Split bill.** Is splitting inside the entry sheet useful, or is it overkill (you'd rather just enter your share and add a "Nợ tôi" manually)?
> Answer:

**Q10 · Months.** Should a month always be the calendar month, or do you want a custom start day (e.g. from payday on the 5th)?
> Answer:

---

## Per-frame feedback

| # | Frame | Keep / Change / Drop | Comment |
|---|---|---|---|
| 1.1 | Chào mừng | | |
| 1.2 | Trang chủ | | |
| 1.3 | ＋ Entry (basic, keypad) | | |
| 1.4 | ＋ Thêm chi tiết / split | | |
| 1.5 | ＋ Income / Vay mượn | | |
| 2.1 | Giao dịch timeline | | |
| 2.2 | Transaction detail | | |
| 3.1 | Kế hoạch | | |
| 3.2 | Free-money breakdown | | |
| 3.3 | New-month wizard | | |
| 3.4 | Đối chiếu số dư | | |
| 4.1 | Tôi nợ | | |
| 4.2 | Debt detail | | |
| 4.3 | Nợ tôi | | |
| 4.4 | Trả sau + Định kỳ | | |
| 5.1 | Tiết kiệm | | |
| 5.2 | Báo cáo | | |
| 5.3 | Cài đặt | | |
| 6.1 | Desktop | | |

## Anything else
>
