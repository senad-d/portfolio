import { expect, test } from '@playwright/test';

const homePath = '/portfolio/';

test('loads homepage and primary sections', async ({ page }) => {
  await page.goto(homePath);

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /Building reliable cloud platforms with practical automation/i,
    }),
  ).toBeVisible();

  await expect(page.locator('#skills')).toBeVisible();
  await expect(page.locator('#projects')).toBeVisible();
  await expect(page.locator('#experience')).toBeVisible();
  await expect(page.locator('#certifications')).toBeVisible();
  await expect(page.locator('#about')).toBeVisible();
  await expect(page.locator('#contact')).toBeVisible();
});

test('keeps sticky header visible while scrolling', async ({ page }) => {
  await page.goto(homePath);

  const header = page.locator('.site-header');

  await expect(header).toBeVisible();
  await expect(header).toHaveCSS('position', 'fixed');

  const topBefore = await header.evaluate((element) =>
    Math.round(element.getBoundingClientRect().top),
  );

  await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
  });

  const topAfter = await header.evaluate((element) =>
    Math.round(element.getBoundingClientRect().top),
  );

  expect(Math.abs(topAfter - topBefore)).toBeLessThanOrEqual(1);
});

test('uses hamburger menu for navigation on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(homePath);

  const navToggle = page.locator('[data-nav-toggle]');

  await expect(navToggle).toBeVisible();
  await expect(navToggle).toHaveAttribute('aria-expanded', 'false');

  await navToggle.click();

  await expect(navToggle).toHaveAttribute('aria-expanded', 'true');

  await page.locator('[data-nav-link][href="#projects"]').click();

  await expect(page).toHaveURL(/\/portfolio\/#projects$/);
  await expect(navToggle).toHaveAttribute('aria-expanded', 'false');
});

