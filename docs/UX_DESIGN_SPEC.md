# UX Design Specification — As-Built (Code-First)

**Document status:** Implementation-aligned (code is source of truth)  
**Version:** 1.2  
**Last updated:** 2026-09-15  
**Product:** Personal portfolio website (single-page, Astro + TypeScript + Tailwind)

---

## 1) Purpose

This document describes the **current implemented UX** in the repository.
It intentionally reflects shipped behavior from:

- `src/pages/index.astro`
- `src/layouts/MainLayout.astro`
- `src/styles/global.css`
- `src/content.config.ts`

Use this file as the baseline for future UX changes and ticket acceptance criteria.

---

## 2) Product and UX goals

- Present Senad as a reliable DevOps/AWS delivery partner.
- Keep the website as a **single-page, fast-scanning experience**.
- Keep a **sticky header always visible**.
- Prioritize mobile usability and touch target accessibility.
- Keep projects and proof points markdown-driven and easy to maintain.

---

## 3) Information architecture (implemented)

### 3.1 Implemented section order in `index.astro`

1. `#home`
2. `#projects`
3. `#experience`
4. `#skills`
5. `#certifications`
6. `#about`
7. `#contact`

### 3.2 Primary navigation

Sticky header primary links (same order as sections):

- `#home`
- `#projects`
- `#experience`
- `#skills`
- `#certifications`
- `#about`
- `#contact`

---

## 4) Global layout and responsive behavior

- Max content width: `72rem` (`--content-max-width`).
- Header height:
  - mobile: `4rem`
  - `>=768px`: `4.5rem`
- Section spacing (`--section-space`):
  - base: `3.75rem`
  - `>=768px`: `4.75rem`
  - `>=1280px`: `6rem`
- Sticky header remains fixed with translucent blurred background and scrolled state.
- Smooth anchor scrolling enabled by default (`scroll-behavior: smooth`) with `scroll-padding-top` tied to header height.
- Mobile/tablet nav uses hamburger menu (`data-nav-toggle`) below `1024px`; desktop uses inline nav. The brand never wraps; the expanded menu scrolls in short viewports.

### Mobile hardening in CSS

- `min-height: 44px` on interactive controls (buttons/links/toggle/filter triggers).
- At `max-width: 480px`, hero/contact/details action groups stack to full-width buttons.
- Body overflow guarded with `overflow-x: clip`.

---

## 5) Implemented component behavior

### 5.1 Header and navigation

- Includes skip link (`Skip to content`) targeting `#main-content`.
- Active nav item tracking is scroll-aware and hash-aware.
- `aria-current="true"` is moved to the active nav link.
- Mobile menu closes on:
  - nav link click,
  - `Escape`,
  - breakpoint switch to desktop.

### 5.2 Hero (`#home`)

- Kicker: `Helping teams build with confidence`.
- H1: `Reliable systems that help your business move forward`.
- CTA buttons:
  - Primary: `View projects` (`#projects`)
  - Secondary: `Contact` (`#contact`)
- Compact lead explains the client benefits of dependable systems and less repetitive operational work.
- A static terminal labeled `Portfolio snapshot` shows the requested `senad@cloud: ~/portfolio` session: `whoami`, `terraform apply -auto-approve`, and `./deploy.sh --env production`, followed by a continuously blinking final cursor.
- Three compact audience/outcome cards follow the hero: Hiring teams, Freelance clients, and Shared outcome.

### 5.3 Projects (`#projects`)

#### Data and ordering

- Loaded from markdown collection `projects`.
- The complete collection is shown by default, sorted descending by normalized `startDate`.
- Cards use a single chronological column at every viewport so the collection reads as one timeline rather than a featured-project dashboard.
- Filtering narrows that visible collection directly; there is no separate selected/show-all mode.
- Without JavaScript, all projects and native details remain available.
- Date parser supports:
  - `YYYY-MM`
  - `Mon YYYY`

#### Card model

Each card includes:

- lane chip (`Professional`/`Personal`),
- date range,
- title,
- summary,
- stack chips,
- expandable details panel,
- impact bullets,
- external actions (`View code`, `npm package`, `Live project`, `Case study`) inside details where present.

