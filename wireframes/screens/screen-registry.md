# Screen registry

The index of all screens. **The details are in each screen's spec** (`specs/`). The picture is at `wireframes.html#<anchor>`.

## Naming convention (D28)
`<number>.<sub_number>. <Name>`: the number is a main page and `.0` is the page itself. Sub-numbers are its tabs, sub-pages, sheets and dialogs, with tabs first. Numbers are stable, and retired numbers are never reused.

## Screens

| # | Name | Vietnamese | Type | Status | Spec | Anchor |
|---|---|---|---|---|---|---|
| **1.0.** | Welcome | Chào mừng | Page | Designed | [1.0-welcome](specs/1.0-welcome.md) | `#s1-0` |
| **2.0.** | Home | Bạn muốn làm gì? | Page | Designed | [2.0-home](specs/2.0-home.md) | `#s2-0` |
| **3.0.** | Overview | Tổng quan | Page | Designed (for review) | [3.0-overview](specs/3.0-overview.md) | `#s3-0` |
| **4.0.** | Periods | Kỳ chi tiêu | Page | Designed | [4.0-periods](specs/4.0-periods.md) | `#s4-0` |
| 4.1. | Create / Edit Period | Tạo kỳ mới / Sửa kỳ | Sheet | Designed | [4.1-create-edit-period](specs/4.1-create-edit-period.md) | `#s4-1` |
| **5.0.** | Period Detail | Chi tiết kỳ | Page (tab shell) | Designed | [5.0-period-detail](specs/5.0-period-detail.md) | — |
| 5.1. | Logging | tab Ghi chép | Tab | Designed | [5.1-logging](specs/5.1-logging.md) | `#s5-1`, `#s5-1b` |
| 5.2. | Goals | tab Mục tiêu | Tab | Designed | [5.2-goals](specs/5.2-goals.md) | `#s5-2` |
| 5.3. | Statistics | tab Thống kê | Tab | Designed | [5.3-statistics](specs/5.3-statistics.md) | `#s5-3`, `#s5-3b` |
| 5.4. | Add Expense | Thêm khoản chi | Sheet | Designed | [5.4-add-expense](specs/5.4-add-expense.md) | `#s5-4` |
| 5.5. | Add Untracked Expense | Thêm khoản chi (Không DM) | Variant of 5.4 | Designed | [5.5-add-untracked-expense](specs/5.5-add-untracked-expense.md) | `#s5-5` |
| 5.6. | Edit Goal | Sửa mục tiêu | Sheet | Designed | [5.6-edit-goal](specs/5.6-edit-goal.md) | `#s5-6`, `#s5-6b` |
| 5.7. | Delete Goal | Xóa mục tiêu | Dialog | Designed | [5.7-delete-goal](specs/5.7-delete-goal.md) | `#s5-7` |
| 5.9. | Add Income | Thêm thu nhập | Sheet | Not drawn | [5.9-add-income](specs/5.9-add-income.md) | — |
| 5.10. | Savings Transfer | Tiết kiệm (Gửi vào / Rút ra) | Sheet | Designed (for review) | [5.10-savings-transfer](specs/5.10-savings-transfer.md) | `#s5-10`, `#s5-10b` |
| **6.0.** | Settings | Cài đặt | Page | Designed | [6.0-settings](specs/6.0-settings.md) | `#s6-0` |
| **7.0.** | Savings | Tiết kiệm | Page | Designed (for review) | [7.0-savings](specs/7.0-savings.md) | `#s7-0`, `#s7-0b` |
| 7.1. | Base Savings | Số dư ban đầu | Sheet | Designed (for review) | [7.1-base-savings](specs/7.1-base-savings.md) | `#s7-1` |

The navigation tree is in `../ux/information-architecture.md`.

## Retired numbers
- **5.8. Living Expense**: merged into 5.3. Statistics (D43).
- Before D43, 5.1 was "Spending" and 5.3 was "Income". Both are now part of 5.1. Logging, and 5.3 was reassigned to Statistics in that one-time renumbering.

## Parking lot
Sections 1–6 of `wireframes.html` are the round-1 ideas. They keep their old frame labels and get a number (and a spec) only when they are brought into the current design.
