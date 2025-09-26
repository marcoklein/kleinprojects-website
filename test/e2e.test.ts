import { test, expect } from '@playwright/test';

test('test', async ({ page, baseURL }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Kleinprojects' }).click();
  await expect(page).toHaveURL('/');

  await page.getByRole('link', { name: 'Projects', exact: true }).click();
  await expect(page).toHaveURL('/projects/');

  await page.getByRole('link', { name: 'Blog' }).click();
  await expect(page).toHaveURL('/blog/');

  await page.getByRole('link', { name: 'About me' }).click();
  await expect(page).toHaveURL('/about/');
});
