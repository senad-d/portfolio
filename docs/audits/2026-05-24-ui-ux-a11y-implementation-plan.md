# UI/UX + Accessibility Implementation Plan

**Source audit:** `docs/audits/2026-05-24-ui-ux-a11y-audit.md`  
**Objective:** Resolve prioritized UX/UI and accessibility issues without changing product scope.

---

## Severity Legend
- **Critical** = Blocks or severely degrades core task completion
- **High** = Significant confusion, orientation loss, or accessibility risk
- **Medium** = Noticeable friction that impacts efficiency/readability
- **Low** = Quality polish and semantic improvements

---

## Phase 1 — Critical Stabilization (Immediate)

### Issue C-01 — Mobile filter menu opens off-screen
- **Severity:** Critical
- **Affected areas:** Projects section, mobile filter interaction (`320–375` widths)
- **Why it matters:** Users do not get reliable visual confirmation that filter opened; interaction appears broken.
- **Recommended UX/UI improvements:**
  1. Reposition filter surface so it opens within viewport on small screens.
  2. Constrain filter container to viewport-safe bounds (top/bottom in-view behavior).
  3. Ensure opening filter provides immediate visible state change without requiring manual scroll.
  4. Maintain predictable close behavior (tap-outside/Escape) with clear state feedback.
- **Validation targets:**
  - On `320x640` and `375x812`, opening filter shows panel immediately in view.
  - First focusable filter option is visible after open.
  - No unexpected scroll jump required for first interaction.

---

## Phase 2 — Navigation & Orientation Reliability

### Issue H-01 — `aria-current` / active section can mismatch intended anchor near page end
- **Severity:** High
- **Affected areas:** Sticky header nav (`#about`, `#contact`), section tracking logic
- **Why it matters:** Users and assistive tech may receive conflicting location signals.
- **Recommended UX/UI improvements:**
  1. Make active-state behavior deterministic for hash-driven navigation.
  2. Define clear tie-break rules when multiple sections are visible simultaneously.
  3. Keep visual active state and `aria-current` synchronized.
  4. Ensure anchor navigation to late-page sections preserves expected orientation context.
- **Validation targets:**
  - Clicking each nav anchor results in matching active nav item.
  - `aria-current` always matches visible active state.
  - Behavior remains consistent after refresh and direct deep links.

### Issue L-02 — Main nav omits several major content sections
- **Severity:** Low (promote to Medium if stakeholder goal is quick recruiter scanning)
- **Affected areas:** Information architecture and top-level navigation
- **Why it matters:** Reduces direct access to important profile evidence (Experience/Skills/Certifications).
- **Recommended UX/UI improvements:**
  1. Align top nav with key content architecture, or provide equivalent shortcut pattern.
  2. Clarify which sections are primary vs secondary in wayfinding model.
- **Validation targets:**
  - High-intent users can reach credentials sections in one direct action from header.

---

## Phase 3 — Readability, Density, and Interaction Efficiency

### Issue M-01 — Hero paragraph line length is too long on desktop
- **Severity:** Medium
- **Affected areas:** Hero copy readability on larger viewports
- **Why it matters:** Long lines reduce comprehension/scannability in first impression zone.
- **Recommended UX/UI improvements:**
  1. Apply readable measure constraints for long-form intro text.
  2. Preserve hierarchy between headline and supporting paragraph.
  3. Keep CTA grouping visually dominant relative to body copy.
- **Validation targets:**
  - Desktop intro copy remains comfortably scannable with shorter measure.
  - No readability regression on tablet/mobile.

### Issue M-02 — Projects section visual density is very high
- **Severity:** Medium
- **Affected areas:** Projects information architecture, vertical rhythm, scanning flow
- **Why it matters:** Long dense list delays discovery of later sections and increases cognitive load.
- **Recommended UX/UI improvements:**
  1. Introduce clearer progressive disclosure across project content.
  2. Reduce simultaneous on-screen metadata per card at first glance.
  3. Improve scan landmarks (grouping, segmentation, or staged reveal patterns).
  4. Preserve easy access to full details without overwhelming initial pass.
- **Validation targets:**
  - Faster visual scanning of projects on first pass.
  - Reduced scroll fatigue before reaching lower sections.

### Issue M-03 — Filter keyboard journey is long and effortful
- **Severity:** Medium
- **Affected areas:** Keyboard accessibility and efficiency within filter controls
- **Why it matters:** High tab cost slows power users and keyboard-only users.
- **Recommended UX/UI improvements:**
  1. Reduce interaction steps required to reach common filter outcomes.
  2. Improve control grouping and quick narrowing affordances.
  3. Keep keyboard flow efficient and easy to exit.
- **Validation targets:**
  - Keyboard users can set common filters in materially fewer steps.
  - Focus path is predictable, with clear return to results.

---

## Phase 4 — Accessibility Semantics Polish

### Issue L-01 — Filter panel lacks explicit semantic context
- **Severity:** Low
- **Affected areas:** Filter panel assistive-tech discoverability
- **Why it matters:** Complex control regions benefit from explicit semantic framing.
- **Recommended UX/UI improvements:**
  1. Provide explicit accessible context for the filter container.
  2. Maintain robust control labeling and grouping semantics.
  3. Keep trigger state and controlled-region semantics tightly coupled.
- **Validation targets:**
  - Screen reader announces clear context when filter opens.
  - Relationship between trigger and filter region is unambiguous.

---

## Recommended QA Pass Criteria (Post-implementation)

1. **Viewport matrix:** `320x640`, `375x812`, `768x1024`, `1024x768`, `1440x900`
2. **Interaction matrix:** mouse, touch-simulated, keyboard-only
3. **Navigation matrix:** direct hash URLs + in-page anchor clicks + refresh state
4. **Accessibility spot checks:**
   - Focus visibility and order
   - Active nav vs `aria-current` consistency
   - Filter discoverability and context announcements
   - Reduced-motion behavior retained
5. **Regression gate:** no console errors/warnings during audited flows

---

## Delivery Priority Summary

1. **P0:** Fix off-screen mobile filter behavior (critical usability/accessibility risk)
2. **P1:** Correct active nav/`aria-current` reliability for deep sections
3. **P2:** Improve readability and density (hero measure + projects scannability)
4. **P3:** Polish filter semantics and keyboard efficiency
