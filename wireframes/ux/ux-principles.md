# 02 · UX principles

> Note: principle 2 mentions a bottom bar and a single global ＋; the current design has no bottom bar, and the ＋ on 5.0 is context-sensitive (R5). Principles 1, 3 and 6–10 still apply.

These rules apply to every screen. If a design decision conflicts with one of them, the principle wins unless we explicitly agree otherwise in `wireframes/decisions.md`.

## 1. Not a spreadsheet
- No grids, no "add a row", no visible formulas or cell references.
- The user performs **actions** ("Ghi một khoản chi", "Đánh dấu đã trả"). The app keeps the books.

## 2. One primary action
- A single **＋** button, always reachable (centre of the bottom bar on mobile, top-right on desktop), opens the entry sheet.
- Every other "record something" button (pay a recurring payment, repay a debt, receive a share) opens **the same entry sheet, prefilled**. There is one way to enter money.

## 3. Show answers, not formulas
- The headline number is **"Tiền tự do"**, what you can actually spend.
- Every computed number can be tapped to see a plain-language breakdown, e.g. "Thu 20.000 − Đã chi 9.500 − Giữ cho kế hoạch 6.000".

## 4. Smart defaults, progressive disclosure
- Defaults: date = today, the last-used category, payment = cash, the current month.
- The basic sheet has only **amount, category, (optional) description**.
- "Thêm chi tiết" reveals: date, note, pay-later source, split bill, link to a debt.

## 5. Mobile-first, thumb-friendly
- Bottom navigation, bottom sheets, tap targets of 44 px or more, and primary buttons within thumb reach.
- On desktop the same screens are shown in two columns (list + detail), not as a different app.

## 6. Forgiving
- Tapping any item lets you edit it. Delete shows an **Undo** toast instead of a confirm dialog.
- Nothing is lost silently inside the app (undo on delete). Data lives only on the device; losing the device loses it, by design (D56).

## 7. Calm, honest feedback
- Warnings (large expense, over plan, due soon) are small colored chips, not modal alerts.
- Being over plan is shown neutrally in red. There is no guilt-tripping copy.

## 8. Vietnamese first
- All copy is natural Vietnamese, with short labels and the informal-polite "bạn".
- Numbers use `vi-VN` grouping (`1.700`), dates use `dd/MM/yyyy`, and relative dates are used where helpful ("Hôm nay", "Hôm qua").

## 9. Private by design
- Data never leaves the device. This is a property of the app, not a message on screen (see principle 10).
- No accounts, no analytics, no external requests carrying data.

## 10. No explanatory text on screen (D25)
- Screens contain **only labels, values, data and actions**. There are no info boxes, remarks, hints, taglines, card descriptions or "(không bắt buộc)" markers.
- Optional fields are simply not required: the form saves without them, and nothing tells the user they are optional.
- Rules and explanations live in the docs (`logic-rules.md`), not in the UI.
- Exceptions: validation errors (e.g. end date before start date) and confirmation dialogs, which show the facts of the action (e.g. "3 khoản (318) → Sinh hoạt") without explanatory sentences.
