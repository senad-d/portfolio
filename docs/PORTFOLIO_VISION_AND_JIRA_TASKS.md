# Futuristic Single-Page Portfolio Vision & Jira-Style Delivery Plan (Reviewed v3)

This version updates the strategy to a **single-page scrolling portfolio** with an **always-visible sticky header** and **mobile-first UX**.

Companion design handoff reference: [`docs/UX_DESIGN_SPEC.md`](./UX_DESIGN_SPEC.md).

## 1) Critical Update Summary (What changed)

- Switched architecture from multi-page routes to **one-page section-based layout**.
- Added explicit requirement for **sticky header always visible** (desktop + mobile).
- Reworked ticket flow so Projects/About/Contact are implemented as **sections**, not separate pages.
- Updated QA, E2E, and release checks to validate **single-route + anchor navigation**.
- Strengthened mobile acceptance criteria across layout, navigation, and interaction behavior.

---

## 2) Vision — “Futuristic Single-Page Professional Presence”

Build a portfolio that feels premium and futuristic while staying practical, fast, and readable.

### Experience goals

- **Single-page narrative flow:** users scroll through Hero → Projects → About → Contact.
- **Always-visible header:** sticky navigation with section anchors and active-state feedback.
- **Mobile-first experience:** comfortable spacing, thumb-friendly interactions, no horizontal overflow.
- **Futuristic but restrained UI:** dark surfaces, subtle glow, minimal animation.
- **Content clarity:** outcomes and impact are easy to scan.
- **Accessibility-first:** keyboard navigation, visible focus, semantic landmarks, reduced-motion support.

### Design direction (v1)

- **Palette:** charcoal/navy base + cyan/violet accents.
- **Typography:** modern sans with optional mono accents for tags/metrics.
- **Components:** glass-like cards, thin borders, low-intensity motion (150–250ms).
- **Tone:** engineering reliability + measurable delivery impact.

---

## 3) Non-Functional Targets (MVP gates)

- **Architecture:** one public route (`/` or `/<repo>/`) with section anchors.
- **Sticky header:** visible at all times; does not hide section headings when anchor-jumping.
- **Validation gate:** `npm run validate` passes (`lint + typecheck + build`).
- **QA gate:** `npm run qa` passes before merge.
- **Accessibility:** no critical issues; full keyboard access for header nav and section controls.
- **Lighthouse targets (single-page homepage):**
  - Accessibility **>= 95**
  - SEO **>= 95**
  - Best Practices **>= 95**
  - Performance **>= 90** (desktop), **>= 80** (mobile)
- **Motion safety:** decorative animations respect `prefers-reduced-motion`.
- **Security/privacy:** no secrets or sensitive personal data exposed.

---

## 4) Sequential Delivery Process (High-level)

- [x] **Preflight & Foundation** — audit repo, scaffold Astro stack, command contract.
- [ ] **Quality & Deployment Base** — lint/typecheck/format, CI workflows, Pages config.
- [x] **Design System & Navigation** — tokens, theme, sticky header, anchor behavior.
- [x] **Content System** — markdown schema, generator, sanitized source content.
- [x] **Single-Page Build** — compose all major sections on one scrollable page.
- [ ] **Hardening & Release** — accessibility/performance/mobile QA, optional E2E, launch.

---

## 5) Jira-Style Backlog (Execution order)

## PORT-000 — Repository preflight audit and gap closure

**Type:** Task  
**Priority:** Highest  
**Depends on:** None

### Description

Validate the new repository baseline before implementation.

### Steps

- [x] Audit current state: `package.json`, `src/`, `public/`, `_templates/`, config files.
- [x] Compare setup against `AGENTS.md` command contract and structure expectations.
- [x] Create a short blocker checklist and close setup gaps.
- [x] Confirm Node/npm versions and onboarding instructions.

### Acceptance Criteria

- [x] Preflight checklist is complete.
- [x] Blocking setup gaps are identified and resolved.
- [x] Repository is ready for `npm ci` and project bootstrap.

---

## PORT-001 — Initialize Astro + TypeScript + Tailwind

