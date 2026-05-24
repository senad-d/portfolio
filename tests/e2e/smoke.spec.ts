import { expect, test, type Page } from '@playwright/test';

const homePath = '/portfolio/';

const positionFilterTriggerAtViewportBottom = async (page: Page) => {
  await page.evaluate(() => {
    const trigger = document.querySelector('[data-filter-trigger]');

    if (!(trigger instanceof HTMLElement)) {
      return;
    }

    document.documentElement.style.scrollBehavior = 'auto';

    const triggerBounds = trigger.getBoundingClientRect();
    const targetScrollY =
      window.scrollY + triggerBounds.bottom - window.innerHeight;

    window.scrollTo(0, Math.max(0, targetScrollY));
  });
};

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

for (const viewport of [
  { width: 320, height: 640 },
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
]) {
  test(`maintains core layout baseline for viewport ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto(homePath);

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );

    expect(hasHorizontalOverflow).toBe(false);

    await expect(page.locator('.site-header')).toBeVisible();
    await expect(page.locator('[data-filter-trigger]')).toHaveCount(1);
  });
}

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

test('keeps nav active item and aria-current aligned for anchor clicks', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(homePath);

  const navTargets = [
    '#home',
    '#projects',
    '#experience',
    '#skills',
    '#certifications',
    '#about',
    '#contact',
  ] as const;

  for (const target of navTargets) {
    await page.locator(`[data-nav-link][href="${target}"]`).click();

    await expect(page).toHaveURL(new RegExp(`\\/portfolio\\/${target}$`));

    await expect(page.locator(`[data-nav-link][href="${target}"]`)).toHaveClass(
      /is-active/,
    );
    await expect(page.locator(`[data-nav-link][href="${target}"]`)).toHaveAttribute(
      'aria-current',
      'true',
    );

    await expect(page.locator('[data-nav-link][aria-current="true"]')).toHaveCount(
      1,
    );
  }
});

test('sets correct active nav item for direct hash loads', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });

  const navTargets = [
    '#home',
    '#projects',
    '#experience',
    '#skills',
    '#certifications',
    '#about',
    '#contact',
  ] as const;

  for (const target of navTargets) {
    await page.goto(`${homePath}${target}`);

    await expect(page).toHaveURL(new RegExp(`\\/portfolio\\/${target}$`));

    await expect(page.locator(`[data-nav-link][href="${target}"]`)).toHaveClass(
      /is-active/,
    );
    await expect(page.locator(`[data-nav-link][href="${target}"]`)).toHaveAttribute(
      'aria-current',
      'true',
    );

    await expect(page.locator('[data-nav-link][aria-current="true"]')).toHaveCount(
      1,
    );
  }
});

test('keeps active nav state after refresh on deep hash', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });

  await page.goto(homePath);
  await page.locator('[data-nav-link][href="#contact"]').click();

  await expect(page).toHaveURL(/\/portfolio\/#contact$/);
  await page.reload();

  await expect(page).toHaveURL(/\/portfolio\/#contact$/);
  await expect(page.locator('[data-nav-link][href="#contact"]')).toHaveAttribute(
    'aria-current',
    'true',
  );
  await expect(page.locator('[data-nav-link][aria-current="true"]')).toHaveCount(
    1,
  );
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

for (const viewport of [
  { width: 320, height: 640 },
  { width: 375, height: 812 },
]) {
  test(`projects filter opens fully in-view on mobile (${viewport.width}x${viewport.height})`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto(homePath);

    const filterTrigger = page.locator('[data-filter-trigger]');

    await positionFilterTriggerAtViewportBottom(page);

    await expect(filterTrigger).toBeVisible();

    const triggerBottom = await filterTrigger.evaluate((element) =>
      Math.round(element.getBoundingClientRect().bottom),
    );

    expect(triggerBottom).toBeGreaterThanOrEqual(viewport.height - 2);
    expect(triggerBottom).toBeLessThanOrEqual(viewport.height + 2);

    const scrollDeltaOnOpen = await page.evaluate(() => {
      const trigger = document.querySelector('[data-filter-trigger]');

      if (!(trigger instanceof HTMLButtonElement)) {
        return Number.POSITIVE_INFINITY;
      }

      const beforeOpen = window.scrollY;
      trigger.click();

      return Math.abs(window.scrollY - beforeOpen);
    });

    await expect(filterTrigger).toHaveAttribute('aria-expanded', 'true');

    const viewportPlacement = await page.evaluate(() => {
      const menu = document.querySelector('[data-filter-menu]');

      if (!(menu instanceof HTMLElement)) {
        return {
          panelTop: -1,
          panelBottom: -1,
          firstControlTop: -1,
          firstControlBottom: -1,
          viewportHeight: window.innerHeight,
        };
      }

      const panelRect = menu.getBoundingClientRect();
      const firstControl = menu.querySelector(
        'input, button, select, textarea, a[href], [tabindex]:not([tabindex="-1"])',
      );

      let firstControlTop = -1;
      let firstControlBottom = -1;

      if (firstControl instanceof HTMLElement) {
        const firstControlRect = firstControl.getBoundingClientRect();
        firstControlTop = firstControlRect.top;
        firstControlBottom = firstControlRect.bottom;
      }

      return {
        panelTop: panelRect.top,
        panelBottom: panelRect.bottom,
        firstControlTop,
        firstControlBottom,
        viewportHeight: window.innerHeight,
      };
    });

    expect(viewportPlacement.panelTop).toBeGreaterThanOrEqual(0);
    expect(viewportPlacement.panelBottom).toBeLessThanOrEqual(
      viewportPlacement.viewportHeight,
    );
    expect(viewportPlacement.firstControlTop).toBeGreaterThanOrEqual(0);
    expect(viewportPlacement.firstControlBottom).toBeLessThanOrEqual(
      viewportPlacement.viewportHeight,
    );

    expect(scrollDeltaOnOpen).toBeLessThanOrEqual(1);
  });
}

test('projects filter closes with Escape, outside click, and trigger toggle', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(homePath);

  const filterTrigger = page.locator('[data-filter-trigger]');

  await positionFilterTriggerAtViewportBottom(page);

  await expect(filterTrigger).toBeVisible();

  await filterTrigger.focus();
  await page.keyboard.press('Enter');
  await expect(filterTrigger).toHaveAttribute('aria-expanded', 'true');

  await page.keyboard.press('Escape');
  await expect(filterTrigger).toHaveAttribute('aria-expanded', 'false');

  await filterTrigger.click();
  await expect(filterTrigger).toHaveAttribute('aria-expanded', 'true');

  await filterTrigger.click();
  await expect(filterTrigger).toHaveAttribute('aria-expanded', 'false');

  await filterTrigger.click();
  await expect(filterTrigger).toHaveAttribute('aria-expanded', 'true');

  await page.mouse.click(8, 8);
  await expect(filterTrigger).toHaveAttribute('aria-expanded', 'false');
});

test('supports keyboard-only filter flow with predictable focus', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(homePath);

  const filterTrigger = page.locator('[data-filter-trigger]');

  await positionFilterTriggerAtViewportBottom(page);

  await filterTrigger.focus();
  await page.keyboard.press('Enter');

  await expect(filterTrigger).toHaveAttribute('aria-expanded', 'true');

  await page.keyboard.press('Tab');
  await expect(page.getByRole('radio', { name: 'All' })).toBeFocused();

  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio', { name: 'Professional' })).toBeChecked();

  await page.keyboard.press('Escape');
  await expect(filterTrigger).toHaveAttribute('aria-expanded', 'false');
  await expect(filterTrigger).toBeFocused();
});

test('projects filter menu exposes semantic context tied to the trigger', async ({
  page,
}) => {
  await page.goto(homePath);

  const filterTrigger = page.locator('[data-filter-trigger]');
  const filterMenu = page.locator('[data-filter-menu]');

  await expect(filterTrigger).toHaveAttribute('aria-controls', 'projects-filter-menu');
  await expect(filterTrigger).toHaveAttribute('aria-expanded', 'false');
  await expect(filterMenu).toHaveAttribute('role', 'region');
  await expect(filterMenu).toHaveAttribute(
    'aria-labelledby',
    'projects-filter-menu-title',
  );
  await expect(filterMenu).toHaveAttribute(
    'aria-describedby',
    'projects-filter-menu-hint',
  );

  await filterTrigger.click();

  await expect(filterTrigger).toHaveAttribute('aria-expanded', 'true');
  await expect(filterMenu).toBeVisible();
});

test('projects can be filtered by one or multiple stack options', async ({
  page,
}) => {
  await page.goto(homePath);

  const allCards = page.locator('[data-project-item]');
  const visibleCards = page.locator('[data-project-item]:not([hidden])');
  const totalCardCount = await allCards.count();

  await page.locator('[data-filter-trigger]').click();

  const mendixFilter = page.locator('#stack-filter-mendix');
  const terraformFilter = page.locator('#stack-filter-terraform');

  await mendixFilter.check();

  await expect(visibleCards).toHaveCount(1);

  const onlyVisibleCardContainsMendix = await visibleCards
    .first()
    .evaluate((item) =>
      (item.getAttribute('data-project-stacks') ?? '')
        .split('|')
        .filter((value) => value.length > 0)
        .includes('mendix'),
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

test('respects reduced-motion preference for smooth scrolling behavior', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(homePath);

  const scrollBehavior = await page.evaluate(
    () => getComputedStyle(document.documentElement).scrollBehavior,
  );

  expect(scrollBehavior).toBe('auto');
});

test('core interaction flow emits no browser console warnings or errors', async ({
  page,
}) => {
  const consoleIssues: string[] = [];
  const pageErrors: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'warning' || message.type() === 'error') {
      consoleIssues.push(`${message.type()}: ${message.text()}`);
    }
  });

  page.on('pageerror', (error) => {
    pageErrors.push(String(error));
  });

  await page.goto(homePath);

  const navToggle = page.locator('[data-nav-toggle]');

  if (await navToggle.isVisible()) {
    await navToggle.click();
  }

  await page.locator('[data-nav-link][href="#projects"]').click();

  const filterTrigger = page.locator('[data-filter-trigger]');

  await filterTrigger.click();
  await page.getByRole('radio', { name: 'Professional' }).check();
  await filterTrigger.click();

  const firstVisibleSummary = page
    .locator('[data-project-item]:not([hidden]) [data-project-details] summary')
    .first();

  await firstVisibleSummary.click();

  if (await navToggle.isVisible()) {
    await navToggle.click();
  }

  await page.locator('[data-nav-link][href="#contact"]').click();

  expect(consoleIssues).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test('contact links are present and correctly configured', async ({ page }) => {
  await page.goto(homePath);

  await expect(page.getByRole('link', { name: 'Email' })).toHaveAttribute(
    'href',
    /^mailto:/,
  );

  await expect(page.getByRole('link', { name: 'Upwork' })).toHaveAttribute(
    'href',
    /upwork\.com\/freelancers\/~017a10028c45b2150f/,
  );
  await expect(page.getByRole('link', { name: 'Upwork' })).toHaveAttribute(
    'href',
    /utm_source=portfolio/,
  );
  await expect(page.getByRole('link', { name: 'Upwork' })).toHaveAttribute(
    'target',
    '_blank',
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
