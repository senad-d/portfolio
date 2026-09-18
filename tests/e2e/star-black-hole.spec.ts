import { expect, test, type Page } from '@playwright/test';

const fieldSelector = 'canvas[data-signal-canvas]';
type Point = { x: number; y: number };

// Seed only randomness and control time, not the rendering or pointer behavior.
const prepare = async (page: Page) => {
  await page.addInitScript(() => {
    let seed = 27;
    Math.random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
  });
  await page.clock.install();
  await page.goto('/portfolio/');
  await page.clock.pauseAt(new Date(Date.now() + 1000));
};

const sampleStars = (page: Page) =>
  page.locator(fieldSelector).evaluate((element) => {
    const canvas = element as HTMLCanvasElement;
    const scale = canvas.width / innerWidth;
    const { data } = canvas
      .getContext('2d')!
      .getImageData(0, 0, canvas.width, canvas.height);
    const points: Point[] = [];
    for (let y = Math.ceil(70 * scale); y < canvas.height - 70 * scale; y++) {
      for (let x = Math.ceil(70 * scale); x < canvas.width - 70 * scale; x++) {
        if (data[(y * canvas.width + x) * 4 + 3] < 80) continue;
        const point = { x: x / scale, y: y / scale };
        if (
          points.every(
            (other) => Math.hypot(point.x - other.x, point.y - other.y) > 340,
          )
        ) {
          points.push(point);
          if (points.length === 2) return points;
        }
      }
    }
    return points;
  });

// A media-change rebuild clears the canvas and only repaints on the next
// animation frame, which a paused clock delivers when time advances. Under
// parallel load the change event can land after runFor has already finished,
// leaving a blank field, so keep advancing until it repaints.
const repaintedStars = async (page: Page) => {
  for (let attempt = 0; attempt < 20; attempt++) {
    const points = await sampleStars(page);
    if (points.length > 0) return points;
    await page.clock.runFor(100);
  }
  throw new Error('starfield never repainted after the media change');
};

const corePixels = (page: Page, point: Point) =>
  page.locator(fieldSelector).evaluate((element, center) => {
    const canvas = element as HTMLCanvasElement;
    const scale = canvas.width / innerWidth;
    const { data } = canvas
      .getContext('2d')!
      .getImageData(0, 0, canvas.width, canvas.height);
    let visible = 0;
    for (
      let y = Math.floor((center.y - 45) * scale);
      y < (center.y + 45) * scale;
      y++
    ) {
      for (
        let x = Math.floor((center.x - 45) * scale);
        x < (center.x + 45) * scale;
        x++
      ) {
        if (
          Math.hypot(x / scale - center.x, y / scale - center.y) <= 45 &&
          data[(y * canvas.width + x) * 4 + 3] > 2
        )
          visible++;
      }
    }
    return visible;
  }, point);

// Find an isolated, bright source star; its rendered pixels must move, not vanish.
const orbitalTarget = (page: Page) =>
  page.locator(fieldSelector).evaluate((element) => {
    const canvas = element as HTMLCanvasElement;
    const scale = canvas.width / innerWidth;
    const { data } = canvas
      .getContext('2d')!
      .getImageData(0, 0, canvas.width, canvas.height);
    const points: Point[] = [];
    for (let y = 100 * scale; y < canvas.height - 200 * scale; y++) {
      for (let x = 220 * scale; x < canvas.width - 220 * scale; x++) {
        if (
          data[(y * canvas.width + x) * 4 + 3] > 100 &&
          points.every((p) => Math.hypot(p.x - x / scale, p.y - y / scale) > 8)
        )
          points.push({ x: x / scale, y: y / scale });
      }
    }
    return points.find((p) =>
      points.every(
        (other) => other === p || Math.hypot(p.x - other.x, p.y - other.y) > 90,
      ),
    );
  });

const orbitPixels = (page: Page, center: Point, threshold = 12) =>
  page.locator(fieldSelector).evaluate(
    (element, { center, threshold }) => {
      const canvas = element as HTMLCanvasElement;
      const scale = canvas.width / innerWidth;
      const { data } = canvas
        .getContext('2d')!
        .getImageData(0, 0, canvas.width, canvas.height);
      const points: Point[] = [];
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const radius = Math.hypot(x / scale - center.x, y / scale - center.y);
          if (
            radius > 80 &&
            radius < 145 &&
            data[(y * canvas.width + x) * 4 + 3] > threshold
          )
            points.push({ x: x / scale, y: y / scale });
        }
      }
      return points;
    },
    { center, threshold },
  );

const frame = (page: Page) =>
  page
    .locator(fieldSelector)
    .evaluate((element) => (element as HTMLCanvasElement).toDataURL());

