# UI Jira Tasks — Audit-Driven Backlog

This backlog is derived from:
- `docs/audits/2026-05-24-ui-ux-a11y-audit.md`
- `docs/audits/2026-05-24-ui-ux-a11y-implementation-plan.md`

Goal: convert audit findings into clear, trackable Jira-style implementation tasks.

---

## Priority Sequence

1. **P0:** UI-001 (mobile filter visibility)
2. **P1:** UI-002 (active nav + `aria-current` reliability)
3. **P2:** UI-003 + UI-004 + UI-005 (readability, density, keyboard flow)
4. **P3:** UI-006 + UI-007 (semantics + wayfinding improvements)
5. **Release gate:** UI-008 (QA + regression verification)

---

## UI-001 — Fix mobile filter panel off-screen opening behavior

**Type:** Bug  
**Priority:** Highest (P0)  
**Severity mapped:** Critical (`C-01`)  
**Depends on:** None

### Description

Ensure the project filter panel opens visibly within the viewport on small devices.

### Steps

- [x] Rework filter panel opening behavior for mobile-first viewports (`320x640`, `375x812`).
- [x] Keep initial panel position inside visible viewport bounds on open.
- [x] Ensure opening feedback is immediate and visually obvious.
- [x] Preserve expected close behavior (`Escape`, outside click/tap, trigger toggle).
- [x] Confirm no disruptive scroll jumps when the filter first opens.

### Acceptance Criteria

- [x] Opening filter on `320x640` shows panel in-view without manual scroll.
- [x] Opening filter on `375x812` shows panel in-view without manual scroll.
- [x] First focusable filter control is visible after open.
- [x] Keyboard users can open/close filter predictably.
- [x] Mobile interaction feels consistent for touch and keyboard input.

### WCAG Relevance

- 1.4.10 Reflow
- 2.4.3 Focus Order
- 3.2.2 On Input

---

## UI-002 — Make active nav state and `aria-current` deterministic for anchors

**Type:** Bug  
**Priority:** High (P1)  
**Severity mapped:** High (`H-01`)  
**Depends on:** UI-001 (recommended), can run in parallel

### Description

Align visual active navigation and `aria-current` state with the user’s real location for hash navigation and scroll tracking.

### Steps

- [x] Define deterministic rules for active section when multiple sections are partially visible.
- [x] Synchronize visual active nav state and `aria-current` updates.
- [x] Validate behavior for direct hash URLs (`#home`, `#projects`, `#about`, `#contact`) and refresh.
- [x] Validate behavior near page end where section overlap is common.

### Acceptance Criteria

- [x] Clicking each top-nav anchor highlights the matching nav item.
- [x] `aria-current` always matches the visible active item.
- [x] Direct load to any section hash sets correct active state.
- [x] No mismatched active state in late-page sections.

### WCAG Relevance

- 2.4.8 Location
- 3.2.3 Consistent Navigation
- 4.1.2 Name, Role, Value

---

## UI-003 — Improve hero text readability on medium/large viewports

**Type:** Story  
**Priority:** Medium (P2)  
**Severity mapped:** Medium (`M-01`)  
**Depends on:** None

### Description

Reduce reading strain in the hero by improving text measure and first-screen scannability.

### Steps

- [x] Refine hero content width behavior for desktop/tablet readability.
- [x] Preserve hierarchy between heading, supporting paragraph, and CTAs.
- [x] Validate readability at `1024x768` and `1440x900`.

### Acceptance Criteria

- [x] Hero paragraph is easier to scan on desktop without reducing clarity.
- [x] Visual hierarchy remains clear (headline > support copy > CTA).
- [x] No readability regression on mobile layouts.

### WCAG Relevance

- 1.4.8 Visual Presentation (advisory)

---

## UI-004 — Reduce Projects section cognitive load and improve scanning

**Type:** Story  
**Priority:** Medium (P2)  
**Severity mapped:** Medium (`M-02`)  
**Depends on:** UI-001

### Description

Improve projects section information architecture so users can quickly parse content and continue to lower sections.

### Steps

- [x] Introduce stronger progressive disclosure in project presentation.
- [x] Reduce first-pass visual density for cards/chips/metadata.
- [x] Improve section landmarks and scanning rhythm.
- [x] Keep detailed info available without overwhelming default view.

