# 06 — Accessibility Audit

Manual audit of `index.html` + `css/style.css` + `js/*.js` as shipped.
Automated Lighthouse numbers live in `lighthouse-results.md`. This document is the manual pass: keyboard,
screen-reader semantics, contrast, and motion.

## What's already right (carried over from `03-semantics` and `04-style`)

- Full ARIA Tabs Pattern on the Gleis nav (`role="tablist"`/`tab`/
  `tabpanel`, `aria-selected`, `aria-controls`, `aria-labelledby`).
- Every interactive control is a real `<button>` — full keyboard
  focusability and activation for free.
- `:focus-visible` outline is explicit and never suppressed.
- `aria-live="polite"` on quiz feedback.
- `prefers-reduced-motion: reduce` is respected globally.
- Color is never the sole signal for correct/wrong states — paired with
  text labels.
- `lang="de"` set correctly for the dominant content language.
- Each mode panel (including Gleis 4 / Progress) has a visually-hidden
  `<h2>`, giving heading-based screen reader navigation something to
  jump between — fixed during the Gleis 4 build, see
  `docs/DECISIONS.md` Step 10.

These are listed here (not just in their source docs) because an
accessibility audit should show its work on what passes, not only what
fails — otherwise "audit" reads as "list of complaints."

## Lighthouse Verification

Lighthouse accessibility score (incognito): **96**

This confirms the ARIA implementation (tabs, checkboxes, live regions) is working correctly. The only accessibility gaps found are:

1. **Flashcard reveal not announced** — no live region on the card content
2. **Heading hierarchy** — only one heading in the document
3. **Skip-to-content link** — missing for keyboard users

See `../03-semantics/semantic-html-audit.md` for full details.

**Lighthouse result:** 96 — Excellent.

## Open findings

### 1. Flashcard reveal is not announced (High)
Pressing "Show article" swaps text into `#cardArticleFlap`,
`#cardTranslation`, and `#cardPluralNote` — none of which are in a live
region. A screen reader user gets no signal that new content appeared.
**Fix:** add `aria-live="polite"` to the card's translation/article
container (or a visually-hidden status element that announces "der Auge —
Eye" once the flap settles), mirroring what `quiz.js`/`quizFeedback`
already does correctly.

### 2. Tab list has no arrow-key navigation (Medium)
The APG Tabs Pattern that the markup otherwise follows correctly expects
Left/Right (or Up/Down) arrow keys to move focus between tabs, with Tab
itself moving focus *out* of the tablist. Currently only click handlers
are wired in `app.js`; keyboard users must Tab through each button
individually, which works but isn't the expected pattern for this role.
**Fix:** add a `keydown` handler on `.gleise` that moves focus (and
optionally auto-activates) on ArrowLeft/ArrowRight, per the standard
pattern.

### 3. Sort-mode timer announcements — needs a listen-through (Low)
`role="status"` on `#sortTimer` updating every second may be too chatty in
practice (some screen readers announce every `status` mutation). Not
confirmed broken — flagged for verification once real AT testing happens
(see "Not yet verified" below). If confirmed noisy, throttle to
key checkpoints (10s, 5s, 3-2-1) rather than every tick.

### 4. Dead `quizEn` element (Low, cross-referenced)
Already logged in `05-logic/user-flow.md` and
`02-wireframes/wireframes.md` — an empty DOM node that's never populated
isn't an accessibility bug per se (screen readers skip empty elements),
but it's dead weight worth resolving alongside the other Gleis 2 items in
`DECISIONS.md` Step 9.

### 5. No skip-to-content link (Low)
Cross-referenced from `03-semantics/semantic-html-audit.md`. Low severity
here since the header is small, but cheap to add: one visually-hidden
`<a href="#view-cards">` as the first focusable element.

### 6. `--ink-faint` text fails AA contrast (Medium — confirmed, not just predicted)
Computed against the WCAG relative-luminance formula:

| Pair | Ratio | AA (4.5:1 body / 3:1 large) |
|---|---|---|
| `--ink-faint` (#5b6382) on `--bg` (#0e121a) | 3.17:1 | Fails for body text |
| `--ink-faint` on `--panel` (#171d2b) | 2.85:1 | Fails |
| `--ink-soft` (#8e97b5) on `--bg` | 6.47:1 | Passes |
| `--ink` (#e3e7f2) on `--bg` | 15.16:1 | Passes |
| `--amber` (#ffb734) on `--bg` | 10.78:1 | Passes |

`--ink-faint` is used for the footer note, filter-adjacent captions, and
similar secondary labels (`css/style.css`) — small, low-priority text, but
still real content, not purely decorative. At 3.17:1 it fails AA for
regular-size body text (needs 4.5:1) though it would pass the 3:1 bar if
every use were large/bold text, which not all of them are.
**Fix:** either lighten `--ink-faint` slightly (roughly to `#6d7699` or
similar would clear 4.5:1 on `--bg`) or restrict its use to genuinely
large-text contexts only.


## Priority order for fixes

1. Flashcard reveal live-region (real screen-reader-blocking gap)
2. `--ink-faint` contrast fix (confirmed AA failure, one-line CSS change)
3. Arrow-key tab navigation (spec-correctness for an already-good pattern)
4. Skip-to-content link (cheap, low severity)
5. Full contrast sweep / AT verification pass (needs tooling)
6. Timer announcement frequency, dead `quizEn` element cleanup (low severity)

Heading hierarchy was fixed during the Gleis 4 (Progress) build — see
finding history above and `docs/DECISIONS.md` Step 10 — so it's no longer
on this list.
