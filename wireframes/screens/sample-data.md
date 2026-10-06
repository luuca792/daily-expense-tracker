# Sample data (fictional)

Used in the wireframes and as the **demo seed** for the prototype. It is entirely made up: never use names or figures from `references/personal-fund.xlsx`. Keep the numbers consistent when screens change.

## Settings (6.0)
- Expected Sinh hoạt maximum: 4.000 · large expenses highlighted from 200 (so 318 and 250 are red on 5.1) · amounts always in nghìn đồng

## Periods (4.0)
| Name | Start → end | Thu | Chi | Entries |
|---|---|---|---|---|
| Tháng 10/2026 | 01/10/2026 → (none) | +10.500 (carry-over from Tháng 9) | −245 | 4 |
| Tháng 9/2026 | 01/09/2026 → 30/09/2026 | +20.000 | −9.500 | 43 (40 expenses + 2 incomes + 1 savings deposit) |
| Du lịch Đà Lạt | 14/08/2026 → 18/08/2026 | +2.000 (savings withdrawal) | −3.200 | 18 |
| Kỳ lương 5/7 – 4/8 | 05/07/2026 → 04/08/2026 | +19.000 (incl. a 4.000 savings deposit) | −8.900 | 38 |

Creating "Tháng 11/2026" (start 01/11/2026) with "Tháng 10/2026" selected carries over **+10.255** (10.500 − 245).

## Tháng 9/2026 in detail (the period shown on 5.x)
- **Summary card:** Thu 20.000 · Chi 9.500 · Số dư 10.500 · reserve 400 (hidden) · **Còn lại 10.100**.
- **Sinh hoạt:** maximum 4.000 · spent 3.100 = 2.850 categorized (36 entries) + 250 untracked (4 entries) · remaining 900.
- **Goals** (targets 6.800, spent 6.400). Gia đình is marked done; the reserve over the other goals is still 4.800 − 4.400 = 400:

| Goal | Icon | Target | Spent | Bar |
|---|---|---|---|---|
| Nhà ở | 🏠 | 2.500 | 2.600 | red (over) |
| Gia đình | 👨‍👩‍👧 | 2.000 | 2.000 | green (met), **done** (D59) |
| Mua sắm | 🛍️ | 1.000 | 900 | yellow |
| Đi lại | 🛵 | 700 | 582 | yellow |
| Sức khỏe | 💊 | 600 | 318 (3 entries) | yellow |

- **Expenses shown on 5.1** (newest day first):
  - Thứ 4 · 30/09: Ăn trưa 60 (Sinh hoạt) · untracked 16 · Đổ xăng 51 (Đi lại) · Cà phê 35 (Sinh hoạt)
  - Thứ 3 · 29/09: Khám bệnh 318 (Sức khỏe) · Áo khoác 250 (Mua sắm)
  - Thứ 2 · 28/09: Đi chợ 92 (Sinh hoạt) · Tiền điện 646 (Nhà ở) · Biếu ba mẹ 500 (Gia đình)
- **5.3 chart 2 "Mục tiêu"** (share of Chi 9.500): Sinh hoạt 3.100 (32,6%) · Nhà ở 2.600 (27,4%) · Gia đình 2.000 (21,1%) · Mua sắm 900 (9,5%) · Đi lại 582 (6,1%) · Sức khỏe 318 (3,3%).
- **Incomes:** Thứ 3 · 01/09 "Còn lại từ tháng trước" +1.250 · Thứ 7 · 05/09 "Lương tháng 8" +21.750 · Thứ 7 · 05/09 "Gửi tiết kiệm" −3.000 (added after the salary, so listed first). Net Thu = 20.000.

## Savings (7.0, D50)
| Date | Period | Direction | Amount | Fund after |
|---|---|---|---|---|
| — | (none) | Số dư ban đầu (D52) | 1.000 | 1.000 |
| 05/07/2026 | Kỳ lương 5/7 – 4/8 | Gửi vào | 4.000 | 5.000 |
| 14/08/2026 | Du lịch Đà Lạt | Rút ra | 2.000 | 3.000 |
| 05/09/2026 | Tháng 9/2026 | Gửi vào | 3.000 | 6.000 |

Fund card: **6.000** · Gửi +7.000 · Rút −2.000 (the base is not in "Gửi"). The 5.1 button shows "Quỹ 6.000". On 5.10 (create, Tháng 9, drawn as if on 05/09) the fund shows 3.000, the balance before that deposit; on 5.10 (edit, Du lịch Đà Lạt, today) it shows 8.000, the current balance without that withdrawal (6.000 + 2.000).

*The full list of 40 expenses isn't spelled out. The prototype seed may add filler Sinh hoạt entries so the totals above match.*