test('anchor navigation lands with visible heading under sticky header', async ({
  page,
}) => {
  await page.goto(homePath);

  const navToggle = page.locator('[data-nav-toggle]');

  if (await navToggle.isVisible()) {
    await navToggle.click();
  }

  await page.locator('[data-nav-link][href="#projects"]').click();

  await expect(page).toHaveURL(/\/portfolio\/#projects$/);
  await expect(page.locator('#projects-title')).toBeVisible();

  await expect
    .poll(
      async () =>
        page.evaluate(() => {
          const heading = document.getElementById('projects-title');

          if (!(heading instanceof HTMLElement)) {
            return -1;
          }

          return heading.getBoundingClientRect().top;
        }),
      { timeout: 4_000 },
    )
    .toBeLessThanOrEqual(120);

  const anchorPosition = await page.evaluate(() => {
    const header = document.querySelector('.site-header');
    const heading = document.getElementById('projects-title');

    if (!(header instanceof HTMLElement) || !(heading instanceof HTMLElement)) {
      return { headerBottom: -1, headingTop: -1, gapFromHeader: -1 };
    }

    const headerBottom = header.getBoundingClientRect().bottom;
    const headingTop = heading.getBoundingClientRect().top;

    return {
      headerBottom,
      headingTop,
      gapFromHeader: headingTop - headerBottom,
    };
  });

  expect(anchorPosition.headingTop).toBeGreaterThanOrEqual(50);
  expect(anchorPosition.headingTop).toBeLessThanOrEqual(120);
  expect(anchorPosition.gapFromHeader).toBeGreaterThanOrEqual(0);
  expect(anchorPosition.gapFromHeader).toBeLessThanOrEqual(56);
});

test('projects filter updates visible cards by lane', async ({ page }) => {
  await page.goto(homePath);

  const cards = page.locator('[data-project-item]');
  await expect(cards.first()).toBeVisible();

  await page.locator('[data-filter-trigger]').click();
  await page.getByRole('radio', { name: 'Personal' }).check();

  const visibleCards = page.locator('[data-project-item]:not([hidden])');
  const visibleCount = await visibleCards.count();

  expect(visibleCount).toBeGreaterThan(0);

  const allVisibleCardsArePersonal = await visibleCards.evaluateAll((items) =>
    items.every(
      (item) => item.getAttribute('data-project-lane') === 'personal',
    ),
  );

  expect(allVisibleCardsArePersonal).toBe(true);

  await expect(page.locator('[data-filter-status]')).toContainText(
    /showing \d+ personal project/i,
  );
});

test('projects can be filtered by one or multiple stack options', async ({
  page,
}) => {
  await page.goto(homePath);

  const allCards = page.locator('[data-project-item]');
  const visibleCards = page.locator('[data-project-item]:not([hidden])');
  const totalCardCount = await allCards.count();

  await page.locator('[data-filter-trigger]').click();

  const mendixFilter = page.getByRole('checkbox', { name: 'Mendix' });
  const terraformFilter = page.getByRole('checkbox', { name: 'Terraform' });

  await mendixFilter.check();

  await expect(visibleCards).toHaveCount(1);

  const onlyVisibleCardContainsMendix = await visibleCards
    .first()
    .locator('.project-card-stack .pill-chip')
    .evaluateAll((items) =>
      items.some((item) => (item.textContent ?? '').trim() === 'Mendix'),
    );

  expect(onlyVisibleCardContainsMendix).toBe(true);

  await terraformFilter.check();

  const visibleCountWithTwoFilters = await visibleCards.count();

  expect(visibleCountWithTwoFilters).toBeGreaterThanOrEqual(1);

  const allVisibleCardsMatchSelectedStacks = await visibleCards.evaluateAll(
    (items) =>
      items.every((item) => {
        const stackValues = (item.getAttribute('data-project-stacks') ?? '')
          .split('|')
          .filter((value) => value.length > 0);

        return (
          stackValues.includes('mendix') || stackValues.includes('terraform')
        );
      }),
  );

  expect(allVisibleCardsMatchSelectedStacks).toBe(true);

  await page.locator('[data-stack-clear]').click();

  await expect(mendixFilter).not.toBeChecked();
  await expect(terraformFilter).not.toBeChecked();
  await expect(visibleCards).toHaveCount(totalCardCount);
});

test('project details remain open until user closes them', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(homePath);

  const cards = page.locator('[data-project-item]');
  const detailsPanels = page.locator('[data-project-details]');
  const detailsPanelCount = await detailsPanels.count();

  expect(detailsPanelCount).toBeGreaterThan(1);

  await detailsPanels.nth(0).locator('summary').click();
  await detailsPanels.nth(1).locator('summary').click();

  await expect(cards.nth(0)).toHaveClass(/is-expanded/);
  await expect(cards.nth(1)).toHaveClass(/is-expanded/);

  const firstPanelIsOpenAfterOpeningSecond = await detailsPanels
    .nth(0)
    .evaluate((element) => (element as HTMLDetailsElement).open);

  expect(firstPanelIsOpenAfterOpeningSecond).toBe(true);

  await detailsPanels.nth(0).locator('summary').click();

  await expect(cards.nth(0)).not.toHaveClass(/is-expanded/);
  await expect(cards.nth(1)).toHaveClass(/is-expanded/);
});

test('project details show problem approach and result narrative', async ({
  page,
}) => {
  await page.goto(homePath);

  const firstCard = page.locator('[data-project-item]').first();
  await firstCard.locator('[data-project-details] summary').click();

  const narrativeTerms = firstCard.locator('.project-story-term');
  await expect(narrativeTerms).toHaveText(['Problem', 'Approach', 'Result']);

  const narrativeSectionsHaveText = await firstCard
    .locator('.project-story-text')
    .evaluateAll((items) =>
      items.every((item) => (item.textContent ?? '').trim().length > 0),
    );

  expect(narrativeSectionsHaveText).toBe(true);
});

test('contact links are present and correctly configured', async ({ page }) => {
  await page.goto(homePath);

  await expect(page.getByRole('link', { name: 'Email' })).toHaveAttribute(
    'href',
    /^mailto:/,
  );

  await expect(page.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
    'href',
    /github\.com\/senad-d/,
  );
  await expect(page.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
    'target',
    '_blank',
  );

  await expect(page.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
    'href',
    /linkedin\.com\/in\/senad-dizdarevic-devops/,
  );
  await expect(page.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
    'target',
    '_blank',
  );
});
