// ============================================================
// APP — Main app: routing, filters, init
// ============================================================

// --- State ---

let activeFilter = 'all';

// --- DOM refs ---
const gleisBtns = document.querySelectorAll('.gleis-btn');
const modeViews = {
  cards: document.getElementById('view-cards'),
  quiz: document.getElementById('view-quiz'),
  sort: document.getElementById('view-sort'),
  progress: document.getElementById('view-progress')
};
const filterContainer = document.getElementById('filters');
const chipEls = document.querySelectorAll('.chip');

// --- Filters ---

function filteredWords() {
  return WORDS.filter(w => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'due') {
      const e = getEntry(w);
      return e.nextReview && e.nextReview <= todayStr();
    }
    return w.article === activeFilter;
  });
}

function weightedPick(pool) {
  if (pool.length === 0) return null;

  const weighted = [];
  pool.forEach(w => {
    const box = getEntry(w).box;
    const weight = box === 0 ? 4 : box === 1 ? 3 : box === 2 ? 2 : 1;
    for (let i = 0; i < weight; i++) weighted.push(w);
  });

  if (weighted.length === 0) return null;
  return weighted[Math.floor(Math.random() * weighted.length)];
}

// --- Filter UI ---

filterContainer.addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;

  // Update all chips
  chipEls.forEach(c => {
    c.classList.remove('active');
    c.setAttribute('aria-checked', 'false');
  });

  chip.classList.add('active');
  chip.setAttribute('aria-checked', 'true');

  activeFilter = chip.dataset.g;
  refreshCurrentMode();

  // Save filter preference
  try {
    localStorage.setItem('wortschatz-filter', activeFilter);
  } catch (e) { /* ignore */ }
});

// --- Mode switching ---

gleisBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update tabs
    gleisBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });

    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const mode = btn.dataset.mode;

    // Update views
    Object.entries(modeViews).forEach(([key, view]) => {
      view.classList.toggle('active', key === mode);
    });

    // Show/hide filters (hide during sort and progress — neither is filterable)
    filterContainer.style.display = (mode === 'sort' || mode === 'progress') ? 'none' : 'flex';

    refreshCurrentMode(mode);
  });
});

// --- Refresh current mode ---

function refreshCurrentMode(mode) {
  mode = mode || document.querySelector('.gleis-btn.active').dataset.mode;

  if (mode === 'cards') {
    cardsSeenSession = 0; // Reset session counter on filter change
    nextCard();
  }
  if (mode === 'quiz') nextQuiz();
  if (mode === 'progress') renderProgressScreen();
  // Sort doesn't auto-refresh on filter change
}

// --- Restore filter preference ---

function restoreFilter() {
  try {
    const saved = localStorage.getItem('wortschatz-filter');
    if (saved) {
      const chip = document.querySelector(`.chip[data-g="${saved}"]`);
      if (chip) {
        chipEls.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-checked', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-checked', 'true');
        activeFilter = saved;
      }
    }
  } catch (e) { /* ignore */ }
}

// --- Init ---

async function init() {
  // Load progress
  await loadProgress();

  // Restore filter preference
  restoreFilter();

  // Init sort best
  sortBestPre.textContent = progress.sortBest || 0;

  // Start with flashcards
  nextCard();

  // Ensure filter visibility (hidden for sort by default)
  filterContainer.style.display = 'flex';

  console.log('🚂 Wortschatz-Bahnhof initialized');
  console.log('📚 Words:', WORDS.length);
  console.log('📊 Progress:', progress);
}

// --- Handle errors ---

window.addEventListener('error', (e) => {
  console.error('App error:', e.message);
});

// --- Start ---

document.addEventListener('DOMContentLoaded', init);