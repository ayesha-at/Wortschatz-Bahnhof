# 🚂 WORTSCHATZ-BAHNHOF

> **Next Departure:** Your German Vocabulary Fluency!
> **Destination:** A1/A2 German Article Mastery (*der*, *die*, *das*)
> **Engine:** 100% Vanilla HTML / CSS / JS — Zero Dependencies, Zero Build Step!

---

### 🛈 Station Overview & Live Board

```
======================================================================
  [ DEPARTURES / ABFAHRTEN ]                   STATUS: ON TIME 🟢
----------------------------------------------------------------------
  * TOTAL VOCABULARY UNITS  ::  259 Essential Nouns
  * PRACTICE PLATFORMS      ::  4 Interactive Gleise (Modes)
  * SPAGHETTI CODE          ::  0% (Pure Vanilla Engineering)
  * BUILD TIME / DEPS       ::  0s / 0 Libraries
  * NETWORK DEPENDENCY      ::  None (100% Offline `localStorage`)
======================================================================

```

---

## 🚉 Why the Railway Station Metaphor?

German vocabulary is naturally packed with transit vocabulary: **der Bahnhof**, **das Gleis**, **die Fahrkarte**, **der Fahrplan**! Instead of forcing an arbitrary theme, *Wortschatz-Bahnhof* embraces the transit metaphor directly into its core design system.

> 📖 **Deep Dive:** Want the full product design story? Check out [`docs/01-discovery/product-definition.md`](https://www.google.com/search?q=docs/01-discovery/product-definition.md).

---

## 🛄 Interactive Platform Guide (The 4 Gleise)

Select your platform and start training!

| Platform | Mode | Objective | Mechanics |
| --- | --- | --- | --- |
| **Gleis 1** | **Karteikarten**<br>

<br>*(Flashcards)* | **Learn & Review** | Self-paced exploration. Reveal article + translation, then self-rate your confidence. |
| **Gleis 2** | **Artikel-Quiz**<br>

<br>*(Article Quiz)* | **Test Recall** | Active recall in action: lock in your guess (*der*, *die*, or *das*) before revealing the card! |
| **Gleis 3** | **Sortierbahnhof**<br>

<br>*(Sorting Station)* | **Speed & Reflexes** | **45-second rapid-fire blitz!** Sort incoming nouns onto their correct article tracks under pressure. |
| **Gleis 4** | **Fortschritt**<br>

<br>*(Progress)* | **Reflect & Track** | View mastery breakdown by article, track your 7-day streak calendar, and identify top missed words. |

### 🧠 Leitner Spaced-Repetition System

Every noun travels through **Boxes 0 to 3**:

* 🟢 **Correct Answer:** Word moves up a box $\rightarrow$ Scheduled for review further in the future.
* 🔴 **Incorrect Answer:** Word drops back to Box 0 $\rightarrow$ Scheduled for immediate review.

*Read the complete algorithmic specs in [`docs/05-logic/user-flow.md`](https://www.google.com/search?q=docs/05-logic/user-flow.md).*

---

## 🚀 Quick Start (Board the Train in 10 Seconds)

No `npm install`, no node modules, no hassle!

```bash
# 1. Clone the repository
git clone https://github.com/your-username/wortschatz-bahnhof.git

# 2. Enter the station
cd wortschatz-bahnhof

# 3. All aboard! Open directly in your favorite browser
open index.html

```

💡 **Need a Local Web Server?** (Recommended for Lighthouse testing):

```bash
npx serve .

```

---

## 📁 Train Station Blueprint (Project Structure)

```
wortschatz-bahnhof/
├── 📄 index.html             # Main Application Shell (Clean, Semantic HTML5)
├── 📄 DECISIONS.md          # Chronological Architectural & Design Decision Log
├── 🎨 css/
│   └── style.css            # Custom CSS3 (CSS Variables, Responsive Layouts)
├── ⚡ js/
│   ├── data.js              # 259 Essential A1/A2 Nouns
│   ├── storage.js           # Offline Progress & Leitner Box Engine (`localStorage`)
│   ├── cards.js             # Gleis 1: Flashcard Logic
│   ├── quiz.js              # Gleis 2: Quiz Logic
│   ├── sort.js              # Gleis 3: 45-second Timed Sorting Game
│   ├── progress.js          # Gleis 4: Visual Stats & Streak Engine
│   └── app.js               # Central Router & Event Orchestrator
├── 📚 docs/                 # Architectural & Engineering Audits
│   ├── 01-discovery/        # Product Concept & Target Persona
│   ├── 02-wireframes/        # Retrospective Wireframes
│   ├── 03-semantics/         # HTML Semantics Audit
│   ├── 04-style/            # Split-Flap & Departure Board Design System
│   ├── 05-logic/            # User Flow & Algorithmic State Specs
│   └── 06-audit/            # Accessibility, Performance & Audit Reports
└── 🖼️ assets/
    └── screenshots/         # App Previews & Audit Artifacts

```

---

## 🚦 Lighthouse Audit Scorecard

⚡ High-speed performance and maximum accessibility built directly into the base code:

| Metric Category | Mobile Score | Desktop Score | Station Inspection Notes |
| --- | --- | --- | --- |
| **Performance** | **98** 🟢 | **100** 🟢 | Lightning-fast initial render with zero bundler overhead |
| **Accessibility** | **96** 🟢 | **96** 🟢 | ARIA-friendly markup and high-contrast styling |
| **Best Practices** | **100** 🟢 | **100** 🟢 | Zero external dependencies; modern standard JS |
| **SEO** | **90** 🟢 | **90** 🟢 | Clean semantic HTML structure |

---

## 🗺️ Documentation Express Map

Looking for specific technical documentation? Jump straight to your stop:

* 🎯 **Product Vision:** [`docs/01-discovery/product-definition.md`](https://www.google.com/search?q=docs/01-discovery/product-definition.md)
* 📐 **Design Wireframes:** [`docs/02-wireframes/wireframes.md`](https://www.google.com/search?q=docs/02-wireframes/wireframes.md)
* 🏗️ **HTML Semantics:** [`docs/03-semantics/semantic-html-audit.md`](https://www.google.com/search?q=docs/03-semantics/semantic-html-audit.md)
* 🎨 **Visual Design System:** [`docs/04-style/visual-design.md`](https://www.google.com/search?q=docs/04-style/visual-design.md)
* ⚙️ **App Logic & State Flow:** [`docs/05-logic/user-flow.md`](https://www.google.com/search?q=docs/05-logic/user-flow.md)
* ♿ **Accessibility Audit:** [`docs/06-audit/accessibility.md`](https://www.google.com/search?q=docs/06-audit/accessibility.md)
* 📈 **Performance & Lighthouse Audit:** [`docs/06-audit/performance.md`](https://www.google.com/search?q=docs/06-audit/performance.md)
* 📝 **Architecture Decision Log:** [`DECISIONS.md`](https://www.google.com/search?q=DECISIONS.md)

---

## 🛠️ Station Roadmap & Upgrades

* [ ] **"Today's Journey" Guided Sequencing:** Enforce daily learning flow (*Flashcards* $\rightarrow$ *Quiz* $\rightarrow$ *Sorting*).
* [ ] **Spaced-Repetition Synchronization for Gleis 3:** Align sorting-mode accuracy with exact date-based spaced-repetition timestamps.
* [ ] **Accessibility Enhancements:** Add interactive keyboard navigation for tab switching and refine `--ink-faint` contrast ratio.

---

*Gute Reise auf deiner Deutsch-Lernreise!* 🚂💨