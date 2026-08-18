# Decisions Log

A running record of the choices made across the build, in the order they
were made — kept separate from the discovery/wireframes/style/logic docs so
the *reasoning* for a choice is findable in one place instead of scattered
across every doc that happens to touch it. Other docs cross-reference steps
here by number.

## Step 1 — Visual identity: railway signage over generic quiz UI

**Decision:** commit to a split-flap departure-board aesthetic (dark panels,
amber accent, monospace stat readouts) instead of a conventional light
flashcard-app look.
**Why:** the dataset already contains transit vocabulary (*Bahnhof, Gleis,
Fahrkarte*), so the metaphor is latent in the content rather than an
arbitrary skin. A generic "German Vocabulary Quiz" look would be
forgettable; the station framing gives the product an actual identity.
**Where it shows up:** `docs/04-style/visual-design.md`, component naming
throughout `css/style.css` (`.board-head`, `.stat-flap`, `.timer-flap`).

## Step 2 — Three modes, framed as platforms (Gleise)

**Decision:** structure practice as three distinct modes — Karteikarten
(flashcards, low-stakes review), Artikel-Quiz (tested recall), Sortierbahnhof
(timed arcade round) — rather than one generic "quiz" screen.
**Why:** passive review, active recall, and pressure-tested speed are three
different cognitive tasks; collapsing them into one mode would force a
one-size-fits-all difficulty curve. Framing them as Gleis 1/2/3 also
reinforces the station metaphor from Step 1 on every screen, not just the
hero copy.
**Trade-off accepted:** modes are currently freely switchable rather than
sequenced — see Step 7.

## Step 2b — Plural disambiguation note

**Decision:** show a conditional note on any word whose plural takes a
different-looking article form (e.g. *das Haar* → *die Haare*), on both
the flashcard reveal and the quiz feedback line.
**Why:** German plurals always take `die` regardless of the singular's
actual gender — surfaced as a real confusion risk during a dataset review,
not a hypothetical one. Without the note, a learner could reasonably infer
"this word is die" from seeing the plural form somewhere else and
mis-file the singular's gender.
**Where it shows up:** `pluralArticleDiffers` flag in `js/data.js`,
rendered in `js/cards.js` and `js/quiz.js`; referenced in
`docs/02-wireframes/wireframes.md`.

## Step 3 — Leitner-style box progress instead of plain seen/unseen tracking

**Decision:** track a 0–3 "box" per word (see
`docs/05-logic/user-flow.md`) driving both a weighted-random pick for
practice and a spaced-repetition `nextReview` date, rather than simple
seen/unseen or a raw percentage-correct score.
**Why:** raw accuracy doesn't distinguish "answered correctly once, ages
ago" from "answered correctly five times recently" — box+interval does, and
it's a well-understood, easy-to-reason-about model for a solo learner to
trust.
**Known gap:** Sort mode updates `box` but not `nextReview` — documented as
an open inconsistency in `docs/05-logic/user-flow.md` rather than silently
left unmentioned.

## Step 4 — Semantic tab pattern for mode switching, not just styled divs

**Decision:** use the full ARIA tablist/tab/tabpanel pattern for Gleis
switching, with `aria-selected`, `aria-controls`, and matching ids kept in
sync in `app.js`, instead of plain clickable divs.
**Why:** the three modes are genuinely tab-like (mutually exclusive views of
the same word set), so the correct ARIA pattern was available and cheap to
apply correctly from the start rather than retrofitted later. See the full
audit in `docs/03-semantics/semantic-html-audit.md` for what's still
missing around it (headings, skip link).

## Step 5 — Wireframes produced retrospectively, not upfront

**Decision:** build the working prototype first, then generate low-fidelity
wireframes from it (`docs/02-wireframes/build_wireframes.py`, a
reproducible PIL script) as a structural sanity check, rather than
wireframing before writing code.
**Why:** for a solo build with a clear mental model of the UI already
(three-mode practice tool), wireframing-first would have been process
overhead without changing the outcome. Doing it retrospectively still
catches structural issues — e.g. it surfaced that "Home/Dashboard" was
never actually a separate screen (see `docs/02-wireframes/wireframes.md`,
"Implementation reality" note) — while keeping the roadmap step honest
about when it actually happened.

## Step 6 — Filter chips as independent toggles, not a radio group

**Decision (semantics):** keep the filter bar as five `role="checkbox"`
chips even though only one is ever active at a time.
**Status:** flagged, not yet changed. `docs/03-semantics/semantic-html-audit.md`
recommends `role="radiogroup"`/`role="radio"` as the more correct pattern;
this entry exists so the current markup reads as a known, deliberate stopgap
rather than an unnoticed bug when the audit is revisited.

## Step 7 — "Today's Journey" guided sequencing (proposed, not built)