**Type:** Task  
**Priority:** Highest  
**Depends on:** PORT-000

### Description

Bootstrap the technical stack.

### Steps

- [x] Initialize Astro project with TypeScript.
- [x] Add Tailwind CSS integration.
- [x] Create core structure: `src/components`, `src/layouts`, `src/pages`, `src/content/projects`, `src/styles`, `public`.
- [x] Add starter `src/pages/index.astro` placeholder.

### Acceptance Criteria

- [x] `npm run dev` starts successfully.
- [x] `npm run build` generates static output.
- [x] Structure matches project standards.

---

## PORT-002 — Configure command contract and automation scripts

**Type:** Task  
**Priority:** Highest  
**Depends on:** PORT-001

### Description

Standardize local and CI workflows.

### Steps

- [x] Ensure `package.json` scripts exist: `dev`, `build`, `preview`, `lint`, `typecheck`, `format`, `validate`, `qa`, `new:project`.
- [x] Ensure `validate` runs exactly: `lint && typecheck && build`.
- [x] Verify `scripts/qa.sh` and `scripts/new-project.sh` end-to-end.
- [x] Update `README.md` and `AGENTS.md` when automation changes.

### Acceptance Criteria

- [x] All required scripts execute successfully.
- [x] Validation sequence matches contract.
- [x] Documentation reflects final command workflow.

---

## PORT-003 — Linting, formatting, and type safety baseline

**Type:** Task  
**Priority:** High  
**Depends on:** PORT-002

### Description

Establish code quality guardrails early.

### Steps

- [x] Configure ESLint for `.ts`, `.js`, `.astro`.
- [x] Configure Prettier for Astro/Tailwind compatibility.
- [x] Enable strict TypeScript/Astro checks.
- [x] Add/update ignore files as needed.

### Acceptance Criteria

- [x] `npm run lint` passes.
- [x] `npm run format` runs cleanly.
- [x] `npm run typecheck` passes.

---

## PORT-004 — CI validation and GitHub Pages deployment hardening

**Type:** Task  
**Priority:** High  
**Depends on:** PORT-002, PORT-003

### Description

Guarantee quality checks and reliable deployment.

### Steps

- [x] Verify PR CI runs `npm ci`, `lint`, `typecheck`, `build`.
- [x] Verify deploy workflow builds and publishes `dist/`.
- [x] Confirm Astro `site` and `base` for repository Pages.
- [x] Document deployment behavior and troubleshooting in README.

### Acceptance Criteria

- [ ] CI passes on pull requests.
  - Pending first PR run after scaffold commit.
- [ ] Merge to `main` triggers successful deploy.
  - Pending verification after merge.
- [ ] Live site works correctly at repository base path.
  - Pending deployment verification.

---

## PORT-005 — Futuristic design system (tokens, motion, mobile-first)

**Type:** Story  
**Priority:** High  
**Depends on:** PORT-001

### Description

Create reusable visual primitives optimized for mobile-first, single-page UX, aligned with `docs/UX_DESIGN_SPEC.md`.

### Steps

- [x] Define color, spacing, typography, radius, border, and glow tokens.
- [x] Implement dark-first global theme.
- [x] Define motion tokens and reduced-motion behavior.
- [x] Define mobile breakpoints and spacing rhythm first, then scale up.

### Acceptance Criteria

- [x] Design tokens are centralized and reusable.
- [x] UI is visually consistent across sections.
- [x] Reduced-motion mode disables non-essential animation.
- [x] Mobile layout remains readable and balanced.

---

## PORT-006 — Sticky header + section anchor navigation shell

**Type:** Story  
**Priority:** Highest  
**Depends on:** PORT-005

### Description

Build the global shell with a header that stays visible while scrolling.

### Steps

- [x] Create `MainLayout.astro` and page metadata support.
- [x] Implement sticky/fixed header visible on all scroll positions.
- [x] Add anchor navigation for sections (`#home`, `#projects`, `#about`, `#contact`).
- [x] Add active-section indication and clear focus styles.
- [x] Ensure mobile nav is usable (compact menu / horizontal nav pattern).

