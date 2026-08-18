# 04 — Visual Design

Documents the visual system as implemented in `css/style.css`, and why it
looks the way it does. Written after the fact (like `02-wireframes/`), but
these decisions were settled early and haven't drifted — see `DECISIONS.md`,
Step 1.

## Concept: split-flap departure board

The railway framing from `01-discovery/product-definition.md` isn't just in
the copy ("Gleis 1/2/3", "Sortierbahnhof") — it's the literal visual
reference. The flashcard article reveal cycles through `der`/`die`/`das`
text on a 55ms interval before landing (`cards.js`, `flapCycle()`), imitating
a mechanical split-flap (Solari) departure board. The header is called
`.board-head` and carries a dashed amber line across the top standing in for
the board's edge lighting. This is the one piece of the concept that lives
in both the JS and the CSS at once — worth knowing if either file is
touched in isolation later.

## Color system

```css
--bg: #0e121a;        /* near-black base */
--panel: #171d2b;      /* card/header surface */
--panel-2: #1f2740;    /* lighter surface, used in gradients */
--line: #2b3350;       /* borders */
--amber: #ffb734;      /* accent — the "board" color */
--ink: #e3e7f2;        /* primary text */
--ink-soft: #8e97b5;   /* secondary text */
--ink-faint: #5b6382;  /* tertiary/caption text */
```

Dark, desaturated navy base with a single warm accent (amber) — consistent
with TT's stated aesthetic preference for dark, minimal, editorial design
rather than a generic light "app" look. Amber specifically reads as
departure-board amber LED, not a generic brand color, which reinforces the
railway concept rather than sitting on top of it decoratively.

### Article colors — functional, not decorative
```css
--der: #5b8fd9;  /* blue */
--die: #e2617e;  /* rose */
--das: #57bd8a;  /* green */
```
Each grammatical gender gets one fixed hue used consistently across all
four modes (card article flap, quiz buttons, sort buttons/platforms, and
the Progress screen's mastery-by-article cards — added in
`docs/DECISIONS.md` Step 10, using the same tokens rather than a new set).
This is load-bearing, not aesthetic — a learner builds a color→gender
association over repeated sessions, which is a second, non-verbal recall
channel on top of the text itself. Changing these colors later would cost
the learner's existing association, so any future restyle should treat
this specific triplet as closer to a data contract than a palette choice.

Each also has a matching `-bg` tint (`--der-bg`, `--die-bg`, `--das-bg`) at
16% alpha, used for selected/correct states without needing a second set of
hard-coded colors.

## Typography

```css
@import url('...family=Space+Mono:wght@400;700&family=Work+Sans:...');
```
Two-font system:
- **Work Sans** — UI text, body copy, translations. Humanist, легible at
  small sizes, doesn't compete with the content.
- **Space Mono** (`.mono` utility class) — numbers, stats, the article flap
  itself, timer. Monospace reinforces the "mechanical board display" concept
  or "ticket stub" reading — this is deliberate, not a default fallback.

This split means every stat (`streakNum`, `masteredNum`, `sortTimer`,
`sortScore`) and every article flap uses `.mono`, while prose (translations,
plural notes, quiz feedback) stays in Work Sans. Consistent throughout the
CSS — no stray sans-serif numbers or mono prose found in the audit.

## Motion

- Article flap cycles at 55ms intervals for ~420ms before settling
  (`cards.js`) — fast enough to read as "mechanical flip," not slow enough
  to feel like a loading delay.
- Progress bars, chip states, and button states use short (120–300ms)
  transitions — functional feedback, not showcase animation.
- **`prefers-reduced-motion: reduce` is respected** (`style.css` line ~722):
  all animation/transition durations collapse to near-zero. This was
  clearly a deliberate accessibility pass, not an oversight — worth noting
  in `06-audit/accessibility.md` as a thing already done right rather than
  an item to fix.

## Responsive behavior

Single breakpoint at `max-width: 380px` reduces font sizes for the noun
word, quiz word, sort word, and brand title. The layout itself doesn't
change structurally at any width (`.wrap` just caps at `max-width: 640px`
and centers) — this is a single-column app by design, not one that
reflows into a different layout on desktop. Reasonable for a mobile-first
daily-practice tool; revisit only if a desktop-specific layout is ever
requested (not currently planned — see `DECISIONS.md`).

## Accessibility-relevant style decisions

- `:focus-visible` gets an explicit amber outline (`style.css` line ~716)
  — focus is never suppressed, which is easy to get wrong when a design
  leans minimal.
- Color is never the *only* signal: correct/wrong states in quiz and sort
  modes pair color with the button's own DER/DIE/DAS label and (for
  quiz) explicit checkmark/cross text in the feedback line, not color
  alone.

## What this document does not cover

Whether these choices actually pass contrast/motion/focus checks under
testing is `06-audit/accessibility.md`. Markup-level semantic correctness
(not visual) is `03-semantics/semantic-html-audit.md`. This document only
answers "what was designed and why," not "does it verifiably work."