**Decision:** defer enforcing a Flashcards → Quiz → Sort order. Currently
all three Gleise are freely switchable at any time.
**Why deferred:** the current free-jump behavior was the simpler, lower-risk
default to ship first, and it's not clear yet whether sequencing helps
retention enough to justify the added flow complexity (progress gating,
new UI for "next up") without user data to test the assumption against.
**Status:** proposed roadmap item, referenced from
`docs/01-discovery/product-definition.md` and
`docs/02-wireframes/wireframes.md` (`5-progress-proposed.png`). Not
scheduled.

## Step 8 — Progression / mastery model review (proposed, not built)

**Open question:** should Gleis 3 (sort game) results feed the same
day-based `nextReview` schedule as Gleis 1/2, or stay separate as
currently implemented (sort updates `box` but never `nextReview` — see
Step 3's "known gap" and `docs/05-logic/user-flow.md`)? Also covers
whether the daily streak should require a minimum amount of practice
rather than incrementing on app open alone (`bumpStreakIfNeeded()`
currently fires once per load, regardless of activity).
**Status:** not decided. Referenced from
`docs/02-wireframes/wireframes.md` ("Step 8 (progression)") and
`docs/05-logic/user-flow.md`.

## Step 9 — Gleis 2 (quiz) cleanup (proposed, not built)

**Decision needed:** resolve the dead `#quizEn` element — it exists in
`index.html` and is referenced in `js/quiz.js`, but is populated with an
empty string on every code path, so it never actually shows an English
hint. Either wire it up as a toggleable hint or remove the dead markup.
**Status:** first flagged during the Step 5 retrospective wireframe pass
(`docs/02-wireframes/wireframes.md`), confirmed independently in
`docs/05-logic/user-flow.md` and `docs/06-audit/accessibility.md`. Not
started.

## Step 10 — Progress screen ("Anschluss verpasst") — built

**Decision:** build the dedicated progress view sketched in the
Step 5 wireframe pass (`docs/02-wireframes/wireframes.md`, screen 5), as
Gleis 4: mastery breakdown by article (der/die/das aren't learned at an
even rate), a 7-day streak calendar, and a "missed connections" list of
the top 5 highest-miss-rate words.
**Why it was a presentation gap, not a data gap:** `progress.perNoun`
already tracked `seen`/`correct`/`box` per word from Steps 2–5, so the
mastery breakdown and mistakes list needed no new tracking — they're
computed on demand in the new `js/progress.js` module by grouping/sorting
existing data. The one genuinely new piece of tracking was the streak
calendar, since `progress.streak` previously stored only a running count
and last-active date, not which specific days were active. Added
`progress.activity` (a capped 60-entry date log, `js/storage.js`) to
support the 7-day view without over-storing.
**Implementation notes:**
- New tab: `GLEIS 4 / Fortschritt`, `#tab-progress` → `#view-progress`,
  following the same ARIA tab pattern as Gleis 1–3.
- Filters are hidden on this tab (`js/app.js`) — mastery/mistakes data
  isn't filterable by article the way practice pools are.
- `.gleise` moved from `flex` to a 4-column `grid` (`css/style.css`) to
  fit the new tab; the `gsub` subtitle line is hidden under 380px to
  keep four tabs from feeling cramped on small phones.
- Mistakes list caps at 5 words, sorted by miss count (ties broken by
  times seen), and shows an empty-state message rather than nothing when
  no misses exist yet.
- Added a `.visually-hidden` utility and gave each of the four mode
  panels a hidden `<h2>` at the same time — this also resolves the
  heading-hierarchy gap flagged in
  `docs/03-semantics/semantic-html-audit.md` and
  `docs/06-audit/accessibility.md`, since it was touched in the same pass.
**Verification:** exercised via a headless jsdom simulation (script
injection + click dispatch, no real browser available in this
environment) — confirmed 4 tabs render, mastery counts sum correctly
against the real 259-word dataset (115 der / 89 die / 55 das), the
streak calendar renders 7 cells with correct today-marking, the mistakes
list populates from simulated wrong answers, and filters hide correctly
on the new tab. Not substituted for a real-browser/manual check before
shipping.
**Status:** built. Not yet covered by `docs/06-audit/lighthouse-results.md`
or a full manual accessibility pass — both should be re-run to include
this screen (see those docs).

## Step 11 — Documentation/audit pass structure (this reorganization)

**Decision:** restructure `docs/` into a numbered `01-discovery` →
`06-audit` pipeline with this file as the cross-cutting decision log, moving
the prototype from "working code with two docs" to a documented,
auditable project.
**Why:** the product-definition and wireframes docs already referenced
`02-user-flow.md`, `04-style/visual-design.md`, and `decisions.md` as if
they existed — this pass fills in those previously-dangling references
with real content pulled from the actual implementation, plus adds the
semantic/accessibility/performance audit layer that didn't exist yet.
**Status:** `docs/06-audit/lighthouse-results.md` results are available, chdck lighthouse-results.md for reference.