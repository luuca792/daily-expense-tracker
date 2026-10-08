# Manual test script (plan §5)

Automated already: unit tests (`npm test`, rules R1–R7, data layer) and e2e (`npm run e2e`: reload keeps data,
export file, two tabs, offline, manifest). This list covers what needs eyes or a real phone.
Tick each line on **Android Chrome** and on **iPhone Safari (home-screen icon)**.

## Screens
| # | Check |
|---|---|
| 1.0 | Fresh install shows Sổ chi tiêu + Bắt đầu mới. |
| 1.1 | Tiếp tục is off while the name is empty or only spaces; Enter on the keyboard continues. |
| 2.0 | "Xin chào, {name} 👋"; a 30-character name is cut with …, the ✎ stays visible. |
| 2.1 | Empty name + Lưu keeps the old name. |
| 3.0 | Tổng tài sản = fund + active Số dư; the bar and % only when both are > 0. |
| 4.0 | Current year open, other years closed; active period highlighted. |
| 4.1 | Create with a start ≥ the active start → 4.3; with an older start → no dialog, the new period is closed history. Edit: moving the start after the first entry shows "… khoản nằm ngoài khoảng ngày". |
| 4.2 | Deleting the active period reopens the previous one; Hoàn tác brings it back. Refused with "Vượt quá quỹ tiết kiệm" when the fund would drop below 0. |
| 4.3 | Hủy keeps the sheet open; Tạo kỳ opens the new period with the carry-over income. |
| 5.0 | Past period: no ＋, no Gửi tiết kiệm, rows and goals don't open, ⋯ has only Xóa kỳ. Back returns to where 5.0 was opened from. |
| 5.1 | Toggle remembered per period while the app is open; amounts ≥ the large-expense setting are red; a saved row flashes once. |
| 5.2 | Sinh hoạt bar hatched for untracked; red over the maximum; done goals faded with ✓. |
| 5.3 | ‹ › and swipe switch the two charts; per-day bars run to today on the active period. |
| 5.4 / 5.5 | Không DM hides Mô tả; Lưu & thêm tiếp keeps the sheet open with category and date; ＋ Mục tiêu mới opens 5.6 on top and selects the new goal. |
| 5.6 / 5.7 | Sinh hoạt mode: name fixed. Delete moves the entries to Sinh hoạt (count shown), Hoàn tác restores. |
| 5.9 | ± makes a negative income; 0 can't be saved. |
| 5.10 | Rút ra more than the fund → "Vượt quá quỹ tiết kiệm", Lưu off. |
| 6.0 | Xuất dữ liệu: **Android** share sheet → save to Drive; **iPhone** share sheet → Lưu vào Tệp. Closing the sheet changes nothing; after a real export the date shows and "Đã xuất dữ liệu" appears. Open the file: it has `"format": "so-chi-tieu"`. |
| 6.1 | New Sinh hoạt maximum applies to the next new period only. |
| 7.0 | Transfers newest first; tapping one opens its period on Thu nhập. |
| 7.1 | Base must be > 0; deleting it is allowed even if the fund goes negative. |
| BootError | (desktop, dev server) DevTools → Application → IndexedDB → `so-chi-tieu` → `kv` → `data`: change `schemaVersion` to 9, reload → "Không mở được dữ liệu" with Xuất dữ liệu / Thử lại only; the record is unchanged. Set it back to 1 and Thử lại. |

## Device checks
- [ ] Install from the browser (Android: Cài đặt ứng dụng; iPhone: Thêm vào MH chính). Icon and name "Sổ chi tiêu".
- [ ] Airplane mode → open from the icon → works, font is Be Vietnam Pro.
- [ ] Add data, close the app fully, reopen → data still there.
- [ ] Two days later the data is still there (iPhone: from the icon).

## Update check (before friends use it, and after any release that changes the schema)
1. Install the current version on a phone and add some data.
2. Deploy the new version.
3. Open the app, close it, open again (the new version runs on the second launch).
4. Confirm the new version runs and the data is intact. After a schema change, 6.0 Xuất dữ liệu still works and the file shows the new `schemaVersion`.
