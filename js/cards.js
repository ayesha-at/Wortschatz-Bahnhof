// ============================================================
// CARDS — Flashcards mode (Gleis 1)
// ============================================================

let curCard = null;
let cardsSeenSession = 0;

// --- DOM refs ---
const cardsSessFill = document.getElementById('cardsSessFill');
const cardsSessCount = document.getElementById('cardsSessCount');
const cardGenderTag = document.getElementById('cardGenderTag');
const cardNoun = document.getElementById('cardNoun');
const cardArticleFlap = document.getElementById('cardArticleFlap');
const cardTranslation = document.getElementById('cardTranslation');
const cardPluralNote = document.getElementById('cardPluralNote');
const cardHint = document.getElementById('cardHint');
const revealBtn = document.getElementById('revealBtn');
const againBtn = document.getElementById('againBtn');
const knowBtn = document.getElementById('knowBtn');

// --- Next card ---

function nextCard() {
  const pool = filteredWords();
  curCard = weightedPick(pool);
  cardsSeenSession++;

  // Session progress
  const total = pool.length || 1;
  const pct = Math.min(100, (cardsSeenSession % total || total) / total * 100);
  cardsSessFill.style.width = pct + '%';
  cardsSessCount.textContent = cardsSeenSession + ' / ' + total;

  // Reset UI
  cardArticleFlap.className = 'article-flap';
  cardArticleFlap.textContent = '···';
  cardTranslation.classList.remove('show');
  cardTranslation.textContent = '';
  cardPluralNote.classList.remove('show');
  cardPluralNote.textContent = '';
  cardHint.style.display = 'block';
  revealBtn.style.display = 'block';
  againBtn.disabled = true;
  knowBtn.disabled = true;

  if (!curCard) {
    cardNoun.textContent = 'All done 🎉';
    cardGenderTag.textContent = 'NO WORDS LEFT';
    revealBtn.style.display = 'none';
    cardHint.style.display = 'none';
    return;
  }

  cardNoun.textContent = curCard.noun;
  cardGenderTag.textContent = 'NOUN';
}

// --- Flap animation ---

function flapCycle(el, finalText, finalClass, duration) {
  const seq = ['der', 'die', 'das'];
  let i = 0;
  const iv = setInterval(() => {
    el.textContent = seq[i % 3].toUpperCase();
    i++;
  }, 55);

  setTimeout(() => {
    clearInterval(iv);
    el.textContent = finalText;
    el.className = 'article-flap ' + finalClass;
  }, duration);
}

// --- Reveal ---

revealBtn.addEventListener('click', () => {
  if (!curCard) return;

  flapCycle(cardArticleFlap, curCard.article.toUpperCase(), curCard.article, 420);

  setTimeout(() => {
    cardTranslation.textContent = curCard.en;
    cardTranslation.classList.add('show');

    if (curCard.plural) {
      const pn = cardPluralNote;
      if (curCard.pluralArticleDiffers) {
        pn.innerHTML = 'Plural: <b>die ' + curCard.plural + '</b> — that\'s just the plural marker, not a gender change. Singular stays <b>' + curCard.article + ' ' + curCard.noun + '</b>.';
      } else {
        pn.innerHTML = 'Plural: <b>die ' + curCard.plural + '</b>';
      }
      pn.classList.add('show');
    }

    againBtn.disabled = false;
    knowBtn.disabled = false;
  }, 440);

  cardHint.style.display = 'none';
  revealBtn.style.display = 'none';
});

// --- Actions ---

againBtn.addEventListener('click', () => {
  const e = getEntry(curCard);
  e.seen++;
  e.box = 0;
  e.nextReview = todayStr();
  progress.totalReviews++;
  saveProgress();
  renderHeaderStats();
  nextCard();
});

knowBtn.addEventListener('click', () => {
  const e = getEntry(curCard);
  e.seen++;
  e.correct++;
  e.box = Math.min(3, e.box + 1);

  // Spaced repetition: add days based on new box level
  const days = [0, 1, 3, 7];
  const d = new Date();
  d.setDate(d.getDate() + days[e.box]);
  e.nextReview = d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');

  progress.totalReviews++;
  saveProgress();
  renderHeaderStats();
  nextCard();
});