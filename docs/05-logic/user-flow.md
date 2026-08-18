# 05 — User Flow & Interaction Logic

How state actually moves through the app, read directly from `js/*.js`.
This is the logic counterpart to `02-wireframes/wireframes.md` (screen
structure) and `04-style/visual-design.md` (how it looks) — this document
covers what happens when, and why.

## High-level flow

```
Load app
  → loadProgress() reads localStorage, computes streak
  → restoreFilter() reapplies last-used chip
  → nextCard() populates Gleis 1 (default active tab)
  → user free-navigates between Gleis 1 / 2 / 3 at will
```

There is no forced onboarding or enforced mode order. This is a documented,
deliberate choice — see `01-discovery/product-definition.md`'s note that
modes are a "deliberate progression from passive → active recall →
pressure-tested," but the current build lets the learner jump between them
freely. `DECISIONS.md` Step 7 tracks a proposed "Today's Journey" sequenced
flow that hasn't been built yet.

## Word selection: weighted spaced repetition

Both Gleis 1 (flashcards) and Gleis 2 (quiz) pull from the same
`weightedPick()` in `app.js`, not a plain random draw:

```js
const weight = box === 0 ? 4 : box === 1 ? 3 : box === 2 ? 2 : 1;
```

Each word has a `box` (0–3, a Leitner-style bucket, tracked per-noun in
`progress.perNoun`). Box 0 words (new/struggling) are 4× more likely to be
drawn than box 3 (mastered) words. This means the "random" word that
appears is actually biased toward whatever the learner is worst at —
worth knowing before assuming a rare word showing up repeatedly is a bug;
it's the intended behavior.

**Gleis 3 (sort) is the exception** — `sort.js`'s `nextSortWord()` uses a
flat `Math.random()` pick from the full `WORDS` array, not the weighted
pool. This is consistent with its purpose: Gleis 3 is the speed/engagement
mode (per `01-discovery/product-definition.md`), not a targeted review
mode, so unweighted randomness is correct there, not an inconsistency to
fix.

## Spaced repetition schedule

On a correct answer (flashcard "Got it" or quiz correct), in both
`cards.js` and `quiz.js`:
```js
e.box = Math.min(3, e.box + 1);
const days = [0, 1, 3, 7];   // days until next review, indexed by box
```
A word promoted to box 3 is scheduled 7 days out. A wrong answer resets
`box` to 0 and `nextReview` to today — full reset, not a partial step back.
This is the same schedule table duplicated in both `cards.js` and
`quiz.js` (`sort.js` deliberately does not touch `nextReview`, only `box` —
see below). If the schedule ever needs to change, both files need the edit;
this duplication is a known small maintenance cost, not an oversight.

## The "DUE ONLY" filter

`app.js`'s `filteredWords()`:
```js
if (activeFilter === 'due') {
  const e = getEntry(w);
  return e.nextReview && e.nextReview <= todayStr();
}
```
This is what makes the spaced-repetition data actually usable day to day —
without it, a learner has no way to ask "what should I review *today*"
versus browsing all 259 words. Filter choice persists across sessions via
`localStorage.setItem('wortschatz-filter', ...)`, separate from the main
progress blob.

## Gleis 3 is intentionally not spaced-repetition-integrated the same way

Sort mode updates `box` (correct: `+1` capped at 3; wrong: `-1` floored at
0) but never touches `nextReview` or the day-based schedule. So playing the
sort game can nudge a word's mastery box without affecting when it's next
due in flashcards/quiz. This is consistent with Gleis 3's framing as the
"fun, pressure-tested" mode rather than the primary spaced-repetition
engine — but it does mean a word can look "mastered" (box 3) purely from
sort-game performance without ever having been through a scheduled review.
Whether that's desired long-term is a `DECISIONS.md` Step 8 (progression)
question, not resolved here.

## Streak logic

`storage.js`'s `bumpStreakIfNeeded()` runs once per `loadProgress()` call
(i.e., once per app load, not per action):
- Same calendar day as last visit → no change.
- Exactly yesterday → streak +1.
- Any earlier date, or no prior date → streak resets to 1.

Note this means the streak increments on *opening the app*, not on
completing any particular amount of practice — a learner who opens the app
and does nothing still gets the streak bump. This is a scope decision worth
flagging for `DECISIONS.md`: whether "streak" should require a minimum
number of reviews is an open question, not yet decided either way.

## Save strategy

`saveProgress()` debounces writes with a 400ms `setTimeout`, so rapid
actions (e.g. sort-game answers arriving every ~1s) don't hit
`localStorage` on every single interaction — batched instead. All storage
access is wrapped in `try/catch` with silent fallback to in-memory-only
state if `localStorage` is unavailable (private browsing, quota exceeded,
etc.) — the app degrades rather than throwing.

## Known dead state

`quizEn` (the English-hint element under the quiz noun) is populated with
an empty string in every code path in `quiz.js` — the DOM element exists
(`index.html`) but nothing ever writes a translation into it during the
question phase. Already flagged in `02-wireframes/wireframes.md`; repeated
here because it's a logic gap as much as a UI one. Deferred to
`DECISIONS.md` Step 9.
