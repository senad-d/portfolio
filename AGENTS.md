# AGENTS.md — Development & Testing Guide

This file defines the **project command contract** and **standard workflows** for building and testing this portfolio site.

> Stack baseline: **Astro + TypeScript + Tailwind CSS**, deployed to **GitHub Pages**.

## 1) Project Scope (for all contributors/agents)

- Build and maintain a **single-page** static portfolio website.
- Keep a **sticky header always visible** while users scroll.
- Prioritize **mobile-first UX** and responsive behavior.
- Keep UI professional, minimal, dark-themed, and fast.
- Keep content updates easy via Markdown content files.
- Prefer simple, maintainable solutions over heavy dependencies.
- Treat `docs/UX_DESIGN_SPEC.md` as the primary UX/design handoff reference.

## 2) Expected Repository Structure

When scaffolded, keep this layout:

```txt
.
├─ src/
│  ├─ components/
│  ├─ layouts/
│  ├─ pages/
│  │  └─ index.astro   # single-page scrolling site entry
│  ├─ content/
│  │  └─ projects/
│  └─ styles/
├─ src/content.config.ts
├─ public/
├─ .github/workflows/
├─ _templates/
└─ AGENTS.md
```

## 3) Command Contract (must exist in `package.json`)

These commands should be available and stable:

| Command                      | Purpose                                    | When to use                        |
| ---------------------------- | ------------------------------------------ | ---------------------------------- |
| `npm ci`                     | Install exact deps in CI/local clean setup | Before validation, CI runs         |
| `npm run dev`                | Start Astro local dev server (single-instance guard) | During feature/content development |
| `npm run build`              | Create production static build             | Before PR and deploy               |
| `npm run preview`            | Preview production build locally           | Final local QA                     |
| `npm run lint`               | Lint code/style issues                     | Before commit/PR                   |
| `npm run typecheck`          | TypeScript + Astro checks                  | Before commit/PR                   |
| `npm run format`             | Auto-format files                          | Before commit                      |
| `npm run validate`           | Full gate: lint + typecheck + build        | Required before merge              |
| `npm run qa`                 | Automation wrapper for format + validate   | Fast local pre-PR check            |
| `npm run test:e2e`           | Playwright smoke tests                     | PR and release checks              |
| `npm run lighthouse`         | Lighthouse automation + threshold checks   | Quality hardening and release prep |
| `npm run new:project <slug>` | Generate project markdown from template    | Adding new portfolio item          |

### Minimum validate script

`npm run validate` should run:

```bash
npm run lint && npm run typecheck && npm run build
```

## 4) Automation Policy (Mandatory)

Any action repeated more than one time must be automated.

- If you perform the same action twice, create a simple Bash script in `scripts/` (or extend an existing one).
- Prefer small, readable scripts with predictable flags and clear output.
- When relevant, expose the script through a `package.json` command.
- After adding/changing automation, update documentation in both:
  - `README.md` (developer-facing workflow), and
  - `AGENTS.md` (agent workflow/command contract).
- Do not keep repetitive manual steps in active workflows once automated.
- Current automation scripts:
  - `scripts/dev.sh` → `npm run dev`
  - `scripts/qa.sh` → `npm run qa`
  - `scripts/lighthouse.sh` → `npm run lighthouse`
  - `scripts/new-project.sh` → `npm run new:project <slug>`

## 5) Development Workflow (Feature Work)

1. Pick a ticket from `docs/PORTFOLIO_VISION_AND_JIRA_TASKS.md` (e.g., `PORT-014`) and review linked UX rules in `docs/UX_DESIGN_SPEC.md`.
2. Create branch: `feat/port-014-projects-page`.
3. Implement the smallest complete change.
4. Run local checks:
   - `npm run qa` (automation wrapper; equivalent to format + validate)
   - `npm run dev` (manual UI check)