test('mouse opens a local core, follows movement, and recovers on exit and blur', async ({
  page,
  isMobile,
}) => {
  await prepare(page);
  const points = await sampleStars(page);
  const [first, second] = points;
  expect(first).toBeTruthy();
  expect(await corePixels(page, first)).toBeGreaterThan(0);
  await page.mouse.move(first.x, first.y);
  await page.clock.runFor(300);
  if (isMobile) {
    // Even compatibility mouse input must not activate a coarse-pointer device.
    expect(await corePixels(page, first)).toBeGreaterThan(0);
    return;
  }
  expect(points).toHaveLength(2);
  expect(await corePixels(page, first)).toBe(0);
  expect(await corePixels(page, second)).toBeGreaterThan(0);

  await page.mouse.move(second.x, second.y, { steps: 8 });
  await page.clock.runFor(300);
  expect(await corePixels(page, second)).toBe(0);
  expect(await corePixels(page, first)).toBeGreaterThan(0);

  await page.mouse.move(-10, -10);
  await page.clock.runFor(300);
  expect(await corePixels(page, second)).toBeGreaterThan(0);
  await page.mouse.move(first.x, first.y);
  await page.clock.runFor(300);
  expect(await corePixels(page, first)).toBe(0);
  // Browser-window blur is simulated; exit and movement above use real mouse input.
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await page.clock.runFor(300);
  expect(await corePixels(page, first)).toBeGreaterThan(0);
  await expect(page.locator('canvas')).toHaveCount(1);
});

test('existing starlight bends outward into an arc and keeps orbiting a stationary mouse', async ({
  page,
  isMobile,
}) => {
  test.skip(
    isMobile,
    'Orbital interaction is mouse-only on fine-pointer devices.',
  );
  await prepare(page);
  const target = await orbitalTarget(page);
  expect(target).toBeTruthy();
  const center = { x: target!.x - 100, y: target!.y };
  const original = await orbitPixels(page, center, 0);
  await page.mouse.move(center.x, center.y);
  await page.clock.runFor(300);
  const first = (await orbitPixels(page, center)).filter((p) => {
    const angle = Math.atan2(p.y - center.y, p.x - center.x);
    return angle > 0.02 && angle < 0.4;
  });
  expect(first.length).toBeGreaterThan(5);
  const radii = first.map((p) => Math.hypot(p.x - center.x, p.y - center.y));
  expect(Math.min(...radii)).toBeGreaterThan(110);
  const angles = first.map((p) => Math.atan2(p.y - center.y, p.x - center.x));
  // A curved light arc spans more than a dot, yet follows a circular radius.
  expect(Math.max(...angles) - Math.min(...angles)).toBeGreaterThan(0.06);
  expect(Math.max(...radii) - Math.min(...radii)).toBeLessThan(8);
  await page.clock.runFor(700);
  const second = (await orbitPixels(page, center)).filter((p) => {
    const angle = Math.atan2(p.y - center.y, p.x - center.x);
    return angle > 0.4 && angle < 0.9;
  });
  expect(second.length).toBeGreaterThan(5);
  expect(
    second.every((p) => Math.hypot(p.x - center.x, p.y - center.y) > 110),
  ).toBe(true);
  await page.mouse.move(-10, -10);
  await page.clock.runFor(300);
  const recovered = await orbitPixels(page, center);
  expect(
    recovered.filter((p) => Math.hypot(p.x - target!.x, p.y - target!.y) < 4)
      .length,
  ).toBeGreaterThan(0);
  // Twinkle changes brightness, not position. Every recovered pixel belongs
  // to the original field, including faint neighbors in the same annulus.
  const originalPositions = new Set(original.map((p) => `${p.x},${p.y}`));
  expect(recovered.every((p) => originalPositions.has(`${p.x},${p.y}`))).toBe(
    true,
  );
});

test('touch and pen input never clear stars, including on hybrid devices', async ({
  page,
}) => {
  await prepare(page);
  const [point] = await sampleStars(page);
  expect(point).toBeTruthy();
  for (const pointerType of ['touch', 'pen']) {
    await page.evaluate(
      ({ point, pointerType }) => {
        window.dispatchEvent(
          new PointerEvent('pointermove', {
            clientX: point.x,
            clientY: point.y,
            pointerType,
          }),
        );
      },
      { point, pointerType },
    );
    await page.clock.runFor(300);
    expect(await corePixels(page, point)).toBeGreaterThan(0);
  }
});

test('switching to reduced motion clears the interaction and freezes the field until re-enabled', async ({
  page,
  isMobile,
}) => {
  await prepare(page);
  const [point] = await sampleStars(page);
  await page.mouse.move(point.x, point.y);
  await page.clock.runFor(300);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.runFor(300);
  const staticFrame = await frame(page);
  await page.mouse.move(point.x + 20, point.y + 20);
  await page.clock.runFor(500);
  expect((await frame(page)) === staticFrame).toBe(true);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.clock.runFor(300);
  const [newPoint] = await repaintedStars(page);
  await page.mouse.move(newPoint.x, newPoint.y);
  await page.clock.runFor(300);
  if (isMobile) expect(await corePixels(page, newPoint)).toBeGreaterThan(0);
  else expect(await corePixels(page, newPoint)).toBe(0);
});
