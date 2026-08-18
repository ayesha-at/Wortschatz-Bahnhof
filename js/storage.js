// ============================================================
// STORAGE — localStorage + progress management
// ============================================================

const STORE_KEY = 'wortschatz-progress-v1';

let progress = {
  perNoun: {},
  streak: { count: 0, lastDate: null },
  totalReviews: 0,
  sortBest: 0,
  activity: []
};

// --- Helpers ---

function keyOf(w) {
  return w.noun.toLowerCase() + '|' + w.article;
}

function getEntry(w) {
  const k = keyOf(w);
  if (!progress.perNoun[k]) {
    progress.perNoun[k] = {
      box: 0,
      seen: 0,
      correct: 0,
      nextReview: todayStr()
    };
  }
  return progress.perNoun[k];
}

function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

// --- Load / Save ---

let saveTimer = null;

async function loadProgress() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      progress = Object.assign(progress, parsed);
    }
  } catch (e) {
    // First run, no data yet
  }
  bumpStreakIfNeeded();
  renderHeaderStats();
}

function saveProgress() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(progress));
    } catch (e) {
      // Storage unavailable — progress stays in memory
    }
  }, 400);
}

// --- Streak ---

function bumpStreakIfNeeded() {
  const t = todayStr();
  if (progress.streak.lastDate === t) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const y = yesterday.getFullYear() + '-' +
    String(yesterday.getMonth() + 1).padStart(2, '0') + '-' +
    String(yesterday.getDate()).padStart(2, '0');

  if (progress.streak.lastDate === y) {
    progress.streak.count += 1;
  } else if (progress.streak.lastDate) {
    progress.streak.count = 1;
  } else {
    progress.streak.count = 1;
  }
  progress.streak.lastDate = t;
  recordActivity(t);
  saveProgress();
}

// --- Activity log (for the streak calendar on the Progress screen) ---
// Stores one entry per day the app was opened. Capped so it can't grow
// unbounded over months of daily use — only the last 60 days are kept,
// which is far more than the 7-day calendar view needs.

function recordActivity(dateStr) {
  if (!progress.activity.includes(dateStr)) {
    progress.activity.push(dateStr);
    if (progress.activity.length > 60) {
      progress.activity = progress.activity.slice(-60);
    }
  }
}

// --- Stats ---

function renderHeaderStats() {
  document.getElementById('streakNum').textContent = progress.streak.count;

  const mastered = WORDS.filter(w => {
    const e = getEntry(w);
    return e.box >= 3;
  }).length;

  document.getElementById('masteredNum').textContent = mastered;

  const pct = Math.round(100 * mastered / WORDS.length);
  document.getElementById('progFill').style.width = pct + '%';
  document.getElementById('progText').textContent = mastered + ' / ' + WORDS.length + ' mastered';
  document.getElementById('progPct').textContent = pct + '%';
}