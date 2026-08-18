// ============================================================
// QUIZ — Article Quiz mode (Gleis 2)
// ============================================================

let curQuiz = null;
let quizCorrectCount = 0;
let quizStreakCount = 0;
let quizTotalCount = 0;

// --- DOM refs ---
const quizNoun = document.getElementById('quizNoun');
const quizEn = document.getElementById('quizEn');
const quizFeedback = document.getElementById('quizFeedback');
const quizCorrect = document.getElementById('quizCorrect');
const quizStreak = document.getElementById('quizStreak');
const quizTotal = document.getElementById('quizTotal');
const quizNextBtn = document.getElementById('quizNextBtn');
const quizBtns = document.querySelectorAll('#view-quiz .qbtn');

// --- Next question ---

function nextQuiz() {
  const pool = filteredWords();
  curQuiz = weightedPick(pool);

  quizBtns.forEach(b => {
    b.disabled = false;
    b.className = 'qbtn ' + b.dataset.g;
  });

  quizFeedback.textContent = '';
  quizNextBtn.style.display = 'none';
  quizEn.textContent = '';

  if (!curQuiz) {
    quizNoun.textContent = 'All done 🎉';
    quizBtns.forEach(b => b.disabled = true);
    return;
  }

  quizNoun.textContent = curQuiz.noun;
}

// --- Answer ---

quizBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (!curQuiz) return;

    const chosen = btn.dataset.g;
    const correct = chosen === curQuiz.article;

    // Disable all buttons and show correct/wrong
    quizBtns.forEach(b => {
      b.disabled = true;
      if (b.dataset.g === curQuiz.article) b.classList.add('correct');
      else if (b === btn) b.classList.add('wrong');
    });

    // Update progress
    const e = getEntry(curQuiz);
    e.seen++;
    if (correct) {
      e.correct++;
      e.box = Math.min(3, e.box + 1);
      quizCorrectCount++;
      quizStreakCount++;

      // Spaced repetition
      const days = [0, 1, 3, 7];
      const d = new Date();
      d.setDate(d.getDate() + days[e.box]);
      e.nextReview = d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
    } else {
      e.box = 0;
      e.nextReview = todayStr();
      quizStreakCount = 0;
    }

    quizTotalCount++;
    progress.totalReviews++;

    // Update stats
    quizCorrect.textContent = quizCorrectCount;
    quizStreak.textContent = quizStreakCount;
    quizTotal.textContent = quizTotalCount;

    // Feedback
    let feedback = (correct ? '✓ Correct — ' : '✗ Correct answer is "' + curQuiz.article + '" — ') + curQuiz.en;
    if (curQuiz.plural && curQuiz.pluralArticleDiffers) {
      feedback += '  (plural: die ' + curQuiz.plural + ' — plural marker only, not a gender change)';
    }
    quizFeedback.textContent = feedback;
    quizEn.textContent = '';

    quizNextBtn.style.display = 'block';
    saveProgress();
    renderHeaderStats();
  });
});

// --- Next ---

quizNextBtn.addEventListener('click', nextQuiz);