5. Update docs/checklists if behavior changed (especially `docs/UX_DESIGN_SPEC.md` and related ticket acceptance criteria in `docs/PORTFOLIO_VISION_AND_JIRA_TASKS.md`).
6. Mark ticket checklist progress (`[ ]` → `[x]`) when complete.
7. Open PR with:
   - ticket ID,
   - summary,
   - screenshots (if UI),
   - test notes.

### Ticket checklist tracking guide (`[ ]` / `[x]`)

Use checklist items in ticket docs (for example `docs/PORTFOLIO_VISION_AND_JIRA_TASKS.md`) to track real progress.

1. Write each item as unchecked in both sections:
   - `### Steps`
   - `### Acceptance Criteria`
2. Use this format: `- [ ] Item description`
3. When done, switch it to checked: `- [x] Item description`
4. If blocked/in progress, keep `[ ]` and add a short note under the item
5. Mark a ticket complete only when **all Steps and all Acceptance Criteria** are `[x]`

Example:

```md
### Steps

- [x] Configure command contract scripts
- [ ] Add Playwright smoke tests

### Acceptance Criteria

- [x] `npm run validate` passes
- [ ] Smoke suite passes locally
```

## 6) Content Workflow (Markdown Projects)

Use Markdown-driven content for all project entries.

1. Create file: `src/content/projects/<slug>.md` (or generator script).
2. Fill required frontmatter (schema in `src/content.config.ts`), including `lane: professional | personal`.
3. Include measurable impact bullets where possible.
4. Sanitize confidential/internal client details.
5. Run `npm run validate` and verify rendering in `npm run dev`.

## 7) Testing Workflow

## A) Required checks before merge

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Manual responsive check (mobile/tablet/desktop)
- Manual keyboard navigation + visible focus states

## B) Manual QA checklist (UI changes)

- Sticky header stays visible while scrolling (mobile + desktop)
- Section anchor navigation (`#home`, `#projects`, `#about`, `#contact`) works correctly
- No layout overflow at small widths
- Project cards and links are accessible
- Lane toggle (`All | Professional | Personal`) works correctly inside the Projects section
- Professional vs Personal contrast remains readable and consistent
- Animations are subtle and respect reduced motion

## C) E2E smoke tests (Playwright)

Include smoke tests for:

- Single-page load
- Sticky header visibility on scroll
- Section anchor navigation
- Projects list/filter render
- Contact links visible and clickable

## 8) Deployment Workflow (GitHub Pages)

1. PR merged to `main`.
2. GitHub Action runs build + deploy to Pages.
3. Verify live site, core sections, and anchor navigation.
4. If deployment fails, fix in follow-up PR immediately.

### Important Astro config notes

- Repo Pages (`https://<user>.github.io/<repo>/`) → `base: '/<repo>/'`
- User/org root domain or custom domain → `base: '/'`
- Always set correct `site` in `astro.config.*`

## 9) Quality and Style Rules

- Prefer semantic HTML and accessible components.
- Keep JS minimal; avoid unnecessary hydration.
- Keep animations subtle (150–250ms).
- Use project design tokens (colors/spacing/typography).
- External links must use `rel="noopener noreferrer"`.

## 10) Security and Professionalism Rules

- Never commit secrets or tokens.
- Avoid exposing confidential project details.
- Keep dependencies reasonably up to date.
- Validate all external links before publishing.

## 11) Agent Execution Notes

When an agent works on a ticket, it should:

1. Reference the ticket ID in commit/PR notes.
2. Make focused changes only (avoid unrelated refactors).
3. Run validation commands locally before handing off.
4. Report exactly what was changed and what remains.

## 12) Personal infoemarion

Reference the files in the directory `my-info` to learn about my projects amd my personal information to use in the porfolio website.

## 13) Done Criteria (Project-level)

The project is considered MVP-ready when:

- Core sections are complete on the single-page layout (Home, Projects, About, Contact).
- Content is generated from Markdown project entries.
- CI validation is green.
- Site is deployed and working on GitHub Pages.
- Accessibility/performance checks meet plan thresholds.
