import { expect, type Page } from '@playwright/test';

/** Fresh app → 1.0 Bắt đầu mới → 1.1 name → 2.0 */
export async function startWithName(page: Page, name: string) {
  await page.goto('./');
  await page.getByRole('button', { name: 'Bắt đầu mới' }).click();
  await page.locator('input.input').fill(name);
  await page.getByRole('button', { name: 'Tiếp tục' }).click();
  await expect(page.getByText(`Xin chào, ${name} 👋`)).toBeVisible();
}

/** 2.0 → 4.0 → 4.1 Tạo kỳ (today's start) → 5.0 of the new period */
export async function createPeriod(page: Page, name: string) {
  await page.getByRole('button', { name: /Ghi chép/ }).click();
  await page.getByRole('button', { name: '＋ Tạo kỳ mới' }).click();
  await page.locator('.sheet input.input').fill(name);
  await page.getByRole('button', { name: 'Tạo kỳ', exact: true }).click();
  await expect(page.locator('.hd')).toContainText(name);
}

/** 5.0 Chi tiêu → ＋ → amount + description → Lưu */
export async function addExpense(page: Page, amount: string, description: string) {
  await page.locator('.fab').click();
  await page.locator('.sheet .amt-box input').fill(amount);
  await page.locator('.sheet .field input.input').first().fill(description);
  await page.locator('.sheet .btn.pri').click();
  await expect(page.locator('.it', { hasText: description })).toBeVisible();
  await expect(page.locator('.sheet')).toHaveCount(0); // closing animation done, so another sheet can open
}