#### Narrative extraction (details panel)

From markdown body:

- `## Problem`
- `## Approach`
- `## Result`

If headings are missing, code applies fallback text derived from summary/impact.

#### Filtering (implemented UX)

- Always-visible lane radio controls and Stack trigger have at least 44px targets.
- Stack trigger opens a popover menu; its badge is hidden unless a selection exists.
- Lane filter uses radio options:
  - All
  - Professional
  - Personal
- Stack filter uses multi-select checkboxes (dynamic from all stack values).
- “Clear” button resets selected stacks.
- Lane/stack filters search the full collection. Stack choices are OR-matched, combined with the lane using AND.
- Clearing filters restores the complete chronological collection.
- Visible polite status announces the current result count and filter scope.
- Empty-state message shown when no cards match.
- Screen-reader live status (`aria-live="polite"`) announces result counts.

#### Details expansion behavior

- Multiple project details can remain open simultaneously.
- Expand/collapse animations are custom Web Animations API transitions.
- Hidden cards are auto-collapsed when filters change.
- On fine-pointer devices, each card starts with a small, dim radial glow that follows the mouse. Hover immediately expands it from 10rem to its full 26rem radius while brightening (opacity 0.1 → 0.9) over 250ms with ease-in-out; pointer exit reverses the transition without a delay. Touch and reduced-motion modes do not initialize pointer tracking.

### 5.4 About (`#about`)

- Intro paragraph describing two delivery modes (embedded hiring-team partner + freelance consultant).
- Three supporting cards:
  - For hiring managers
  - For engineering teams
  - For freelance clients

### 5.5 Experience (`#experience`)

- Timeline UI with vertical rail and dated role entries.
- Entries include role, company, period, and highlights.

### 5.6 Skills (`#skills`)

- Skills ledger grouped into:
  - AWS Platform Delivery
  - Infrastructure & Automation
  - Observability & Security
  - LLM Tooling
- Chips are non-interactive informational tags with hover styling.

### 5.7 Certifications (`#certifications`)

- Certification card list with issuer, issue date, credential ID, and optional verification link.
- Secondary tools rail labeled “Core tools used in delivery”.

### 5.8 Contact (`#contact`)

- Contact links immediately follow the heading, with Email and Upwork first in DOM and visual order (side by side from 640px).
- Response-time expectation text (usually within 24h).
- Secondary audience guidance follows the links:
  - Hiring teams
  - Freelance clients
- Freelance guidance summarizes first-contact value (quick review + practical next steps).
- Actions:
  - Email (`mailto:`)
  - Upwork (external)
  - LinkedIn (external)
  - GitHub (external)
  - YouTube (external)
- Email and Upwork are visually emphasized as top-priority contact CTAs.
- External links use `target="_blank"` + `rel="noopener noreferrer"`.

### 5.9 Footer

- A compact terminal window mirrors the hero terminal chrome, includes the copyright year and owner, and ends the portfolio session with `exit 0`. Contact/media links remain in the Contact section rather than being duplicated.

---

## 6) Visual system (implemented tokens)

Dark-first token system in `global.css`:

- Backgrounds: `--bg-950`, `--bg-900`
- Surfaces/borders: `--surface-800`, `--surface-780`, `--border-700`
- Text: `--text-100`, `--text-200`, `--text-300`
- Accents: `--accent-cyan`, `--accent-violet`
- Status: `--success`, `--warning`

Styling direction: near-black terminal UI. Page backdrop uses the live baseline's layered gradients (`#030409` → `#070B16` → `#04060F`), panels `#111820`, text `#E6EDF3`, muted text `#9DA9B8`, prompt/primary green `#7EE787`, secondary links `#79C0FF`, warning `#E3B341`. Violet is reserved for explicit Personal labels. Controls/panels use 4–6px corners, solid primary surfaces, and restrained hover accents. Section headings use a single `❯` prefix, without duplicate path labels.

Typography implementation:

- Paragraphs: Inter/system sans stack
- Headings, controls, terminal chrome, and technical identifiers: JetBrains Mono fallback stack

---

## 7) Motion and ambient effects

