import { expect, test } from '@playwright/test';

const homePath = '/portfolio/';

test('tablet menu keeps all seven navigation links reachable', async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(homePath);
  const toggle = page.getByRole('button', { name: 'Open navigation menu' });
  await expect(toggle).toBeVisible();
  await toggle.click();
  const links = page.locator('[data-nav-link]');
  await expect(links).toHaveCount(7);
  for (const link of await links.all()) {
    await expect(link).toBeInViewport({ ratio: 1 });
  }
  await links.filter({ hasText: 'Contact' }).click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/#contact$/);
});

test('projects use the chronological full-collection layout', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(homePath);

  const cards = page.locator('[data-project-item]');
  const totalCount = await cards.count();

  await expect(page.locator('[data-project-item]:visible')).toHaveCount(
    totalCount,
  );
  await expect(
    page.getByRole('button', { name: /Show all projects/ }),
  ).toHaveCount(0);
  await expect(cards.first().getByRole('heading', { level: 3 })).toHaveText(
    'DrawMe Natural-Language Diagramming for Pi',
  );
  await expect(cards.first().locator('.project-card-outcome')).toHaveCount(0);
  await expect(cards.first().locator('.project-card-link')).toHaveCount(0);
  await expect(cards.first().locator('details')).not.toHaveAttribute(
    'open',
    '',
  );

  const firstCardWidth = await cards
    .first()
    .evaluate((card) => Math.round(card.getBoundingClientRect().width));
  const listWidth = await page
    .locator('[data-project-list]')
    .evaluate((list) => Math.round(list.getBoundingClientRect().width));
  expect(firstCardWidth).toBe(listWidth);
});

test('filters search the collection and clear back to all projects', async ({
  page,
}) => {
  await page.goto(homePath);
  const cards = page.locator('[data-project-item]');
  const visibleCards = page.locator('[data-project-item]:visible');
  const totalCount = await cards.count();

  await page.getByRole('radio', { name: 'Professional' }).check();
  await expect(visibleCards).toHaveCount(10);
  await page.getByRole('radio', { name: 'All', exact: true }).check();
  await page.getByRole('button', { name: 'Stack', exact: true }).click();
  await page.locator('#stack-filter-mendix').check();
  await expect(visibleCards).toHaveCount(1);
  await page.getByRole('radio', { name: 'Personal', exact: true }).check();
  await expect(visibleCards).toHaveCount(0);
  await expect(page.locator('[data-project-empty]')).toBeVisible();
  await page.getByRole('radio', { name: 'All', exact: true }).check();
  await page.locator('[data-stack-clear]').click();
  await expect(visibleCards).toHaveCount(totalCount);
  await expect(page.locator('[data-filter-status]')).toContainText(
    `Showing ${totalCount} projects`,
  );
});

test('mobile filters have 44px targets and only show a nonempty stack badge', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto(homePath);
  const badge = page.locator('[data-filter-summary-label]');
  await expect(badge).toBeHidden();
  for (const control of await page
    .locator('.lane-tab, [data-filter-trigger]')
    .all()) {
    const box = await control.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
    expect(box?.width).toBeGreaterThanOrEqual(44);
  }
  await page.locator('[data-filter-trigger]').click();
  await page.locator('#stack-filter-terraform').check();
  await expect(badge).toHaveText('1');
  await expect(badge).toBeVisible();
  await page.locator('[data-stack-clear]').click();
  await expect(badge).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-filter-trigger]')).toBeFocused();
});

test('mobile contact starts with Email and Upwork above the guidance', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${homePath}#contact`);
  const links = page.locator('.contact-links a');
  await expect(links.nth(0)).toContainText('Email');
  await expect(links.nth(1)).toContainText('Upwork');
  await expect(links.nth(0)).toBeInViewport({ ratio: 1 });
  await expect(links.nth(1)).toBeInViewport({ ratio: 1 });
  expect(
    await page.locator('#contact').evaluate((section) => {
      const nav = section.querySelector('nav')!;
      const guidance = section.querySelector('article')!;
      return Boolean(
        nav.compareDocumentPosition(guidance) &
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    }),
  ).toBe(true);
});