### Acceptance Criteria

- [x] Projects are noticeably easier to scan at first glance.
- [x] Scroll fatigue is reduced before reaching Experience/Skills/About/Contact.
- [x] Users can still access full project detail paths quickly.

---

## UI-005 — Improve keyboard efficiency within filter interactions

**Type:** Accessibility Story  
**Priority:** Medium (P2)  
**Severity mapped:** Medium (`M-03`)  
**Depends on:** UI-001

### Description

Reduce interaction cost for keyboard users in the projects filter flow.

### Steps

- [x] Streamline keyboard path for common filtering actions.
- [x] Improve grouping and orientation cues inside filter controls.
- [x] Ensure easy exit/return path from filter region to project results.

### Acceptance Criteria

- [x] Keyboard-only users can apply common filters in fewer steps.
- [x] Focus order remains predictable and understandable.
- [x] Entering and exiting filter controls does not disorient users.

### WCAG Relevance

- 2.1.1 Keyboard
- 2.4.3 Focus Order
- 2.4.6 Headings and Labels

---

## UI-006 — Add explicit semantic context for filter container

**Type:** Accessibility Task  
**Priority:** Low (P3)  
**Severity mapped:** Low (`L-01`)  
**Depends on:** UI-001, UI-005

### Description

Provide clearer assistive-technology context for the filter container and its relationship to the trigger.

### Steps

- [x] Add explicit semantic framing for filter region context.
- [x] Confirm trigger state and controlled-region semantics stay synchronized.
- [x] Validate with screen reader spot checks.

### Acceptance Criteria

- [x] Screen reader users get clear context when filter opens.
- [x] Region association with filter trigger is explicit and consistent.
- [x] Semantic improvements do not break current keyboard behavior.

### WCAG Relevance

- 1.3.1 Info and Relationships
- 4.1.2 Name, Role, Value

---

## UI-007 — Improve top-level wayfinding for major middle sections

**Type:** UX Story  
**Priority:** Low (P3)  
**Severity mapped:** Low (`L-02`)  
**Depends on:** UI-002

### Description

Improve discoverability of key sections (`Experience`, `Skills`, `Certifications`) for recruiter/client scanning behavior.

### Steps

- [x] Define wayfinding strategy for mid-page sections within current single-page model.
- [x] Validate that high-intent users can reach credential sections in one direct action.
- [x] Keep navigation pattern consistent across desktop/mobile.

### Acceptance Criteria

- [x] Users can quickly jump to credentials-focused sections.
- [x] Navigation remains clear and consistent across viewport sizes.
- [x] Added wayfinding does not clutter primary navigation.

---

## UI-008 — Audit regression verification and release sign-off

**Type:** QA Task  
**Priority:** High (release gate)  
**Severity mapped:** Cross-cutting  
**Depends on:** UI-001 through UI-007 (as applicable)

### Description

Run a full UX/a11y regression pass to confirm all audit-driven changes are stable.

### Steps

- [x] Re-run Playwright interaction audit flows.
- [x] Verify viewport matrix: `320x640`, `375x812`, `768x1024`, `1024x768`, `1440x900`.
- [x] Verify interaction matrix: touch-simulated, mouse, keyboard-only.
- [x] Verify nav matrix: direct hashes, in-page anchor clicks, refresh behavior.
- [x] Validate focus visibility/order, `aria-current` consistency, filter discoverability, reduced-motion behavior.
- [x] Confirm no console errors/warnings during core flows.
- [x] Publish final QA summary report.

### Acceptance Criteria

- [x] All resolved tickets pass targeted checks.
- [x] No regressions in sticky header, anchor navigation, or filtering.
- [x] Accessibility-critical findings are closed or formally deferred with rationale.
- [x] Release sign-off report is documented.

---

## Suggested Epic Grouping

- **EPIC-UI-A11Y-01: Mobile Filter Reliability** → UI-001, UI-005, UI-006
- **EPIC-UI-NAV-01: Navigation Orientation and Wayfinding** → UI-002, UI-007
- **EPIC-UI-READABILITY-01: Readability and Content Density** → UI-003, UI-004
- **EPIC-UI-QA-01: Regression and Release Validation** → UI-008
