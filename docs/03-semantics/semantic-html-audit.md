# 03 — Semantic HTML Audit

Audit of `index.html` as actually shipped, not as planned. Checked against:
correct landmark/element choice, ARIA usage that matches the
[APG](https://www.w3.org/WAI/ARIA/apg/) patterns it references, and whether
any element is used for its visual effect rather than its meaning.

## Method
Read `index.html` top to bottom, one verdict per structural decision.
No automated tooling here — that's `06-audit/accessibility.md`
(axe/manual checks) and `06-audit/lighthouse-results.md` (Lighthouse). This
document is markup-semantics only: does each element mean what it looks
like.

## Findings

### Document structure — pass
`<html lang="de">` is correct: the visible content (nouns, articles,
feedback strings) is predominantly German, so `lang="de"` is more accurate
than `en` even though UI chrome ("Streak", "Correct") is English. A single
root lang attribute is the right call for a single-language-dominant page;
per-span `lang` overrides aren't warranted here.

### `<header class="board-head">` — pass
Used for the introductory block containing the title, stats, progress, and
mode navigation. This is a legitimate `<header>` use (page-level intro
content), not a decorative `<div>` relabelled.

### Gleis tabs — pass, and unusually complete
```html
<nav role="tablist" aria-label="Practice modes" class="gleise">
  <button role="tab" aria-selected="true" aria-controls="view-cards" id="tab-cards" ...>
```
This matches the [ARIA Tabs
Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) correctly:
`role="tablist"` on the container, `role="tab"` + `aria-selected` +
`aria-controls` on each button, and each corresponding panel
(`view-cards`, `view-quiz`, `view-sort`, `view-progress`) is `role="tabpanel"` with
`aria-labelledby` pointing back at its tab. This is the single strongest
piece of semantic work in the file — most hand-built tab UIs skip the
`aria-controls`/`aria-labelledby` pairing entirely.

**One gap:** keyboard arrow-key navigation between tabs (Left/Right to move
focus, per the APG pattern) isn't implemented in `app.js` — only click
handlers exist. Screen reader users get correct announcements; keyboard-only
sighted users can still Tab to each button individually (nothing is
unreachable), but they don't get the idiomatic "arrow keys switch tabs"
behavior. Logged in `06-audit/accessibility.md`.

### Filter chips — pass, correct pattern choice
```html
<button role="checkbox" aria-checked="true" aria-label="Show all words" ...>
```
`role="checkbox"` is the right call here, not `role="radio"`/`radiogroup`,
because the filters are independent toggles conceptually (even though the
current implementation only allows one active at a time — see
`05-logic/user-flow.md` for why). If multi-select filtering is ever added,
no markup change is needed; the semantics already support it.

### Buttons vs. divs — pass
Every interactive control in the file — mode tabs, filter chips, reveal
button, again/know actions, quiz answer buttons, sort start/again — is a
real `<button>`. There is no `<div onclick>` anywhere. This matters more
than it sounds: it's the difference between getting keyboard activation
(Enter/Space), focusability, and correct role exposure for free versus
having to hand-roll all three.

### Live regions — pass, appropriately scoped
```html
<div class="quiz-feedback" aria-live="polite" id="quizFeedback"></div>
<div class="timer-flap mono" role="status" id="sortTimer">45</div>
```
`aria-live="polite"` on quiz feedback is correct — it's informational, not
urgent, and shouldn't interrupt. `role="status"` on the sort timer is a
reasonable choice for a numeric countdown, though seeing it announce every
second in some screen readers is worth a listen-through — if it turns out
to be noisy, throttling the announcement (e.g. only at 10s/5s/3s.../0)
would be a `06-audit` follow-up, not a semantics fix.

**Gap:** the flashcard reveal (article + translation appearing) is not in
a live region. A screen reader user who presses "Show article" gets no
announcement that new content appeared — they have to navigate to find it
manually. This is a real gap, not a stylistic one. Logged in
`06-audit/accessibility.md`.

### Panel/section nesting — pass
`<section class="panel" role="main">` wrapping four `role="tabpanel"`
sections is slightly redundant (a page typically has one `<main>`, and
`role="main"` on a `<section>` works but a literal `<main>` element would
be more idiomatic and needs no explicit role). Not wrong, just not
maximally idiomatic — low-priority cleanup.

**Related:** there's no "skip to main content" link before the header.
Lower-severity for a page this short (the header block is small, so
tabbing past it isn't a heavy burden), but the header repeats above every
tab panel switch, so a skip link is still a legitimate cheap addition —
one `<a href="#view-cards" class="skip-link">Skip to practice</a>` as the
very first focusable element, visually hidden until focused.

### Heading structure — resolved
Previously the only heading in the document was
`<h1 class="brand-title">WORTSCHATZ‑BAHNHOF</h1>`, with nothing at `<h2>`
for the app's modes. Fixed alongside the Gleis 4 (Progress) build (see
`docs/DECISIONS.md` Step 10): each of the four mode panels — Flashcards,
Article Quiz, Sorting Game, Progress — now has a visually-hidden `<h2>`
(`.visually-hidden` utility class), so heading-based screen reader
navigation now has something meaningful to jump between, without changing
the visible design (the Gleis tab labels remain the visible labelling).

### `<p class="foot-note">` — pass
Plain descriptive footer text, correctly a `<p>`, not a `<footer>` (there's
no site-wide footer content here — copyright, nav, etc. — just one caption
line, so `<p>` is the more accurate choice over the landmark element).

## Summary

| Area | Verdict |
|---|---|
| Landmark structure | Pass (minor: `<main>` vs `role="main"`) |
| Tabs pattern | Pass — correctly implements ARIA Tabs Pattern |
| Filter chips | Pass — correct role for future-proofing |
| Interactive controls | Pass — all real `<button>`s |
| Live regions | Partial — quiz feedback covered, card reveal not |
| Heading hierarchy | Resolved — `<h2>` added per mode panel, incl. Gleis 4 |

No element is being used purely for its visual effect (no heading used for
size, no `<div>` standing in for a button). The two real gaps — reveal
announcement and heading hierarchy — are carried into
`06-audit/accessibility.md` as concrete action items rather than fixed
silently here, since this document's job is to describe what's true, not
to patch it.
