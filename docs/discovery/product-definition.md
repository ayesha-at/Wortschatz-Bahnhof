# 01 — Product

## Concept
**Wortschatz-Bahnhof** — a daily German vocabulary game where A1/A2 learners
practice noun articles (der/die/das) through short interactive challenges,
styled as a railway departure board.

## Problem
PDF/list-based vocabulary revision is tedious and easy to abandon. The
learner already has good source material (three hand-compiled word lists,
262 nouns) — the missing piece isn't more content, it's a format that
survives daily contact. A list you have to reopen and scroll through doesn't
build a habit; a short, repeatable interaction does.

## How Might We
How might we make repetitive German noun memorization engaging enough for
beginners to practice every day?

## Target user
A1–A2 German learner who already has vocabulary lists but struggles with
consistent revision. Specifically: a self-directed learner (not in a
classroom being assigned drills) who needs the tool itself to supply the
motivation to return.

## Core loop
Choose words → practice → make mistakes → repeat difficult words → improve →
return tomorrow.

## Why the railway/station concept
The dataset itself is full of transit vocabulary — *Bahnhof, Gleis,
Fahrkarte, Fahrplan, Abfahrt* — so the metaphor isn't decorative, it's
already latent in the content. "Wortschatz-Bahnhof" (vocabulary station),
three practice modes framed as **Gleis 1 / 2 / 3** (platforms), a sorting
game framed as a **Sortierbahnhof** (marshalling yard) — gives the product an
actual identity instead of defaulting to "German Vocabulary Quiz App," which
would be generic and forgettable.

## The three Gleise (modes) and what each is for
| Mode | Purpose | Interaction |
|---|---|---|
| **Gleis 1 — Karteikarten** (Flashcards) | Learn / review | Self-paced: see word, reveal article + translation, self-rate |
| **Gleis 2 — Artikel-Quiz** (Article Quiz) | Test recall | Active recall: guess the article before seeing it |
| **Gleis 3 — Sortierbahnhof** (Sorting Station) | Speed / engagement | Timed, rapid-fire — the mode designed to be genuinely fun, not just useful |

This is a deliberate progression from passive (flashcards) → active recall
(quiz) → pressure-tested (timed game), though the current build lets the
learner jump between them freely rather than enforcing the order — see
`02-user-flow.md` for why, and `decisions.md` Step 7 for the planned
"Today's Journey" sequencing.

## What this document does not cover
Visual/UI decisions live in `04-visual-design.md`. Screen-by-screen structure
and the retrospective wireframe comparison live in `03-wireframes.md`.
Chronological build decisions (what changed, when, why) live in
`decisions.md`.
