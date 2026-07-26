import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('landing page has no automated WCAG A or AA violations', async ({ page }) => {
  await page.goto('./');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();

  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);

  const prohibitedAria = results.incomplete.filter(
    (result) => result.id === 'aria-prohibited-attr',
  );
  expect(prohibitedAria, JSON.stringify(prohibitedAria, null, 2)).toEqual([]);
});
