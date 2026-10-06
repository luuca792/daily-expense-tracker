# Open design questions

Small questions collected along the way. **Answer them before the prototype is built.** Until then, design work continues with the *proposed default*.

How to answer: write in the **Answer** column. Leave it empty to accept the proposed default.

## A. Needed before the prototype (core flow)

None open. All section A questions are answered (D57–D62).

## P. Prototype defaults (chosen while building, 2026-10-05)

Details the specs don't cover. The prototype uses the proposed default; change it during feedback if it feels wrong.

| # | Question | Proposed default | Answer |
|---|---|---|---|
| P-01 | 4.1: default "Ngày bắt đầu" when creating | Today | |
| P-02 | 4.1: error texts next to the fields | "Chưa nhập tên kỳ" · "Chưa chọn ngày" · "Trước ngày bắt đầu" · "N khoản nằm ngoài khoảng ngày" | |
| P-03 | Delete period (from ⋯ or 4.1): the confirmation dialog | Like 5.7: 🗑, "Xóa kỳ “<name>”?", Hủy / Xóa. If R6.6 refuses: "Vượt quá quỹ tiết kiệm" and Xóa disabled | |
| P-04 | Undo toast | "Đã xóa …" + "Hoàn tác", shown 5 seconds | |
| P-05 | 5.9: how to enter a negative income on a numeric keyboard | A round "+ / −" button in the amount box | |
| P-06 | 5.6: icon and color picker | 12 color swatches + a grid of 16 emoji. A new goal starts with ✨ and slate | |
| P-07 | 6.0: the edit sheet for a value | Title = the row label, amount box, "Lưu" | |
| P-08 | 5.3 daily bars for a period with no end date | From the start date to today | |
| P-09 | Sample data: Sức khỏe is "318 (3 entries)" but Khám bệnh alone is 318 | The seed has one Sức khỏe entry (318); 5.6 shows "1 khoản" | |
| P-10 | Lowering or deleting a deposit while the fund is already below 0 (R6.4) | Blocked only if the fund would end lower than now and below 0; a deposit that raises a negative fund is allowed | |

## B. Later features (answer when we get to them)

These come from the round-1 ideas in sections 1–6 of `wireframes/screens/wireframes.html`. They are not part of the current flow.

| # | Question | Proposed default | Answer |
|---|---|---|---|
| L-01 | **Tổng quan** (overview): what should it show first? For example: months compared, debts, recurring payments, savings. | Designed as total wealth = savings + active period (D54); more sections later | |
| L-03 | **Recurring payments**: record them automatically on their due day, or only when you tap "Đã trả"? | Tap, with auto as an option | |
| L-04 | **Debts / money owed to you**: is a "Sổ nợ" (I owe / others owe me, with repayment progress) wanted? | Yes, later | |
| L-05 | **Pay-later (credit card / fund)**: these purchases don't count as spent until the card is paid. | Later | |
| L-06 | **Split a bill** inside the add form. | Probably drop (keep it simple) | |
| L-07 | **Savings**: one balance with goals, or separate pots? | One fund, no goals for now (D50); goals or pots later | |
| L-09 | **Income types** (salary, support, borrowed…): needed, or is a plain description enough? | Plain description for now | |

---

Answered questions move to `wireframes/decisions.md` (D-numbers) and are removed from this list.
