# 01 · Use cases (Nhu cầu sử dụng)

> Phase 0 deliverable. These are **needs**, not screens. The workbook was used only as evidence of what the user does. People, banks, services and category names from it are deliberately **not** carried over.
>
> **How to review:** fill in the `Decision` column with **Keep**, **Change** or **Drop**, and add a comment if needed.

## A. Day-to-day recording · Ghi chép hằng ngày

| ID | Use case | Seen in the workbook (generalized) | Need | Decision | Comment |
|---|---|---|---|---|---|
| UC1 | Ghi chi tiêu nhanh / Record spending quickly | Every expense is a hand-typed row: date, description, amount, category. The date is left blank when it is the same day. Amounts are in thousand VND. | Logging an expense takes a few seconds, especially on a phone. | | |
| UC2 | Tính số tiền khi nhập / Compute an amount while entering it | Amounts typed as formulas: adding up a bill, or subtracting other people's shares. | Do simple arithmetic while entering an amount. | | |
| UC3 | Hoàn tiền / Refunds & reimbursements | Negative amounts for money returned. | Record money coming back against earlier spending. | | |
| UC4 | Ghi thu nhập / Record income | Salary, bonus, support from family or friends, and borrowed money are all mixed in one list. | Record income and tell its kinds apart. | | |
| UC5 | Chi tiêu không ghi lại / Unlogged spending | A manual "untracked / minor spent" adjustment, sometimes a long +/− formula. | Make the records match reality without itemizing everything. | | |
| UC6 | Cảnh báo khoản chi lớn / Notice unusually large spending | Everyday-expense rows are colored above two thresholds. | Get a warning when an everyday expense is unusually big. | | |
| UC7 | Ghi chú / Explain an entry | Cell comments break down a bill or explain a planned amount. | Attach an explanation to any entry or plan item. | | |

## B. Monthly planning & free money · Kế hoạch tháng & tiền tự do

| ID | Use case | Seen | Need | Decision | Comment |
|---|---|---|---|---|---|
| UC8 | Quản lý theo tháng / Think in months | One sheet per month. | See one month at a time and start a new month easily. | | |
| UC9 | Chuyển số dư sang tháng sau / Carry over leftover | Last month's "remaining" is added to this month's income by hand. | Carry the leftover automatically and show it. | | |
| UC10 | Lập kế hoạch chi / Plan the month | A planned vs actual table per category, plus one-off goals for that month only. | Set a plan and see progress against it. | | |
| UC11 | Biết tiền tự do thật sự / Know my real free money | Unspent planned money is "reserved" until the item is marked done. Free money = income − spent − reserved. | Always know how much is truly available. | | |
| UC12 | Trả sau (thẻ tín dụng, quỹ) / Pay later | Card or fund purchases are excluded from spending; paying the card back counts. | Track how much is owed on each pay-later source. | | |

## C. Obligations · Nợ & khoản phải trả

| ID | Use case | Seen | Need | Decision | Comment |
|---|---|---|---|---|---|
| UC13 | Tôi nợ / Money I owe | A list of creditors. Borrowed money appears as income; repayments use categories named after each person. | Know whom I owe, how much is left, and record repayments. | | |
| UC14 | Trả dần đến khi hết / Pay toward a total | Numbered installments with "paid / total". | See progress toward paying off a debt. | | |
| UC15 | Người khác nợ tôi / Money others owe me | Debtors with a reason; some are marked as likely lost. | Track it, including partial repayments and write-offs. | | |
| UC16 | Chia hóa đơn / Split a shared bill | Comments list each person's share; formulas subtract others' shares. | Pay for a group and count only my share as spending. | | |
| UC17 | Khoản định kỳ / Recurring payments | Fixed monthly charges with a charge day, plus a note about reminders. | Get reminders and record payments in one tap. | | |

## D. Insight · Tổng quan

| ID | Use case | Seen | Need | Decision | Comment |
|---|---|---|---|---|---|
| UC18 | Xem nhanh / Quick glance | A dashboard sheet exists "to have a quick glance". | See the essentials on one screen. | | |
| UC19 | Xu hướng theo tháng / Trends *(new)* | Each sheet is isolated; there is no history view. | Compare months and categories over time. | | |
| UC20 | Tiết kiệm / Savings *(new)* | The "Saving" cell is never used. | Track a savings balance and goals. | | |

## E. Data & customization · Dữ liệu & tùy chỉnh

| ID | Use case | Seen | Need | Decision | Comment |
|---|---|---|---|---|---|
| UC21 | Danh mục nhất quán / Consistent categories | The same concept is spelled several ways, and categories are invented for one-off purposes. | Manage categories: rename, merge, icon, color, archive. | | |
| UC22 | Dữ liệu riêng tư / Private data, many users | A requirement, not something in the workbook. | Data stays on the user's device only (D56: no backup file for now; export/import to a new device later). Friends use the same site with their own data and no accounts. | | |

## Anything missing?
_Add needs the workbook doesn't show but you would want:_

-
