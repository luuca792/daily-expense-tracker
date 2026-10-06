# 04 · User flows

> ⚠️ **Round-1 reference, not the current design.** These flows predate the simplified core flow (periods, 5.x screens). For current behavior see `screen-registry.md` (screens), `logic-rules.md` (rules) and `decisions.md`. Flows here are kept as ideas for later features.

Each flow is a short sequence of taps. ⓘ marks a design idea to validate in feedback round 1.

---

## F1 · Ghi một khoản chi (Log an expense) · UC1, UC2, UC6
1. Tap **＋**. The entry sheet slides up with **Chi** selected and the keypad focused.
2. Type the amount on the keypad.
   - ⓘ The keypad has `+ − × ÷` keys, so `100 + 218` shows `= 318` live. The expression is kept and visible when editing.
   - ⓘ A `000` key makes amounts in đồng fast to type (see open question Q1 about units).
3. Pick a category from the icon grid. The last 4 used categories are on the first row.
4. Optional: a description. Suggestions come from previous descriptions in that category.
5. Tap **Lưu**, or **Lưu & thêm tiếp** (save and add another, which keeps the sheet open and resets the amount).
6. A toast shows "Đã ghi 318 · Ăn uống" with **Hoàn tác** (undo).
   - If the amount is above the category's warning threshold, the toast and the transaction carry an amber or red "Khoản lớn" chip. *(UC6)*

## F2 · Ghi thu nhập (Log income) · UC4, UC13
1. Tap **＋**, then switch the toggle to **Thu**.
2. Enter the amount, then choose a type chip: **Lương · Thưởng · Được cho/hỗ trợ · Vay mượn · Khác**.
3. Choosing **Vay mượn** asks "Vay từ ai?" and suggests existing people.
   - On save, the app creates a new **Tôi nợ** entry, or increases an existing one.
   - The income still counts toward this month's money.
4. Save.

## F3 · Hoàn tiền (Refund) · UC3
- Open a past expense and tap **Hoàn tiền**. A prefilled sheet (same category, linked) asks for the amount returned.
- Or, in the entry sheet, the **±** key makes the amount negative and it is labelled "Hoàn tiền".

## F4 · Chia hóa đơn (Split a bill) · UC16, UC15
1. In the entry sheet, enter the **total** paid, then tap **Thêm chi tiết → Chia hóa đơn**.
2. Add people (chips, suggesting known names) and their shares. Two helpers: **Chia đều** (split equally) and **nhập từng phần** (enter each share).
3. The sheet shows "Phần của bạn: 53 · Người khác nợ: 100".
4. On save, my share counts as spending, and each other share becomes a **Nợ tôi** item. Shares paid on the spot can be ticked "đã trả ngay".

## F5 · Trả sau (Pay later) · UC12
1. In the entry sheet, under **Thêm chi tiết → Thanh toán bằng**, choose **Tiền mặt / Tài khoản** (default) or a pay-later source such as "Thẻ tín dụng".
2. Pay-later purchases show a card icon in the timeline. They do **not** reduce free money yet.
3. **Sổ nợ → Trả sau** shows each source's outstanding balance. **Thanh toán** opens a prefilled sheet, and that payment counts as spending.

