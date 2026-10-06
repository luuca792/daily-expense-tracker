# 03 · Information architecture

## Current direction (v1b): simple main flow, built step by step

```
1.0. Welcome ──(Bắt đầu mới)──────────────▶ 2.0. Home
   (skipped when the browser already has data)   ├─▶ 3.0. Overview          (total wealth: savings → 7.0, active period → 5.0; R7)
                                                   └─▶ 4.0. Periods           (grouped by start year, R1)
                                                         ├─▶ 4.1. Create / Edit Period
                                                         └─▶ 5.0. Period Detail  (header: dates, ⋯ → 4.1, ⚙ → 6.0; summary card on every tab)
                                                               │   bottom bar (D43):
                                                               ├─ 5.1. Logging (Ghi chép) ── toggle Chi tiêu | Thu nhập
                                                               │        ＋ (Chi tiêu) ──▶ 5.4. Add Expense (Không DM ▶ 5.5. Add Untracked Expense)
                                                               │        ＋ (Thu nhập) ──▶ 5.9. Add Income (to be drawn) · "Gửi tiết kiệm" button ──▶ 5.10. Savings Transfer
                                                               ├─ 5.2. Goals (Mục tiêu) ── Sinh hoạt tracker (default goal) + goals
                                                               │        tap / ＋ ──▶ 5.6. Edit Goal ──▶ 5.7. Delete Goal
                                                               └─ 5.3. Statistics (Thống kê) ── chart carousel: Danh mục & không danh mục · Mục tiêu
2.0. Home ──▶ 7.0. Savings (Tiết kiệm) ── tap a transfer ──▶ 5.0 of its period, 5.1 Thu nhập
                 └─ "Số dư ban đầu" button / row ──▶ 7.1. Base Savings
⚙ on 2.0 or 5.0 ──▶ 6.0. Settings
```

Screen numbers and the naming convention are in **`screen-registry.md`**.

Screen codes and the naming convention are in **`screen-registry.md`**.

What each screen contains is in **`../screens/specs/`**, and the hidden rules are in **`../logic/logic-rules.md`**. This file only holds the navigation structure.

- Navigation is a drill-down with "‹" back buttons. Inside a period (5.0) there is a bottom bar with three tabs (D43).
- Everything below this section is the **round-1 proposal**. It is kept as a reference for features we add later; it is not the current structure.

---

## Round-1 proposal (later ideas)

## Navigation (mobile bottom bar)

```
┌────────┬──────────┬─────┬──────────┬────────┐
│Trang chủ│ Giao dịch │  ＋  │ Kế hoạch  │ Sổ nợ  │
└────────┴──────────┴─────┴──────────┴────────┘
                    (Thêm / Cài đặt: avatar menu at top-right of every screen)
```

On desktop the left sidebar holds the same items, plus **Tiết kiệm**, **Báo cáo** and **Cài đặt**, and the ＋ button sits at the top-right.

## Screen map

| Screen | Purpose | Main content | Use cases |
|---|---|---|---|
| **Trang chủ** (Home) | "How am I doing right now?" | Free-money card (tap → breakdown) · due-soon recurring payments with "Đã trả" · top plan items' progress · alerts (large spend, over plan, backup reminder) · savings & debt mini-summary | UC6, UC11, UC17, UC18 |
| **Giao dịch** (Transactions) | "What did I spend / earn?" | Month switcher · daily-grouped timeline with daily totals · filter chips (Chi / Thu / category / pay-later) · search · tap → edit | UC1–UC5, UC7, UC8 |
| **＋ Entry sheet** | The single way to record money | Chi / Thu toggle · keypad with + − × ÷ · category grid · description with suggestions · "Thêm chi tiết" | UC1–UC4, UC7, UC12, UC13, UC16 |
| **Kế hoạch** (Plan) | "What did I intend to spend?" | Month switcher · free-money summary · plan cards (planned vs actual, "Xong") · carry-over line · "Đối chiếu số dư" · "Lập kế hoạch tháng mới" wizard | UC5, UC8–UC11 |
| **Sổ nợ** (Ledger) | "Who owes whom, and what's coming?" | Tabs: **Tôi nợ** · **Nợ tôi** · **Trả sau** (card/fund balances) · **Định kỳ** (recurring payments) | UC12–UC17 |
| **Tiết kiệm** (Savings) | Saving progress | Balance · goals with progress · deposit/withdraw history | UC20 |
| **Báo cáo** (Reports) | Trends | Income vs spending per month · category breakdown · month comparison | UC19 |
| **Cài đặt** (Settings) | Customise & data | Categories (icon, color, warning threshold, merge, archive) · pay-later sources · display unit · **Sao lưu / Khôi phục** (backup/restore) · delete data on this device | UC6, UC21, UC22 |
| **Chào mừng** (Onboarding) | First run | "Dữ liệu chỉ nằm trên máy bạn" · Bắt đầu mới / Tải lên tệp sao lưu / Dùng thử dữ liệu mẫu | UC22 |

## Core objects (for the user's mental model)

- **Giao dịch** (transaction): a money movement, either *Chi* (expense) or *Thu* (income). It can carry a note, a split, a pay-later source, or a link to a debt.
- **Kế hoạch** (plan item): an intended amount for a category or for a named one-off goal in one month.
- **Khoản nợ** (debt or receivable): who, how much in total, its payment history, and its status.
- **Khoản định kỳ** (recurring payment): a monthly bill with a charge day. Paying it creates a transaction.
- **Nguồn trả sau** (pay-later source): a credit card or fund with a running balance.
- **Mục tiêu tiết kiệm** (savings goal).