test('hero shows the requested deployment terminal transcript and looping cursor', async ({
  page,
}) => {
  await page.goto(homePath);

  const terminalLines = page.locator(
    '[data-hero-terminal] [data-terminal-line]',
  );

  await expect(terminalLines).toHaveText([
    'senad@cloud: ~/portfolio',
    '❯whoami',
    'senad — systems & automation engineer',
    '❯terraform apply -auto-approve',
    'Apply complete! Resources: 128 added, 0 changed, 0 destroyed.',
    '❯./deploy.sh --env production',
    '✔ pipeline green · zero-downtime release',
    '❯▊',
  ]);

  await expect(page.locator('.terminal-cursor')).toHaveCSS(
    'animation-iteration-count',
    'infinite',
  );

  const outcomes = page.locator('[data-hero-outcomes] > li');
  await expect(outcomes.locator('h2')).toHaveText([
    'Hiring teams',
    'Freelance clients',
    'Shared outcome',
  ]);
  await expect(outcomes.locator('p')).toHaveText([
    'End-to-end platform ownership across architecture, delivery, and day-2 operations.',
    'Production-ready foundations with practical automation and clear, transparent delivery communication.',
    'Faster releases, fewer operational surprises, and maintainable cloud systems.',
  ]);
});

test('footer closes the portfolio session with a successful exit status', async ({
  page,
}) => {
  await page.goto(homePath);

  const footerTerminal = page.locator('[data-footer-terminal]');

  await expect(footerTerminal).toHaveClass(/terminal-window/);
  await expect(footerTerminal.locator('.terminal-dot')).toHaveCount(3);
  await expect(footerTerminal.locator('.terminal-title')).toHaveText(
    'senad@cloud: ~/portfolio',
  );
  await expect(footerTerminal.locator('[data-terminal-line]')).toHaveCount(2);
  await expect(footerTerminal.locator('.site-footer-copyright')).toHaveText(
    `© ${new Date().getFullYear()} Senad Dizdarevic`,
  );
  await expect(footerTerminal.locator('.terminal-prompt')).toHaveText('❯');
  await expect(footerTerminal.locator('.terminal-cmd')).toHaveText('exit 0');
  await expect(footerTerminal.locator('a')).toHaveCount(0);
});