### Acceptance Criteria

- [x] Header remains visible while scrolling on desktop and mobile.
- [x] Anchor links navigate to correct sections.
- [x] Target sections are not hidden behind header on jump.
- [x] Navigation is keyboard and screen-reader accessible.

---

## PORT-007 — Project content model + generator reliability

**Type:** Story  
**Priority:** High  
**Depends on:** PORT-001, PORT-002

### Description

Keep project content maintainable with markdown schema and generator.

### Steps

- [x] Define strict schema in `src/content.config.ts`.
- [x] Require frontmatter fields: title, summary, stack, lane, impact, dates, links.
- [x] Ensure `_templates/project-template.md` exists and matches schema.
- [x] Validate `npm run new:project <slug>` generation flow.

### Acceptance Criteria

- [x] Invalid frontmatter fails clearly.
- [x] Generator produces valid starter markdown.
- [x] Generated markdown appears correctly in local build.

---

## PORT-008 — Seed and sanitize source content from `my-info/`

**Type:** Task  
**Priority:** High  
**Depends on:** PORT-007

### Description

Convert source profile/project info into publish-safe content.

### Steps

- [x] Extract profile summary, skills, and project highlights from `my-info/`.
- [x] Create initial markdown project entries.
- [x] Sanitize sensitive/private fields (address, phone, internal details) as needed.
- [x] Normalize tone and grammar.

### Acceptance Criteria

- [x] Initial content set exists in `src/content/projects/`.
- [x] Public content excludes sensitive/private information.
- [x] Language is professional and consistent.

---

## PORT-009 — Compose single-page sections (Hero, Projects, About, Contact)

**Type:** Story  
**Priority:** Highest  
**Depends on:** PORT-006, PORT-008

### Description

Implement one continuous page with clear section hierarchy.

### Steps

- [x] Build section wrappers with semantic landmarks and IDs.
- [x] Implement Hero section with value proposition and CTA.
- [x] Implement Projects section powered by markdown data.
- [x] Implement About section from sanitized profile data.
- [x] Implement Contact section with key links and availability.

### Acceptance Criteria

- [x] Entire portfolio experience works from a single route.
- [x] All primary content areas are section-based and scroll-accessible.
- [x] Section IDs align with header navigation anchors.

---

## PORT-010 — Projects section interactions (filters + detail reveal, same page)

**Type:** Story  
**Priority:** High  
**Depends on:** PORT-009

### Description

Add browsing interactions inside the Projects section without creating new routes.

### Steps

- [x] Add `All | Professional | Personal` filter controls.
- [x] Add project detail reveal pattern (expand/collapse or modal/drawer).
- [x] Keep interaction lightweight and accessible.
- [x] Add empty-state handling for filters.

### Acceptance Criteria

- [x] Filters return correct project sets.
- [x] Project details are viewable without route navigation.
- [x] Interaction works via keyboard and on mobile.

---

## PORT-011 — Scroll behavior, anchor offsets, and active section tracking

**Type:** Story  
**Priority:** High  
**Depends on:** PORT-006, PORT-009

### Description

Make section navigation smooth, precise, and robust with sticky header.

### Steps

- [x] Implement correct scroll offset for sticky header (`scroll-margin-top` pattern).
- [x] Implement active-section highlight on scroll.
- [x] Add smooth-scroll enhancement with reduced-motion fallback.
- [x] Validate deep links (`#projects`, `#about`, etc.) on page load.

### Acceptance Criteria

- [x] Anchor navigation lands on correct visible headings.
- [x] Active nav state updates correctly while scrolling.
- [x] Reduced-motion users do not get forced smooth animation.

---

## PORT-012 — Mobile UX hardening for single-page experience

**Type:** Task  
**Priority:** Highest  
**Depends on:** PORT-009, PORT-010, PORT-011

### Description

Optimize layout and interactions for mobile-first usage.

### Steps

- [x] Validate no horizontal overflow on small widths.
- [x] Optimize sticky header height and touch target sizes.
- [x] Ensure section spacing and card density are mobile-friendly.
- [x] Verify readability and contrast in dark theme on mobile devices.

