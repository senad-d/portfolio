import { expect, test } from '@playwright/test';

const homePath = '/portfolio/';

test('contact section offers professional and full CV downloads', async ({
  page,
  request,
}) => {
  await page.goto(`${homePath}#contact`);

  const links = page.locator('#contact [data-cv-download]');
  await expect(links).toHaveCount(2);
  await expect(links.nth(0)).toContainText('Professional CV');
  await expect(links.nth(1)).toContainText('Full CV');

  const sizes: number[] = [];

  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('download', '');

    const href = await link.getAttribute('href');
    expect(href).toMatch(/^\/portfolio\/cv\/senad-dizdarevic-cv(-full)?\.pdf$/);

    const response = await request.get(href!);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');

    const body = await response.body();
    expect(body.subarray(0, 5).toString()).toBe('%PDF-');
    sizes.push(body.length);
  }

  // The full CV adds the personal lane, so it must carry more content.
  expect(sizes[1]).toBeGreaterThan(sizes[0]);
});

test('clicking a CV card pings its canary token', async ({ page }) => {
  // Stub canarytokens.com so the suite never sends a real alert email.
  const pinged: string[] = [];
  await page.route('**/canarytokens.com/**', async (route) => {
    pinged.push(route.request().url());
    await route.fulfill({ status: 200, body: '' });
  });

  await page.goto(`${homePath}#contact`);

  const links = page.locator('#contact [data-cv-download]');
  await expect(links).toHaveCount(2);

  for (const link of await links.all()) {
    const canary = await link.getAttribute('data-cv-canary');
    expect(canary).toMatch(/^https:\/\/canarytokens\.com\/.+/);

    const download = page.waitForEvent('download');
    await link.click();
    await download;

    await expect.poll(() => pinged).toContain(canary);
  }

  // One ping per click, and each variant has its own token.
  expect(new Set(pinged).size).toBe(2);
  expect(pinged).toHaveLength(2);
});

test('building the CVs leaves the page content intact', async ({ page }) => {
  await page.goto(homePath);

  // Regression: pdfmake mutates list arrays it is given; the page must still
  // render the same experience and impact strings the CV used.
  expect(await page.content()).not.toContain('[object Object]');
  await expect(
    page.locator('#experience .experience-highlights li').first(),
  ).toHaveText(/\S/);
});
