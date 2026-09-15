import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test, type Locator } from '@playwright/test';
import ts from 'typescript';

const homePath = '/portfolio/';
const fieldSelector = 'canvas[data-signal-canvas]';

// Source: immutable senad-d/portfolio revision 71cf24c. Its compiled layout
// script matches the downloaded live MainLayout...Fz3Eq8Yz.js after identifier
// normalization. These expectations replace the reconstructed 48px treatment.
const liveBackground =
  'radial-gradient(1400px 900px at 85% -20%, rgba(139, 92, 246, 0.15), rgba(0, 0, 0, 0) 60%), ' +
  'radial-gradient(1000px 700px at -15% 8%, rgba(34, 211, 238, 0.09), rgba(0, 0, 0, 0) 55%), ' +
  'radial-gradient(900px 640px at 50% 115%, rgba(74, 222, 128, 0.05), rgba(0, 0, 0, 0) 62%), ' +
  'linear-gradient(rgb(3, 4, 9), rgb(7, 11, 22) 55%, rgb(4, 6, 15))';

const image = (field: Locator) =>
  field.evaluate((element) => (element as HTMLCanvasElement).toDataURL());

const starPixels = (field: Locator) =>
  field.evaluate((element) => {
    const canvas = element as HTMLCanvasElement;
    const pixels = canvas
      .getContext('2d')!
      .getImageData(0, 0, canvas.width, canvas.height).data;
    let visible = 0;
    for (let index = 3; index < pixels.length; index += 4) {
      if (pixels[index] > 36) visible++;
    }
    return { visible, total: canvas.width * canvas.height };
  });

test('retains the exact immutable starfield source, not a reconstruction', () => {
  const source = readFileSync('src/layouts/MainLayout.astro', 'utf8');
  const start = source.indexOf('        // ── Canvas starfield');
  const end = source.indexOf('        if (navLinks.length === 0)', start);
  expect(start).toBeGreaterThan(0);
  expect(end).toBeGreaterThan(start);
  // Ignore only comments/whitespace so the normal formatter remains safe.
  const scanner = ts.createScanner(
    ts.ScriptTarget.Latest,
    true,
    ts.LanguageVariant.Standard,
    source.slice(start, end),
  );
  const tokens: string[] = [];
  while (scanner.scan() !== ts.SyntaxKind.EndOfFileToken) {
    tokens.push(scanner.getTokenText());
  }
  expect(createHash('sha256').update(tokens.join('\0')).digest('hex')).toBe(
    'e3995483c7f0ca7508b621c9f7ff13ac59ae95d3c6834317c31409c9f421a742',
  );
});

test('matches the live gradient backdrop and masked 56px grid', async ({
  page,
}) => {
  await page.goto(homePath);
  await expect(page.locator('body')).toHaveCSS(
    'background-image',
    liveBackground,
  );
  const grid = await page.locator('body').evaluate((element) => {
    const style = getComputedStyle(element, '::before');
    return {
      size: style.backgroundSize,
      image: style.backgroundImage,
      mask: style.maskImage,
      pointerEvents: style.pointerEvents,
      zIndex: style.zIndex,
    };
  });
  expect(grid).toEqual({
    size: '56px 56px, 56px 56px',
    image:
      'linear-gradient(rgba(56, 80, 130, 0.09) 1px, rgba(0, 0, 0, 0) 1px), ' +
      'linear-gradient(90deg, rgba(56, 80, 130, 0.09) 1px, rgba(0, 0, 0, 0) 1px)',
    mask: 'linear-gradient(rgb(0, 0, 0) 0%, rgb(0, 0, 0) 92%, rgba(0, 0, 0, 0) 100%)',
    pointerEvents: 'none',
    zIndex: '-2',
  });
});

test('keeps sparse viewport-sized stars behind keyboard-usable content', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto(homePath);
  const field = page.locator(fieldSelector);
  await expect(page.locator('canvas')).toHaveCount(1);
  await expect(field).toBeVisible();
  await expect(field).toHaveAttribute('aria-hidden', 'true');
  await expect(field).toHaveCSS('pointer-events', 'none');
  await expect(field).toHaveCSS('position', 'fixed');
  await expect(field).toHaveCSS('z-index', '-1');
  const viewport = page.viewportSize()!;
  await expect(field).toHaveCSS('width', `${viewport.width}px`);
  await expect(field).toHaveCSS('height', `${viewport.height}px`);
  await expect(field).toHaveCSS(
    'opacity',
    viewport.width <= 640 ? '0.75' : '1',
  );
  await expect
    .poll(async () => (await starPixels(field)).visible)
    .toBeGreaterThan(35);
  const pixels = await starPixels(field);
  expect(pixels.visible / pixels.total).toBeLessThan(0.01);

  const projects = page.getByRole('link', {
    name: 'View projects',
    exact: true,
  });
  await projects.focus();
  await expect(projects).toBeFocused();
  await expect(projects).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator('[data-site-header]')).toBeVisible();
  expect(errors).toEqual([]);
});

test('twinkles at rest and changes the field on scroll', async ({ page }) => {
  await page.goto(homePath);
  const field = page.locator(fieldSelector);
  await expect
    .poll(async () => (await starPixels(field)).visible)
    .toBeGreaterThan(35);
  const firstFrame = await image(field);
  await expect.poll(() => image(field)).not.toBe(firstFrame);
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(900);
  const scrolledFrame = await image(field);
  expect(scrolledFrame).not.toBe(firstFrame);
  await expect
    .poll(async () => (await starPixels(field)).visible)
    .toBeGreaterThan(35);
});

test('reduced motion keeps stars static and pointer input adds no effect', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(homePath);
  const field = page.locator(fieldSelector);
  await expect
    .poll(async () => (await starPixels(field)).visible)
    .toBeGreaterThan(35);
  const firstFrame = await image(field);
  await page.mouse.move(120, 160);
  await page.mouse.move(320, 280, { steps: 10 });
  await page.waitForTimeout(300);
  expect(await image(field)).toBe(firstFrame);
  await expect(page.locator('canvas')).toHaveCount(1);
});

test('no JavaScript retains the live CSS backdrop and usable links', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}${homePath}`);
    // The original canvas is empty (not hidden) without JavaScript.
    expect((await starPixels(page.locator(fieldSelector))).visible).toBe(0);
    await expect(page.locator('body')).toHaveCSS(
      'background-image',
      liveBackground,
    );
    await page
      .getByRole('link', { name: 'View projects', exact: true })
      .click();
    await expect(page).toHaveURL(/#projects$/);
  } finally {
    await context.close();
  }
});