### Acceptance Criteria

- [x] Header and navigation are comfortable to use on phones.
- [x] No clipping/overflow issues remain on mobile breakpoints.
- [x] Core section actions are reachable with one-hand use.

---

## PORT-013 — Optional but recommended: Playwright smoke tests (single-page flows)

**Type:** Task  
**Priority:** Medium  
**Depends on:** PORT-009, PORT-010, PORT-011, PORT-012

### Description

Protect core journeys with lightweight E2E coverage.

### Steps

- [x] Configure Playwright test runner.
- [x] Add smoke tests for homepage load.
- [x] Add smoke tests for sticky header visibility during scroll.
- [x] Add smoke tests for anchor navigation and section visibility.
- [x] Add smoke tests for projects filtering and contact links.
- [x] Add `npm run test:e2e` command.

### Acceptance Criteria

- [x] Smoke suite passes locally.
- [x] CI integration is configured.
- [x] Regressions in single-page navigation are detectable.

---

## PORT-014 — Accessibility, performance, and SEO hardening

**Type:** Task  
**Priority:** High  
**Depends on:** PORT-012

### Description

Tune quality before launch.

### Steps

- [x] Run Lighthouse on the single-page homepage and resolve major issues.
  - Verified via `npm run lighthouse` (`http://127.0.0.1:4173/portfolio/`) with scores: Performance 100, Accessibility 100, Best Practices 100, SEO 100.
- [x] Validate heading order, landmarks, focus states, and contrast.
- [x] Optimize images/fonts and reduce hydration cost.
  - Kept system font stack, no heavy media assets, and minimal client-side scripting.
- [x] Validate metadata and social share fields.
  - Added canonical URL, Open Graph, Twitter card tags, theme color, and dedicated OG image asset.

### Acceptance Criteria

- [x] Meets Section 3 quality targets.
- [x] No critical accessibility blockers remain.
- [x] Mobile performance target is achieved.

---

## PORT-015 — Final QA, release prep, and launch

**Type:** Task  
**Priority:** Highest  
**Depends on:** PORT-004, PORT-014

### Description

Run final checks and release MVP.

### Steps

- [x] Run `npm run qa`.
- [x] Run `npm run preview` and validate single-page behavior manually.
- [x] Verify sticky header, anchor navigation, and mobile UX.
- [x] Verify key sections: Hero, Projects, About, Contact.
- [ ] Merge to `main` and verify production deployment.

### Acceptance Criteria

- [x] Required checks pass.
- [ ] Live site is reachable and single-page navigation works.
- [ ] MVP is marked complete.

---

## 6) Suggested Sprint Cadence

- **Sprint 0 (Setup):** PORT-000 to PORT-004
- **Sprint 1 (Design + Navigation + Content):** PORT-005 to PORT-008
- **Sprint 2 (Single-page Build):** PORT-009 to PORT-012
- **Sprint 3 (Hardening + Launch):** PORT-013 to PORT-015

---

## 7) Definition of Done (Per Ticket)

A ticket is complete only if:

- Scope is implemented with focused changes.
- Dependencies and acceptance criteria are fully satisfied.
- Required quality gates pass (`npm run validate` minimum; `npm run qa` before merge).
- Related documentation is updated when needed.
- No sensitive data or secrets are introduced.

---

## 8) Key Risks and Mitigations

- **R1: Repo Pages path misconfiguration (`site/base`)**  
  **Mitigation:** validate in PORT-004 and PORT-015.

- **R2: Sticky header overlaps anchor targets**  
  **Mitigation:** implement and test offset behavior in PORT-011.

- **R3: Over-animated futuristic design harms usability**  
  **Mitigation:** enforce motion tokens + reduced-motion behavior in PORT-005 and PORT-014.

- **R4: Mobile UX degrades under dense content**  
  **Mitigation:** dedicated mobile hardening in PORT-012.

- **R5: Personal data exposure from raw profile files**  
  **Mitigation:** sanitization workflow in PORT-008 + final QA review in PORT-015.
