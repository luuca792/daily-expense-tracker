import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { addExpense, createPeriod, startWithName } from './helpers';

test('an expense is still there after a reload', async ({ page }) => {
  // also catches CSP violations when run against the Docker image
  const errors: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(e.message));
  await startWithName(page, 'Minh');
  await createPeriod(page, 'Tháng 10/2026');
  await addExpense(page, '75', 'Bánh mì');
  await expect(page.locator('.sumc')).toContainText('−75');

  await page.reload();
  await expect(page.locator('.it', { hasText: 'Bánh mì' })).toContainText('−75');
  await expect(page.locator('.hd')).toContainText('Tháng 10/2026');
  await page.getByRole('button', { name: 'Mục tiêu' }).click();
  await page.getByRole('button', { name: 'Thống kê' }).click();
  await expect(page.locator('.ring-center')).toContainText('75');
  expect(errors).toEqual([]);
});

test('switching to another app and back: changes are still saved (plan §4.5)', async ({ page }) => {
  /** Pretend the app goes to the background or comes back, as on a phone */
  const setVisible = (visible: boolean) =>
    page.evaluate((v) => {
      Object.defineProperty(document, 'visibilityState', { value: v ? 'visible' : 'hidden', configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    }, visible);
  await startWithName(page, 'Minh');
  await createPeriod(page, 'Tháng 10/2026');
  await addExpense(page, '75', 'Bánh mì');
  await setVisible(false); // the connection is closed here
  await setVisible(true);
  await addExpense(page, '20', 'Cà phê'); // saved on a fresh connection
  await page.reload();
  await expect(page.locator('.it', { hasText: 'Bánh mì' })).toContainText('−75');
  await expect(page.locator('.it', { hasText: 'Cà phê' })).toContainText('−20');
});

test('Xuất dữ liệu downloads a valid file and shows the date', async ({ page }) => {
  // Desktop path (download link): no share sheet in the test browser
  await page.addInitScript(() => { Object.defineProperty(navigator, 'canShare', { value: undefined }); });
  await startWithName(page, 'Lan');
  await createPeriod(page, 'Tháng 10/2026');
  await addExpense(page, '120', 'Cà phê');
  await page.getByRole('button', { name: 'Cài đặt' }).click();
  await expect(page.getByRole('button', { name: /Xuất dữ liệu/ })).toContainText('—');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /Xuất dữ liệu/ }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/^so-chi-tieu-\d{4}-\d{2}-\d{2}\.json$/);
  const env = JSON.parse(await readFile((await download.path())!, 'utf-8'));
  expect(env).toMatchObject({ format: 'so-chi-tieu', schemaVersion: 1, data: { schemaVersion: 1, userName: 'Lan' } });
  expect(env.exportedAt).toMatch(/\+07:00$/);
  expect(env.data.periods[0].expenses[0]).toMatchObject({ amount: 120, description: 'Cà phê' });

  await expect(page.getByText('Đã xuất dữ liệu')).toBeVisible();
  await expect(page.getByRole('button', { name: /Xuất dữ liệu/ })).toContainText(/\d{2}\/\d{2}\/\d{4}/);
  await page.reload(); // the date is stored outside the data
  await expect(page.getByRole('button', { name: /Xuất dữ liệu/ })).toContainText(/\d{2}\/\d{2}\/\d{4}/);
});

test('a change in one tab shows up in the other', async ({ page, context }) => {
  await startWithName(page, 'Minh');
  const other = await context.newPage();
  await other.goto('./');
  await expect(other.getByText('Xin chào, Minh 👋')).toBeVisible();

  await page.getByRole('button', { name: 'Đổi tên' }).click();
  await page.locator('.sheet input.input').fill('Minh Anh');
  await page.getByRole('button', { name: 'Lưu' }).click();

  await expect(other.getByText('Xin chào, Minh Anh 👋')).toBeVisible();
});
