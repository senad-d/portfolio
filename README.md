# Portfolio (Astro + TypeScript + Tailwind)

Single-page scrolling portfolio site configured for GitHub Pages.

Core UX requirement: **sticky header is always visible** and navigation jumps to in-page sections.

## Requirements

- Node.js `>=22.12.0`
- npm `>=10`

## Local setup and development

```bash
npm ci
npm run dev
```

`npm run dev` prevents multiple concurrent Astro dev servers for this repo to avoid `.astro` data-store write race errors. If you intentionally need a second instance, use `npm run dev -- --force`.

Run the full local quality gate before PRs:

```bash
npm run validate
```

## Command contract

| Command                      | Purpose                                             |
| ---------------------------- | --------------------------------------------------- |
| `npm ci`                     | Install exact dependencies (CI + clean local setup) |
| `npm run dev`                | Start local development server                      |
| `npm run build`              | Build static production output                      |
| `npm run preview`            | Preview production build locally                    |
| `npm run lint`               | Run ESLint (`.js`, `.ts`, `.astro`)                 |
| `npm run typecheck`          | Run Astro/TypeScript checks                         |
| `npm run format`             | Format files with Prettier                          |
| `npm run validate`           | Full gate: lint + typecheck + build                 |
| `npm run qa`                 | Automation wrapper for format + validate            |
| `npm run test:e2e`           | Run Playwright smoke tests (single-page flows)      |
| `npm run lighthouse`         | Run Lighthouse audit with threshold checks          |
| `npm run new:project <slug>` | Generate a new project markdown file from template  |

## Automation scripts

- `scripts/dev.sh`: start dev server with a single-instance guard (`npm run dev`)
- `scripts/qa.sh`: run `format` + `validate` in one command (`npm run qa`)
- `scripts/lighthouse.sh`: run local Lighthouse checks with thresholds (`npm run lighthouse`)
- `scripts/new-project.sh`: generate project markdown starter (`npm run new:project <slug>`)

## Add a new project in 5 minutes

1. Generate a new content file:

   ```bash
   npm run new:project <slug>
   ```

2. Update frontmatter in `src/content/projects/<slug>.md`:
   - set `lane` (`professional` or `personal`)
   - set `status`, `featured`, `impact`
3. Write content sections in order: `Problem`, `Approach`, `Result`
4. Run checks:

   ```bash
   npm run validate
   ```

5. Preview locally:

   ```bash
   npm run dev
   ```

For writing and UX standards, see:

- [Documentation Index](./docs/README.md)
- [UX Design Specification](./docs/UX_DESIGN_SPEC.md)
- [Content Style Guide](./docs/CONTENT_STYLE_GUIDE.md)

## Single-page architecture

The site is implemented as one scrolling page (single route), with section anchors:

- `#home`
- `#projects`
- `#about`
- `#contact`

Navigation behavior:

- Header remains visible while scrolling (desktop + mobile)
- Header links jump to section anchors
- Anchor jumps must account for sticky-header offset

## Optional analytics integration (privacy-friendly)

Analytics is disabled by default. Enable one provider with public env vars:

### Plausible

```bash
PUBLIC_ANALYTICS_PROVIDER=plausible
PUBLIC_PLAUSIBLE_DOMAIN=senad.github.io
# optional override:
# PUBLIC_PLAUSIBLE_SRC=https://plausible.io/js/script.js
```

### Umami

```bash
PUBLIC_ANALYTICS_PROVIDER=umami
PUBLIC_UMAMI_WEBSITE_ID=<website-id>
# optional override:
# PUBLIC_UMAMI_SRC=https://analytics.example.com/script.js
```

## Optional Decap CMS setup

A basic Decap admin scaffold is included at:

- `/admin/index.html`
- `/admin/config.yml`

Before use, update `public/admin/config.yml` with your real repository details.

## GitHub Pages deployment

### CI workflows

- PR validation: `.github/workflows/ci.yml`
  - runs `lint`, `typecheck`, `build`, and Playwright smoke tests on pull requests
- Pages deploy: `.github/workflows/deploy-pages.yml`
  - runs on push to `main`
  - uploads `dist/` and deploys via `actions/deploy-pages`

### Pages settings checklist

1. Go to **Repository Settings → Pages**
2. Set **Source** to **GitHub Actions**
3. Merge to `main` (or manually dispatch deploy workflow)

### `site` / `base` config notes

`astro.config.mjs` supports two modes:

1. **Repository Pages (default)**
   - URL: `https://<user>.github.io/<repo>/`
   - `base` is `/<repo>/`
2. **Custom domain**
   - set `PUBLIC_USE_CUSTOM_DOMAIN=true`
   - set `PUBLIC_SITE_URL=https://your-domain.tld/`
   - `base` switches to `/`

Example custom-domain build:

```bash
PUBLIC_USE_CUSTOM_DOMAIN=true PUBLIC_SITE_URL=https://your-domain.tld/ npm run build
```

Default live URL for this repository:

- `https://senad.github.io/portfolio/`

## Operations and quality docs

- Documentation index: [docs/README.md](./docs/README.md)
- UX design handoff spec: [docs/UX_DESIGN_SPEC.md](./docs/UX_DESIGN_SPEC.md)
- Accessibility/performance report: [docs/QUALITY_REPORT.md](./docs/QUALITY_REPORT.md)
- UI spec compliance review: [docs/UI_SPEC_COMPLIANCE_REVIEW.md](./docs/UI_SPEC_COMPLIANCE_REVIEW.md)
- Monthly maintenance checklist: [docs/MAINTENANCE_CHECKLIST.md](./docs/MAINTENANCE_CHECKLIST.md)
