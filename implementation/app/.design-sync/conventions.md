# Sổ chi tiêu: building with this design system

A Vietnamese, mobile-first personal expense tracker. All UI text is Vietnamese. Screens are a single phone column (max width `var(--col)` = 430px).

## Setup
- No provider or wrapper is needed. Components are plain React that read props only; `styles.css` brings the tokens, the Be Vietnam Pro font (400–800) and every class below.
- `styles.css` paints `html, body` with the grey backdrop `#e2e8f0`. Put each screen inside `<div className="app">` (centered 430px column, `--bg` background) and the content inside `<div className="page">` (16px side padding).
- `Sheet`, `Dialog`, `BottomBar` and `PlusButton` are `position: fixed` (class `fixed-col`) and pin themselves to the bottom or center of the column. Render them once per screen, as siblings of `.page`, never inside a card. When a screen has `BottomBar`, give the page `className="page with-bar"` so content clears it.

## Data conventions
- Money is an integer in **thousands of đồng**: `1700` means 1.700.000 ₫. Show it with vi-VN grouping and no currency sign: `1.700`. Expenses show as `−60` (a real minus sign, U+2212), incomes as `+18.500`.
- Dates are `'yyyy-MM-dd'` strings; on screen they read `dd/MM/yyyy` or `Thứ 4 · 07/10`.
- Category colors are `ColorKey`s: `orange blue pink violet green amber indigo slate red teal cyan lime`. Each one has a pale tint for icon tiles and rows; `Ico` and `ExpenseRow` apply it.

## Styling idiom: the app's own CSS classes plus `var(--*)` tokens
Use these classes for your own layout glue. Don't invent new class names; use inline styles with tokens for one-offs.
- Tokens: `--bg --surface --text --muted --border --teal --teal-d --teal-l --income --expense --grad-teal --grad-violet --grad-amber --grad-btn`.
- Buttons: `btn` (outline teal), `btn pri` (gradient primary), `btn danger`, `btn ok`, `btn-row` (side-by-side), `text-danger` (centered red text button), `icon-btn` (34px round).
- Form: `input` (also on `<select>`), `input ro`, `input bad`; wrap each control in `Field`. Error text: `err`.
- Text: `lbl`, `s` (12px muted), `inc` / `exp` (green / red amounts), `val`, `nowrap`.
- Cards: `mcard` (white list card; add `now` for the active one) with `mnum`, `body`, `name`, `dates`, `arr` inside; `hub` with `grad-teal | grad-violet | grad-amber` (big gradient nav tile; `hub-ic`, `hub-t`, `hub-go` inside); `sumc grad-teal` (summary card; `big`, `bal`, `right` inside); `info-card`; `good` / `good neg` (balance strip).
- Segmented toggle: `<div className="seg">` with two `<button>`s; add `on` to the active button and `second` to `seg` when the second one is active.
- Settings list: `set-sec` heading, then `set` containing `<button>`s.
- Popup menu: `menu` holding `<button>`s (`red` for destructive ones).

## Where the truth lives
`styles.css` → `_ds_bundle.css` holds every class above. Read it before styling. Each component's `.prompt.md` and `.d.ts` define its exact props.

## Example
```jsx
const { Header, GoalCard, BottomBar, PlusButton } = window.SoChiTieu;
<div className="app">
  <Header title="Tháng 10" sub="01/10/2026 → chưa kết thúc" onBack={back} />
  <div className="page with-bar">
    <div className="sumc grad-teal"><div><div className="lbl on-grad">Còn lại</div><div className="big">12.260</div></div></div>
    <GoalCard g={{ id: 'g1', name: 'Đi lại', icon: '🛵', color: 'blue', target: 600, done: false }} spent={240} onClick={open} />
  </div>
  <PlusButton onClick={add} />
  <BottomBar tabs={[{ key: 'entries', icon: '📒', label: 'Thu chi' }, { key: 'goals', icon: '🎯', label: 'Mục tiêu' }]} current="goals" onSelect={go} />
</div>
```