test('project card spotlight starts dim, brightens smoothly for a fine pointer, and stays off for touch', async ({
  page,
  isMobile,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(homePath);

  const card = page.locator('[data-project-item]:visible').first();
  await card.scrollIntoViewIfNeeded();
  const bounds = await card.boundingBox();

  expect(bounds).not.toBeNull();

  const restingSpotlight = await card.evaluate((element) => {
    const styles = getComputedStyle(element, '::before');

    return {
      opacity: Number(styles.opacity),
      transitionDuration: styles.transitionDuration,
    };
  });

  if (isMobile) {
    expect(restingSpotlight.opacity).toBe(0);
    await page.touchscreen.tap(
      Math.round(bounds!.x + bounds!.width / 2),
      Math.round(bounds!.y + bounds!.height / 2),
    );
    await expect(card).not.toHaveAttribute('data-pointer-active', '');
    return;
  }

  expect(restingSpotlight.opacity).toBeGreaterThan(0);
  expect(restingSpotlight.opacity).toBeLessThan(0.2);
  expect(restingSpotlight.transitionDuration.split(', ')).toEqual([
    '0.25s',
    '0.25s',
  ]);

  const firstPoint = {
    x: Math.round(bounds!.x + bounds!.width * 0.25),
    y: Math.round(bounds!.y + bounds!.height * 0.35),
  };
  const secondPoint = {
    x: Math.round(bounds!.x + bounds!.width * 0.75),
    y: Math.round(bounds!.y + bounds!.height * 0.65),
  };

  await page.mouse.move(firstPoint.x, firstPoint.y);
  await expect(card).toHaveAttribute('data-pointer-active', '');

  await expect
    .poll(() =>
      card.evaluate((element) =>
        Number(getComputedStyle(element, '::before').opacity),
      ),
    )
    .toBeGreaterThan(0.85);

  const firstPosition = await card.evaluate((element) => ({
    x: element.style.getPropertyValue('--project-pointer-x'),
    y: element.style.getPropertyValue('--project-pointer-y'),
  }));

  expect(firstPosition.x).not.toBe('');
  expect(firstPosition.y).not.toBe('');

  await page.mouse.move(secondPoint.x, secondPoint.y);
  await expect
    .poll(() =>
      card.evaluate((element) => ({
        x: element.style.getPropertyValue('--project-pointer-x'),
        y: element.style.getPropertyValue('--project-pointer-y'),
      })),
    )
    .not.toEqual({ x: firstPosition.x, y: firstPosition.y });

  await page.mouse.move(1, 1);
  await expect(card).not.toHaveAttribute('data-pointer-active', '');
});

test('project glow grows smoothly without delay and shrinks on exit', async ({
  page,
  isMobile,
}, testInfo) => {
  test.skip(isMobile, 'Hover timing requires a fine mouse pointer');
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto(homePath);
  const card = page.locator('[data-project-item]:visible').first();
  await card.scrollIntoViewIfNeeded();
  await page.mouse.move(1, 1);
  await expect(card).toHaveClass(/is-visible/);
  await page.waitForTimeout(500); // Let the existing scroll reveal settle.
  const bounds = (await card.boundingBox())!;

  await card.evaluate((element) => {
    element.addEventListener('pointerenter', () => {
      const start = performance.now();
      const samples: { ms: number; opacity: number; radius: number }[] = [];
      const sample = () => {
        const ms = performance.now() - start;
        samples.push({
          ms,
          opacity: Number(getComputedStyle(element, '::before').opacity),
          radius: parseFloat(
            getComputedStyle(element, '::before').getPropertyValue(
              '--project-glow-radius',
            ),
          ),
        });
        if (ms < 550) requestAnimationFrame(sample);
        else element.setAttribute('data-glow-samples', JSON.stringify(samples));
      };
      sample();
    });
  });

  const hover = () =>
    page.mouse.move(bounds.x + bounds.width / 2, bounds.y + 80);
  const samples = async () => {
    await expect(card).toHaveAttribute('data-glow-samples', /\[/);
    return JSON.parse((await card.getAttribute('data-glow-samples'))!) as {
      ms: number;
      opacity: number;
      radius: number;
    }[];
  };

  await testInfo.attach('glow-resting', {
    path: await card
      .screenshot({ path: testInfo.outputPath('glow-resting.png') })
      .then(() => testInfo.outputPath('glow-resting.png')),
    contentType: 'image/png',
  });
  await hover();
  await page.waitForTimeout(60);
  const growingPath = testInfo.outputPath('glow-growing.png');
  await card.screenshot({ path: growingPath });
  await testInfo.attach('glow-growing', {
    path: growingPath,
    contentType: 'image/png',
  });
  const ramp = await samples();
  await testInfo.attach('glow-bright', {
    path: await card
      .screenshot({ path: testInfo.outputPath('glow-bright.png') })
      .then(() => testInfo.outputPath('glow-bright.png')),
    contentType: 'image/png',
  });
  await testInfo.attach('rendered-glow-timing', {
    body: JSON.stringify(ramp, null, 2),
    contentType: 'application/json',
  });
  expect(ramp[0].radius).toBeCloseTo(160, 0);
  const rising = ramp.filter(({ ms }) => ms > 30 && ms < 200);
  expect(rising.length).toBeGreaterThan(3);
  for (const { opacity, radius } of rising) {
    expect(opacity).toBeGreaterThan(0.1);
    expect(opacity).toBeLessThan(0.9);
    expect(radius).toBeGreaterThan(160);
    expect(radius).toBeLessThan(416);
  }
  expect(rising.at(-1)!.radius - rising[0].radius).toBeGreaterThan(100);
  expect(ramp.at(-1)!.opacity).toBeCloseTo(0.9, 2);
  expect(ramp.at(-1)!.radius).toBeCloseTo(416, 0);

  await page.mouse.move(1, 1);
  expect(
    await card.evaluate(
      (element) => getComputedStyle(element, '::before').transitionDelay,
    ),
  ).toBe('0s, 0s');
  await expect
    .poll(() =>
      card.evaluate((element) =>
        Number(getComputedStyle(element, '::before').opacity),
      ),
    )
    .toBeCloseTo(0.1, 2);
  await expect
    .poll(() =>
      card.evaluate((element) =>
        parseFloat(
          getComputedStyle(element, '::before').getPropertyValue(
            '--project-glow-radius',
          ),
        ),
      ),
    )
    .toBeCloseTo(160, 0);
  expect(errors).toEqual([]);
});

test('project glow does not activate with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(homePath);
  const card = page.locator('[data-project-item]:visible').first();
  await card.scrollIntoViewIfNeeded();
  const opacity = await card.evaluate(
    (element) => getComputedStyle(element, '::before').opacity,
  );
  await card.hover();
  await page.waitForTimeout(550);
  await expect(card).not.toHaveAttribute('data-pointer-active', '');
  expect(
    await card.evaluate(
      (element) => getComputedStyle(element, '::before').opacity,
    ),
  ).toBe(opacity);
});

test('without JavaScript the full project collection and native details remain usable', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}${homePath}`);
  const cards = page.locator('[data-project-item]');
  await expect(page.locator('[data-project-item]:visible')).toHaveCount(
    await cards.count(),
  );
  await cards.first().locator('summary').click();
  await expect(cards.first().locator('details')).toHaveAttribute('open', '');
  await context.close();
});
