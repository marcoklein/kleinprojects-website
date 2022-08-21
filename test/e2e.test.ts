import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {

  // Go to http://localhost:8080/
  await page.goto('http://localhost:8080/');

  // Click span:has-text("Kleinprojects")
  await page.locator('span:has-text("Kleinprojects")').click();
  await expect(page).toHaveURL('http://localhost:8080/');

  // Click text=Projects >> nth=1
  await page.locator('text=Projects').nth(1).click();
  await expect(page).toHaveURL('http://localhost:8080/projects/');

  // Click text=Blog
  await page.locator('text=Blog').click();
  await expect(page).toHaveURL('http://localhost:8080/blog/');

  // Click text=About Me
  await page.locator('text=About Me').click();
  await expect(page).toHaveURL('http://localhost:8080/about/');

  // Click [aria-label="main navigation"] >> text=GitHub
  const [page1] = await Promise.all([
    page.waitForEvent('popup'),
    page.locator('[aria-label="main navigation"] >> text=GitHub').click()
  ]);

});