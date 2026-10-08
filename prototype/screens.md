# Screen map (prototype)

Use these numbers in requests, e.g. "5.2: make the goal cards smaller". The numbers continue the wireframe naming (`<number>.<sub>. <Name>`, `.0` = main page). A new screen takes the next free number and gets a row here. Retired numbers (5.8) are never reused.

| # | Name | Vietnamese (on screen) | Type | How to open | File (`app/src/screens/`) |
|---|---|---|---|---|---|
| **1.0.** | Welcome | Chào mừng | Page | `?seed=empty` | `S1_0_Welcome.tsx` |
| 1.1. | Your Name | Xin chào! Bạn tên gì? | Page | `#/` with data but no name (after 1.0 Bắt đầu mới) | `S1_0_Welcome.tsx` (`S1_1_YourName`) |
| **2.0.** | Home | Xin chào, (name) 👋 · Bạn muốn làm gì? | Page | `#/` (with data and a name) | `S2_0_Home.tsx` |
| 2.1. | Edit Name | Đổi tên | Sheet | 2.0 → ✎ next to the name | `S2_0_Home.tsx` (`S2_1_NameSheet`) |
| **3.0.** | Overview | Tổng quan | Page | 2.0 → Tổng quan | `S3_0_Overview.tsx` |
| **4.0.** | Periods | Ghi chép | Page | 2.0 → Ghi chép | `S4_0_Periods.tsx` |
| 4.1. | Create / Edit Period | Tạo kỳ mới / Sửa kỳ | Sheet | 4.0 ＋, or 5.0 ⋯ → Sửa kỳ (active period only) | `S4_1_PeriodSheet.tsx` |
| 4.2. | Delete Period | Xóa kỳ “…”? | Dialog | 5.0 ⋯ → Xóa kỳ, or 4.1 → Xóa kỳ | `S5_0_PeriodDetail.tsx` (`S4_2_DeletePeriod`) |
| 4.3. | Close Period | Đóng kỳ “…”? | Dialog | 4.1 Tạo kỳ, when an active period exists | `S4_1_PeriodSheet.tsx` (`S4_3_ClosePeriod`) |
| **5.0.** | Period Detail | (period name) | Page, bottom bar | 4.0 → a period card | `S5_0_PeriodDetail.tsx` |
| 5.1. | Logging | tab Ghi chép (Chi tiêu / Thu nhập) | Tab | 5.0 bottom bar | `S5_1_Logging.tsx` |
| 5.2. | Goals | tab Mục tiêu | Tab | 5.0 bottom bar | `S5_2_Goals.tsx` |
| 5.3. | Statistics | tab Thống kê | Tab | 5.0 bottom bar | `S5_3_Statistics.tsx` |
| 5.4. | Add / Edit Expense | Thêm / Sửa khoản chi | Sheet | 5.1 Chi tiêu ＋, or tap an expense | `S5_4_ExpenseSheet.tsx` |
| 5.5. | Add Untracked Expense | Thêm khoản chi (Không DM) | Variant of 5.4 | 5.4 with "Không DM" picked | `S5_4_ExpenseSheet.tsx` |
| 5.6. | Add / Edit Goal | Thêm / Sửa mục tiêu | Sheet | 5.2 ＋, or tap a goal | `S5_6_GoalSheet.tsx` |
| 5.7. | Delete Goal | Xóa mục tiêu “…”? | Dialog | 5.6 → Xóa mục tiêu này | `S5_6_GoalSheet.tsx` (`S5_7_DeleteGoal`) |
| 5.9. | Add / Edit Income | Thêm / Sửa thu nhập | Sheet | 5.1 Thu nhập ＋, or tap an income | `S5_9_IncomeSheet.tsx` |
| 5.10. | Savings Transfer | Tiết kiệm (Gửi vào / Rút ra) | Sheet | 5.1 Thu nhập → Gửi tiết kiệm, or tap a savings entry | `S5_10_TransferSheet.tsx` |
| **6.0.** | Settings | Cài đặt | Page | 2.0 → ⚙ | `S6_0_Settings.tsx` |
| 6.1. | Edit Setting | (setting name) | Sheet | 6.0 → a row | `S6_0_Settings.tsx` (`S6_1_SettingSheet`) |
| **7.0.** | Savings | Tiết kiệm | Page | 2.0 → Tiết kiệm, or 3.0 → savings card | `S7_0_Savings.tsx` |
| 7.1. | Base Savings | Số dư ban đầu | Sheet | 7.0 → Số dư ban đầu | `S7_0_Savings.tsx` (`S7_1_BaseSheet`) |

4.2 and 6.1 existed in the prototype without a number. They were numbered here on 2026-10-06.

## Shared parts
Changes to these affect many screens at once, so name them directly: **header / back button** (`Header` in `components/ui.tsx`), **sheet**, **dialog**, **toast (undo)**, **＋ button**, **bottom bar** (5.0).
