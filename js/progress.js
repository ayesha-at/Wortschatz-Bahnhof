// ============================================================
// PROGRESS — Progress view (Gleis 4)
// ============================================================
//
// Read-only view over data every other mode already writes:
// progress.perNoun (box/seen/correct per word, from storage.js) and
// progress.activity (daily activity log, from storage.js). This module
// adds no new tracking of its own beyond what renderProgressScreen()
// computes on demand — see docs/DECISIONS.md Step 10.

const masteryDerEl = document.getElementById('masteryDer');
const masteryDieEl = document.getElementById('masteryDie');
const masteryDasEl = document.getElementById('masteryDas');
const streakCalEl = document.getElementById('streakCal');
const mistakesListEl = document.getElementById('mistakesList');

// --- Mastery by article ---

function renderMasteryByArticle() {
  const counts = {
    der: { mastered: 0, total: 0 },
    die: { mastered: 0, total: 0 },
    das: { mastered: 0, total: 0 }
  };

  WORDS.forEach(w => {
    const bucket = counts[w.article];
    bucket.total++;
    if (getEntry(w).box >= 3) bucket.mastered++;
  });

  masteryDerEl.textContent = counts.der.mastered + ' / ' + counts.der.total;
  masteryDieEl.textContent = counts.die.mastered + ' / ' + counts.die.total;
  masteryDasEl.textContent = counts.das.mastered + ' / ' + counts.das.total;
}

// --- Streak calendar (last 7 days, oldest to newest) ---

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function dateStrOffset(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return {
    str: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'),
    dayLabel: DAY_LABELS[d.getDay()]
  };
}

function renderStreakCalendar() {
  streakCalEl.innerHTML = '';
  for (let i = 6; i >= 0; i--) {
    const { str, dayLabel } = dateStrOffset(i);
    const active = progress.activity.includes(str);
    const isToday = i === 0;

    const cell = document.createElement('div');
    cell.className = 'streak-day' + (active ? ' active' : '') + (isToday ? ' today' : '');
    cell.setAttribute('role', 'img');
    cell.setAttribute(
      'aria-label',
      dayLabel + (isToday ? ' (today)' : '') + ': ' + (active ? 'practiced' : 'no practice')
    );
    cell.innerHTML = '<span aria-hidden="true">' + dayLabel + '</span>';
    streakCalEl.appendChild(cell);
  }
}

// --- "Anschluss verpasst" — missed connections (highest miss-rate words) ---

function renderMistakesList() {
  mistakesListEl.innerHTML = '';

  const withMisses = WORDS
    .map(w => {
      const e = getEntry(w);
      const misses = e.seen - e.correct;
      return { word: w, seen: e.seen, misses };
    })
    .filter(x => x.seen > 0 && x.misses > 0)
    .sort((a, b) => b.misses - a.misses || b.seen - a.seen)
    .slice(0, 5);

  if (withMisses.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'mistakes-empty';
    empty.textContent = 'No missed words yet — practice a few rounds to see them here.';
    mistakesListEl.appendChild(empty);
    return;
  }

  withMisses.forEach(({ word, seen, misses }) => {
    const li = document.createElement('li');
    li.className = 'mistake-item';
    li.innerHTML =
      '<span class="mistake-word"><span class="g">' + word.article.toUpperCase() + '</span>' + word.noun + '</span>' +
      '<span class="mistake-frac mono">' + misses + '/' + seen + '</span>';
    mistakesListEl.appendChild(li);
  });
}

// --- Refresh entry point (called by app.js on tab switch) ---

function renderProgressScreen() {
  renderMasteryByArticle();
  renderStreakCalendar();
  renderMistakesList();
}
