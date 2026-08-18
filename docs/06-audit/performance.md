# 06 — Performance Audit

Static review of the app's performance profile. No build step exists (no
bundler, no minification), so this is a review of the source as-shipped,
not a bundle analysis.

## Footprint

| File | Lines | Notes |
|---|---|---|
| `index.html` | 162 | Structure only, no inline scripts beyond none |
| `css/style.css` | ~890 | Single file, hand-written, no unused-CSS tooling run against it |
| `js/data.js` | 260 | Static word array, 259 entries — data, not logic |
| `js/storage.js` | 123 | localStorage + progress + activity log |
| `js/cards.js` | 134 | Flashcards mode |
| `js/quiz.js` | 105 | Quiz mode |
| `js/sort.js` | 129 | Sort mode |
| `js/progress.js` | 108 | Progress view (Gleis 4, added in Step 10) |
| `js/app.js` | 162 | Routing/init |

Total JS ≈ 1,021 lines across 7 files, loaded as seven separate `<script>`
tags in `index.html` (no bundling, no `defer`/`async` on any of them — see
below). For a project this size the lack of a build step is a reasonable
trade-off, not a problem to fix; the concerns below are about load order
and runtime behavior, not file size.

## Script loading

All seven scripts are loaded via plain `<script src="...">` tags at the end
of `<body>`, in dependency order (`data.js` → `storage.js` → `cards.js` →
`quiz.js` → `sort.js` → `progress.js` → `app.js`), each blocking render
until fetched and executed, then `init()` runs on `DOMContentLoaded`.

- **Fine as-is:** placing scripts at the end of `<body>` already avoids
  blocking the initial HTML parse/paint, which is the main win `defer`
  would otherwise provide. For seven small local files with no external
  dependencies between them, the difference is marginal.
- **Worth knowing:** the load order is a real dependency chain (`cards.js`,
  `progress.js` read globals defined in `storage.js` and `data.js`), so
  this can't be reordered or parallelized without adding `defer` to all
  seven (which preserves execution order) — flagging this so a future
  refactor doesn't break it by treating the scripts as independent.
  `progress.js` specifically must load after `storage.js` (uses
  `getEntry()`) and before `app.js` (which calls `renderProgressScreen()`
  from its mode-switch dispatch) — one more link in a chain that's already
  order-sensitive, not a new category of risk.

## External dependencies

One external network request: the Google Fonts `@import` at the top of
`style.css` (Space Mono + Work Sans). This is a render-blocking CSS import
by default — the browser must fetch and parse the imported stylesheet
before the rest of `style.css` (which references those fonts) is usable.
For a single-page practice tool this is a minor, acceptable cost, but if
load time on slow connections becomes a concern, the standard fix is
switching from `@import` to a `<link rel="preload">` + `<link>` pair in
`index.html`, which lets the browser fetch the font in parallel with the
stylesheet instead of serially after it.

## Runtime behavior

- **DOM queries are cached at module load, not repeated per interaction:**
  every `js/*.js` file grabs its `document.getElementById(...)` references
  once at the top into `const`s, and event handlers reuse those references.
  This is the correct pattern and avoids the common vanilla-JS performance
  mistake of re-querying the DOM inside hot paths (e.g. every Sort-mode
  answer, which can fire dozens of times in 45 seconds).
- **`saveProgress()` is debounced** (400ms via `setTimeout`/`clearTimeout`),
  so rapid Sort-mode answers don't trigger a synchronous
  `localStorage.setItem` + `JSON.stringify` of the whole progress object on
  every single click — this matters because `localStorage` writes are
  synchronous and block the main thread; batching them is the right call
  and was already done.
- **`weightedPick()` rebuilds a weighted array on every call** (`app.js`) by
  looping the filtered pool and pushing each word 1–4 times. At the current
  scale (≤259 words, weights capped at 4×) this is at most ~1000 array
  pushes per pick — negligible on any modern device, and not worth
  optimizing pre-emptively. Worth revisiting only if the word list grows by
  an order of magnitude.
- **`renderHeaderStats()` filters the full `WORDS` array** on every
  save (`WORDS.filter(w => getEntry(w).box >= 3)`) to compute the mastered
  count. Same conclusion: O(259) per save is not a real cost at this scale.
- **`renderProgressScreen()` (Gleis 4, Step 10) does three O(259) passes**
  over `WORDS` — one each for mastery-by-article, the mistakes list, and
  (indirectly, via `getEntry()`) the per-word lookups both need. It only
  runs on tab switch to Progress, not on every save like the two functions
  above, so this is a smaller total cost than it might look in isolation.
  The mistakes list additionally sorts the filtered `withMisses` array
  (bounded by `WORDS.length`, so still trivial at this scale) before
  slicing to the top 5.
- **`progress.activity` is capped at 60 entries** (`storage.js`,
  `recordActivity()`) specifically so this new array can't grow unbounded
  over months of daily use — the streak calendar only ever reads the last
  7, so 60 is already generous headroom, not a tight limit.

## Storage

Progress is one JSON blob under a single `localStorage` key
(`wortschatz-progress-v1`), read once on load and rewritten wholesale (not
diffed) on every debounced save. For a data set this size (a few hundred
small objects) this is simpler and more robust than incremental updates
would be, and avoids partial-write corruption risk — a reasonable choice,
not a shortcut that needs revisiting.

## Summary

No real performance problems found at the current scale. The two items
worth acting on if this ever gets a build step or a stricter budget:

1. Swap the Google Fonts `@import` for a preloaded `<link>` pair to remove
   one serial network hop from first paint.
2. Nothing else — the app is small enough, and the hot paths (word
   selection, progress save) are already written in a way that doesn't
   need algorithmic changes.

See `lighthouse-results.md` for the automated companion pass — an actual
Lighthouse run will catch render-blocking-resource warnings (the font
import above) with real numbers instead of estimates.
