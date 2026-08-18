// ============================================================
// SORT — Sorting Game mode (Gleis 3)
// ============================================================

let sortActive = false;
let sortScore = 0;
let sortWordCur = null;
let sortTimeLeft = 45;
let sortTimerId = null;
let sortStreak = 0;

// --- DOM refs ---
const sortPre = document.getElementById('sortPre');
const sortGame = document.getElementById('sortGame');
const sortResult = document.getElementById('sortResult');
const sortTimer = document.getElementById('sortTimer');
const sortScoreEl = document.getElementById('sortScore');
const sortWord = document.getElementById('sortWord');
const sortFinalScore = document.getElementById('sortFinalScore');
const sortFinalSub = document.getElementById('sortFinalSub');
const sortBestPre = document.getElementById('sortBestPre');
const sortStartBtn = document.getElementById('sortStartBtn');
const sortAgainBtn = document.getElementById('sortAgainBtn');
const sortBtns = document.querySelectorAll('#sortGame .qbtn');

// --- Start ---

function startSort() {
  sortPre.style.display = 'none';
  sortResult.style.display = 'none';
  sortGame.style.display = 'flex';
  sortScore = 0;
  sortTimeLeft = 45;
  sortActive = true;
  sortStreak = 0;

  sortScoreEl.textContent = '0';
  sortTimer.textContent = '45';

  nextSortWord();

  sortTimerId = setInterval(() => {
    sortTimeLeft--;
    sortTimer.textContent = sortTimeLeft;
    if (sortTimeLeft <= 0) endSort();
  }, 1000);
}

// --- Next word ---

function nextSortWord() {
  sortWordCur = WORDS[Math.floor(Math.random() * WORDS.length)];
  sortWord.textContent = sortWordCur.noun;
  sortBtns.forEach(b => {
    b.disabled = false;
    b.className = 'qbtn ' + b.dataset.g;
  });
}

// --- Answer ---

sortBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (!sortActive || !sortWordCur) return;

    const correct = btn.dataset.g === sortWordCur.article;

    // Visual feedback
    btn.classList.add(correct ? 'correct' : 'wrong');
    sortBtns.forEach(b => b.disabled = true);

    // Update progress
    const e = getEntry(sortWordCur);
    e.seen++;

    if (correct) {
      sortStreak++;
      // Bonus for streaks of 5+
      const bonus = sortStreak >= 5 ? 2 : 1;
      sortScore += bonus;
      e.correct++;
      e.box = Math.min(3, e.box + 1);
    } else {
      sortStreak = 0;
      e.box = Math.max(0, e.box - 1);
    }

    sortScoreEl.textContent = sortScore;
    progress.totalReviews++;

    // Next word after short delay
    setTimeout(() => {
      if (sortActive) nextSortWord();
    }, 180);
  });
});

// --- End ---

function endSort() {
  sortActive = false;
  clearInterval(sortTimerId);

  sortGame.style.display = 'none';
  sortResult.style.display = 'flex';

  sortFinalScore.textContent = sortScore;

  const isBest = sortScore > progress.sortBest;
  if (isBest) {
    progress.sortBest = sortScore;
  }

  sortFinalSub.textContent = isBest ?
    'sorted correctly — new best! 🏆' :
    'sorted correctly · Best: ' + progress.sortBest;

  sortBestPre.textContent = progress.sortBest || 0;

  saveProgress();
  renderHeaderStats();
}

// --- Event listeners ---

sortStartBtn.addEventListener('click', startSort);
sortAgainBtn.addEventListener('click', startSort);

// --- Init sort best ---
sortBestPre.textContent = progress.sortBest || 0;