# UI/UX + Accessibility Audit (Playwright)

**Date:** 2026-05-24  
**Auditor role:** Senior UI/UX engineer + accessibility specialist  
**Environment:** Local Astro dev server (`http://127.0.0.1:4321/portfolio/`)  
**Method:** Interactive Playwright CLI user-flow testing across desktop/tablet/mobile

---

## 1) Audit Scope

The audit covered:
- layout consistency
- spacing/alignment
- typography
- responsiveness
- accessibility (WCAG-oriented checks)
- navigation behavior
- interaction feedback
- visual hierarchy
- usability and overall design coherence

No code was modified.

---

## 2) User Flows Tested (Playwright)

1. **Landing + hero CTA flow**
   - Load homepage
   - Tab through skip link and primary nav
   - Trigger hero CTAs (`View projects`, `Contact`)

2. **Sticky header + anchor navigation**
   - Scroll to bottom and confirm header remains visible
   - Navigate via `#home`, `#projects`, `#about`, `#contact`
   - Verify active nav state + `aria-current`

3. **Projects filtering flow**
   - Open/close filter menu
   - Select lane radio options
   - Check stack checkbox interactions
   - Confirm filter summary updates

4. **Details disclosure flow**
   - Keyboard-tab to first `summary`
   - Toggle via keyboard (`Enter`)
   - Confirm content expands/collapses

5. **Responsive flow checks**
   - Tested viewports: `320x640`, `375x812`, `768x1024`, `1024x768`, `1440x900`
   - Checked horizontal overflow, nav behavior, and filter panel placement

6. **A11y spot checks**
   - Focus visibility
   - Heading order
   - landmark/section navigation behavior
   - external link safety (`rel="noopener noreferrer"`)
   - console warnings/errors

---

## 3) Strengths Observed

- **Sticky header works reliably** (`position: fixed`; remains visible while scrolling).
- **No horizontal overflow** detected across tested viewport sizes.
- **Keyboard access is generally solid** for primary nav and `<details>/<summary>` interactions.
- **Focus indicator is visible** (e.g., skip link showed clear 2px outline).
- **Heading structure is logical** (`H1` → `H2` sections → `H3` card/section subheads).
- **Reduced motion support exists** in styles (`prefers-reduced-motion` media handling present).
- **External links correctly include** `rel="noopener noreferrer"`.
- **No browser console errors/warnings** observed during tested flows.

---

## 4) Findings by Severity

## Critical

### C-01 — Mobile filter menu opens off-screen (not visible on open)
**Category:** Responsiveness, usability, interaction feedback, accessibility  
**Evidence:**
- `375x812`: filter button at viewport bottom (`btnTop: 768`, `btnBottom: 812`), menu opens at `panelTop: 820`, `panelBottom: 1276`.
- `320x640`: button `btnBottom: 640`, menu opens at `panelTop: 648`, `panelBottom: 1104`.
- Menu is opened **below viewport**, so users get weak/ambiguous feedback after tapping filter.

**Why this matters:**
- Major discoverability failure on mobile; users may think filter did not open.
- Creates avoidable friction for a core browsing control.
- Impacts keyboard/screen-magnifier users due unexpected scroll jumps when tabbing into off-screen controls.

**WCAG relevance:**
- 1.4.10 Reflow (practical reflow usability)
- 2.4.3 Focus Order (unexpected focus progression context)
- 3.2.2 On Input (interaction predictability)

---

## High

### H-01 — Section active state and `aria-current` can misrepresent user location near page end
**Category:** Navigation, accessibility, information architecture  
**Evidence:**
- Navigating to `#about` near end often yields active nav state as `Contact`.
- At bottom, multiple sections are simultaneously visible (`certifications`, `about`, `contact`), and active-link logic favors another section.

**Why this matters:**
- Users lose orientation (“Where am I?”) in long single-page flows.
- `aria-current` inconsistency can mislead assistive technology users.

**WCAG relevance:**
- 2.4.8 Location
- 3.2.3 Consistent Navigation
- 4.1.2 Name, Role, Value (state accuracy)

---

## Medium

### M-01 — Hero paragraph line length is too long on large screens
**Category:** Typography, readability, visual hierarchy  
**Evidence:**
- Estimated character-per-line (CPL):
  - `1440px`: ~120 CPL
  - `1024px`: ~106 CPL

**Why this matters:**
- Long line lengths reduce reading speed and comprehension.
- Weakens scannability for first-impression messaging.

**WCAG relevance:**
- 1.4.8 Visual Presentation (advisory/AAA guidance on readable line length)

---

### M-02 — Projects section is very dense and dominates scroll journey
**Category:** Visual hierarchy, usability, design coherence  
**Evidence:**
- On mobile (`375x812`), projects section height measured ~`7037px`.
- 16 projects + stack chips + details controls create heavy cognitive load before users reach later sections.

**Why this matters:**
- Makes deeper sections (`Experience`, `Skills`, `Certifications`, `About`, `Contact`) harder to discover.
- Increases scroll fatigue and decision fatigue.

---

### M-03 — Filter panel interaction cost is high (very long tab path)
**Category:** Accessibility, usability  
**Evidence:**
- With filter open, keyboard navigation proceeds through many checkbox controls in sequence before returning to main flow.
- No quick narrowing path is apparent from interaction behavior alone.

**Why this matters:**
- Increases effort for keyboard users.
- Can make filter usage feel cumbersome in practical navigation.

**WCAG relevance:**
- 2.1.1 Keyboard
- 2.4.3 Focus Order
- 2.4.6 Headings and Labels (efficient orientation)

---

## Low

### L-01 — Filter panel lacks explicit semantic container role/label
**Category:** Accessibility semantics  
**Evidence:**
- Filter trigger uses `aria-expanded` and `aria-controls`, but filter container reported no explicit role/aria-label.

**Why this matters:**
- Screen reader context may be less explicit than ideal when entering a complex filter region.

**WCAG relevance:**
- 1.3.1 Info and Relationships
- 4.1.2 Name, Role, Value

---

### L-02 — Primary nav does not expose all major mid-page sections
**Category:** Navigation, usability  
**Evidence:**
- Header nav contains `Home`, `Projects`, `About`, `Contact` only.
- Page contains additional major sections (`Experience`, `Skills`, `Certifications`) without top-level nav shortcuts.

**Why this matters:**
- Reduces direct wayfinding for high-intent users scanning credentials quickly.

---

## 5) Overall Design Coherence Assessment

The UI is visually clean and technically stable, with strong baseline accessibility behaviors (focus visibility, skip link presence, semantic headings, keyboard support). The main coherence gap is **interaction ergonomics at mobile scale**, especially in the projects filtering experience, plus **information density** in the projects section relative to single-page navigation goals.

The biggest quality uplift will come from improving mobile filter behavior and tightening reading/scanning ergonomics.