- Standard transition timing is constrained around `150–250ms`.
- Header/menu/filter/card/detail interactions use short motion tokens.
- Background authority: immutable `senad-d/portfolio@71cf24c`, confirmed against live assets `index.DEYIQxzd.css` and `MainLayout.astro_astro_type_script_index_0_lang.Fz3Eq8Yz.js`. Restore source rather than reconstruct from descriptions; this supersedes the prior 3rem and 14rem interpretations.
- Preserve the original layered gradient backdrop, masked 56px × 56px grid, and three sparse white/cyan/violet/warm star layers with twinkle, scroll parallax, rare near-star halos, and occasional desktop meteors. Pointer movement does not manipulate the live baseline's stars.
- The viewport-sized decorative canvas is non-interactive and hidden from assistive technology. Mobile retains the original lower-density, 30fps lite mode without halos/meteors. Reduced motion at load renders static stars; no JavaScript retains the CSS backdrop with an empty canvas.
- Terminal content is static; the final terminal cursor blinks continuously, while reduced-motion mode neutralizes the animation.
- Scroll reveals use 200ms transitions with a small sibling stagger.

### Reduced motion behavior

For `prefers-reduced-motion: reduce`:

- smooth scroll is disabled,
- animation/transition durations are effectively neutralized globally.

---

## 8) Accessibility implementation

Implemented accessibility baseline includes:

- semantic landmarks (`header`, `nav`, `main`, `section`),
- keyboard-focus styles via `.focus-ring` and `:focus-visible`,
- skip link to main content,
- nav state announcement via `aria-current`,
- explicit labels/headings for filter groups,
- polite live region for dynamic project-filter result updates,
- minimum touch target sizing on key controls.

---

## 9) Content model and constraints

Project markdown schema (`src/content.config.ts`) enforces:

- required `title`, `summary`, `lane`, `stack`, `impact`,
- status enum (`completed | in-progress | archived`),
- date format constraints for `startDate`/`endDate`,
- at least one external project link (`github | live | caseStudy`).

This keeps portfolio project quality and card rendering consistency stable.

---

## 10) Quality verification snapshot

Terminal refinement regression coverage lives in `tests/e2e/terminal-refinements.spec.ts`; existing smoke coverage remains in `tests/e2e/smoke.spec.ts`. Run `npm run test:e2e` (or pass a spec path for a focused run). The regression suite covers tablet navigation, chronological project browsing, full-collection filters, empty states, touch targets, badge hiding, contact order, truthful hero content, and no-JS project access.

Background regression coverage lives in `tests/e2e/header-dot-effect.spec.ts`: immutable source fingerprint, live gradient/grid values, sparse viewport-sized canvas, twinkle/scroll rendering, keyboard access, reduced motion at load, and no-JavaScript fallback. These tests guard the source-backed restoration; they do not replace visual comparison with the live assets.

Objective 7 verification (fresh production build):

- `npm run validate`: passed; 0 Astro errors/warnings/hints.
- `npm run test:e2e -- --workers=2 --output=/tmp/portfolio-obj7-test-results`: 66 passed across desktop/mobile Chromium. Seven new regression cases failed before implementation; the no-JS baseline already passed.
- Inspected screenshots at 320, 390, 768, and 1440px, including tablet menu, projects, contact, Stack, and keyboard focus. Reduced-motion emulation settled to 0 running animations with automatic scrolling; console was clear.
- Axe: 0 violations, 42 passes, 1 incomplete contrast rule covering decorative prompt/chevron symbols. Not a full manual accessibility or cross-browser audit; no new performance measurements.

Historical baseline verification on 2026-05-24 (not new performance measurements):

- `npm run validate` ✅
- `npm run test:e2e` ✅ (18 tests passed)
- `npm run lighthouse` ✅
  - Performance: 100
  - Accessibility: 100
  - Best Practices: 100
  - SEO: 100

---

## 11) Governance

- This document must be updated whenever UX behavior, IA, or interaction patterns change in code.
- If implementation and docs diverge, **implementation remains source of truth** until docs are refreshed.
- Keep this file aligned with `docs/UI_SPEC_COMPLIANCE_REVIEW.md` and ticket acceptance criteria.
