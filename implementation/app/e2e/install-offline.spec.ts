import { expect, test } from '@playwright/test';
import { startWithName } from './helpers';

test('the service worker serves the app with the network off', async ({ page, context }) => {
  await page.goto('./');
  // wait until the service worker controls the page (precache done)
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise((r) => navigator.serviceWorker.addEventListener('controllerchange', r, { once: true }));
    }
  });
  await startWithName(page, 'Minh');

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText('Xin chào, Minh 👋')).toBeVisible();
  // the bundled font loads offline too
  expect(await page.evaluate(() => document.fonts.check("16px 'Be Vietnam Pro'"))).toBe(true);
  await context.setOffline(false);
});

test('the manifest makes the app installable', async ({ page }) => {
  await page.goto('./');
  const href = await page.locator('link[rel="manifest"]').getAttribute('href');
  const res = await page.request.get(href!);
  expect(res.ok()).toBe(true);
  expect(await res.json()).toMatchObject({ name: 'Sổ chi tiêu', display: 'standalone', lang: 'vi' });
});