## F6 · Lập kế hoạch tháng mới (Plan a new month) · UC8, UC9, UC10, UC17
Triggered from **Kế hoạch** (or a Home banner on the first day of a month without a plan).
1. **Số dư chuyển sang** (carried over): "Tháng trước còn 1.250. Chuyển sang tháng này?" with options Đồng ý / Sửa / Không chuyển.
2. **Khoản định kỳ** (recurring payments): a list with toggles, all on by default, each becoming a plan item.
3. **Kế hoạch từ tháng trước** (last month's plan): category plan items with last month's amounts and actuals, so they can be edited quickly.
4. **Mục tiêu riêng tháng này** (this month's one-off goals): add named items (e.g. "Du lịch", "Giúp bạn").
5. **Xong** shows the resulting free money.

## F7 · Theo dõi kế hoạch & tiền tự do (Follow the plan & free money) · UC10, UC11
- Each plan card shows: name · progress bar (actual / planned) · "còn giữ 400" (still reserved).
- **Xong** (swipe or button) marks the item done. Its leftover reserve is released into free money, and the card greys out.
- Tapping the free-money card shows the breakdown: Thu + chuyển sang − đã chi − đang giữ cho kế hoạch − tiết kiệm.

## F8 · Đối chiếu số dư (Reconcile) · UC5
1. **Kế hoạch → Đối chiếu số dư** (or a monthly Home reminder).
2. "Bạn thực sự đang có bao nhiêu?" The user enters the actual cash plus account balance. The keypad works with expressions, e.g. `850 + 4.200`.
3. The app shows "Theo sổ: 5.300 · Thực tế: 5.050 → Chênh lệch 250".
4. **Ghi nhận là chi không ghi chép** records it as unlogged spending. The default category is configurable.

## F9 · Khoản định kỳ (Recurring payments) · UC17
- Set up in **Sổ nợ → Định kỳ → ＋**: name, amount, charge day, category.
- A Home card shows **Sắp đến hạn** (due within 5 days, or overdue this month), and **Đã trả** records it with one tap and an undo toast.
- ⓘ Option per item: "Tự động ghi khi đến ngày" (auto-record on the charge day). Off by default.

## F10 · Tôi nợ (Money I owe) · UC13, UC14
- Person or creditor cards show: name · remaining · progress bar if a total is set · last payment.
- **Ghi nhận trả** opens a prefilled expense sheet. Its category is "Trả nợ" and it is linked to the debt, which updates the progress.
- The detail view shows the payment history (replacing the numbered installment table), the remaining amount, and an optional target date.
- Debts can also be created by hand (＋ in the tab).

## F11 · Nợ tôi (Money others owe me) · UC15, UC16
- Cards show: person · amount · reason · status chip (**Đang chờ · Trả một phần · Đã trả · Đã xóa nợ**).
- **Nhận tiền** (receive money) records income linked to the receivable. Partial amounts are allowed.
- **Xóa nợ** (write off) closes it as lost and keeps it in history.

## F12 · Tiết kiệm (Savings) · UC20
- **Gửi tiết kiệm** (deposit) / **Rút** (withdraw) through the same entry sheet in a third mode, or from the Savings screen.
- Deposits reduce this month's free money, and the savings balance grows.
- Optional goals (name, target, deadline) show progress.

## F13 · Báo cáo (Reports) · UC19
- Income vs spending bars for the last 6 or 12 months.
- A category donut for the selected month, where tapping a category opens a filtered transaction list.
- A month-over-month comparison per category.

## F14 · Danh mục (Categories) · UC21, UC6
- **Cài đặt → Danh mục**: list with icon and color, plus add, edit (name, icon, color, warning thresholds), **Gộp** (merge into another, moving the transactions) and **Ẩn** (archive).
- Default categories are generic: Ăn uống, Đi lại, Nhà ở, Hóa đơn & dịch vụ, Sức khỏe, Gia đình, Mua sắm, Giải trí, Giúp đỡ, Công việc, Trả nợ, Khác.

## F15 · Dữ liệu (Data) · UC22
- **First run:** an explanation ("Dữ liệu chỉ lưu trên trình duyệt của bạn") and three choices: **Bắt đầu mới**, **Tải lên tệp sao lưu**, **Dùng thử dữ liệu mẫu**.
- **Sao lưu** downloads `so-chi-tieu-YYYY-MM-DD.json`.
- **Khôi phục** uploads a file and shows a preview ("12 tháng · 1.024 giao dịch · sao lưu ngày …") before replacing the data.
- A backup reminder chip appears on Home when there are changes not backed up for 7 days or more.

---

## Traceability: every use case has a flow and a screen

| UC | Flow(s) | Screen(s) |
|---|---|---|
| UC1 | F1 | ＋ sheet, Giao dịch |
| UC2 | F1 (keypad) | ＋ sheet |
| UC3 | F3 | ＋ sheet, transaction detail |
| UC4 | F2 | ＋ sheet |
| UC5 | F8 | Kế hoạch |
| UC6 | F1, F14 | Giao dịch, Trang chủ alerts |
| UC7 | F1 (Thêm chi tiết → Ghi chú) | ＋ sheet, plan item |
| UC8 | F6 | Kế hoạch, Giao dịch (month switcher) |
| UC9 | F6 step 1, F7 | Kế hoạch |
| UC10 | F6, F7 | Kế hoạch |
| UC11 | F7 | Trang chủ, Kế hoạch |
| UC12 | F5 | ＋ sheet, Sổ nợ → Trả sau |
| UC13 | F2, F10 | Sổ nợ → Tôi nợ |
| UC14 | F10 | Debt detail |
| UC15 | F11 | Sổ nợ → Nợ tôi |
| UC16 | F4 | ＋ sheet |
| UC17 | F6, F9 | Trang chủ, Sổ nợ → Định kỳ |
| UC18 | — | Trang chủ |
| UC19 | F13 | Báo cáo |
| UC20 | F12 | Tiết kiệm |
| UC21 | F14 | Cài đặt → Danh mục |
| UC22 | F15 | Chào mừng, Cài đặt → Dữ liệu |
