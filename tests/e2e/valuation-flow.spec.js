import { test, expect } from '@playwright/test';
const url = 'http://localhost:3000/pro-valuation.html';

test('multi-step form generates PDF', async ({ page }) => {
  await page.goto(url);
  // Step 1
  await page.check('#method-multiplier');
  await page.waitForSelector('#next-btn-1:not([disabled])');
  await page.click('#next-btn-1');
  // Step 2
  await page.waitForSelector('#arr');
  await page.fill('#arr', '1000000');
  await page.fill('#mrr', '80000');
  await page.fill('#ltv', '5000');
  await page.fill('#cac', '1000');
  await page.fill('#gross-margin', '80');
  await page.fill('#net-profit', '200000');
  await page.fill('#burn-rate', '50000');
  await page.fill('#runway', '18');
  await page.click('#next-btn-2');
  // Step 3
  await page.fill('#revenue-growth-yoy', '30');
  await page.fill('#revenue-growth-mom', '5');
  await page.fill('#customer-churn', '4');
  await page.fill('#revenue-churn', '3');
  await page.click('#next-btn-3');
  // Step 4
  await page.fill('#active-customers', '2000');
  await page.fill('#monthly-active-users', '5000');
  await page.fill('#retention-rate', '85');
  await page.fill('#nps', '60');
  await page.selectOption('#customer-segment', 'small-business');
  await page.selectOption('#buyer-type', 'investors');
  await page.click('#next-btn-4');
  // Step 5
  await page.selectOption('#product-market-fit', 'strong');
  await page.selectOption('#proprietary-tech', 'both');
  await page.selectOption('#code-quality', 'internal-review');
  await page.selectOption('#scalable-infrastructure', 'yes');
  await page.selectOption('#feature-release-frequency', 'monthly');
  await page.selectOption('#security-compliance', 'gdpr');
  await page.click('#next-btn-5');
  // Step 6
  await page.fill('#fte', '20');
  await page.fill('#key-staff', '5');
  await page.fill('#turnover-rate', '5');
  await page.fill('#eng-sales-ratio', '1');
  await page.fill('#support-tickets', '10');
  await page.fill('#support-rating', '8');
  await page.fill('#headcount-growth', '10');
  await page.click('#next-btn-6');
  // Step 7
  await page.selectOption('#legal-entity', 'llc');
  await page.selectOption('#ip-ownership', 'fully-owned');
  await page.fill('#contract-length', '12');
  await page.fill('#contract-value', '1000');
  await page.selectOption('#vendor-lockin', 'none');
  await page.selectOption('#legal-issues', 'none');
  await page.selectOption('#data-privacy', 'full');
  await page.selectOption('#cyber-insurance', 'yes');
  await page.fill('#debt-level', '0');
  await page.click('#next-btn-7');
  await page.waitForTimeout(1000);
  const downloadPromise = page.waitForEvent('download');
  await page.click('#download-report');
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.pdf$/);
});
