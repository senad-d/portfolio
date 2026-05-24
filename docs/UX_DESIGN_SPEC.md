# UX Design Specification — As-Built (Code-First)

**Document status:** Implementation-aligned (code is source of truth)  
**Version:** 1.1  
**Last updated:** 2026-05-24  
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
- Mobile nav uses hamburger menu (`data-nav-toggle`) below `768px`; desktop uses inline nav.

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

- Kicker: `DevOps & Cloud Engineer`.
- H1: `Building reliable cloud platforms with practical automation`.
- CTA buttons:
  - Primary: `View projects` (`#projects`)
  - Secondary: `Contact` (`#contact`)
- Includes three credibility cards (hiring teams / freelance clients / shared outcome).

### 5.3 Projects (`#projects`)

#### Data and ordering

- Loaded from markdown collection `projects`.
- Sorted descending by normalized `startDate`.
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
- external actions (`View code`, `Live project`, `Case study`) where present.

#### Narrative extraction (details panel)

From markdown body:

- `## Problem`
- `## Approach`
- `## Result`

If headings are missing, code applies fallback text derived from summary/impact.

#### Filtering (implemented UX)

- Trigger button opens a popover menu.
- Lane filter uses radio options:
  - All
  - Professional
  - Personal
- Stack filter uses multi-select checkboxes (dynamic from all stack values).
- “Clear stacks” button resets selected stacks.
- Empty-state message shown when no cards match.
- Screen-reader live status (`aria-live="polite"`) announces result counts.

#### Details expansion behavior

- Multiple project details can remain open simultaneously.
- Expand/collapse animations are custom Web Animations API transitions.
- Hidden cards are auto-collapsed when filters change.

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

- Response-time expectation text (usually within 24h).
- Actions:
  - Email (`mailto:`)
  - GitHub (external)
  - LinkedIn (external)
  - YouTube (external)
- External links use `target="_blank"` + `rel="noopener noreferrer"`.

---

## 6) Visual system (implemented tokens)

Dark-first token system in `global.css`:

- Backgrounds: `--bg-950`, `--bg-900`
- Surfaces/borders: `--surface-800`, `--surface-780`, `--border-700`
- Text: `--text-100`, `--text-200`, `--text-300`
- Accents: `--accent-cyan`, `--accent-violet`
- Status: `--success`, `--warning`

Styling direction: futuristic/technical dark UI with subtle cyan-violet glow effects.

Typography implementation:

- Primary UI text and headings: Inter/system sans stack
- Technical identifiers: JetBrains Mono fallback stack

---

## 7) Motion and ambient effects

- Standard transition timing is constrained around `150–250ms`.
- Header/menu/filter/card/detail interactions use short motion tokens.
- Animated ambient background (“signal network”) is rendered as moving dots behind content.

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

## 10) Quality verification snapshot (current)

Last local verification on 2026-05-24:

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
