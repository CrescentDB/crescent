let flashcards = [];
let currentCardIndex = 0;
let isFlipped = false;

export function initFlashcards() {
  loadFlashcards();
  updateFlashcardDisplay();
}

export function addFlashcard() {
  const front = document.getElementById('flashcardFront')?.value.trim();
  const back = document.getElementById('flashcardBack')?.value.trim();
  
  if (!front || !back) {
    alert('Please fill in both front and back');
    return;
  }
  
  const card = {
    id: Date.now(),
    front: front,
    back: back,
    created: new Date().toISOString(),
    reviewCount: 0,
    lastReviewed: null,
    nextReview: Date.now(),
    interval: 1,
    easeFactor: 2.5
  };
  
  flashcards.push(card);
  saveFlashcards();
  
  document.getElementById('flashcardFront').value = '';
  document.getElementById('flashcardBack').value = '';
  
  updateFlashcardDisplay();
  showNotification('Flashcard added!');
}

export function rateCard(rating) {
  if (flashcards.length === 0) return;
  
  const card = flashcards[currentCardIndex];
  
  card.reviewCount++;
  card.lastReviewed = Date.now();
  
  if (rating === 'hard') {
    card.interval = Math.max(1, Math.floor(card.interval * 0.5));
    card.easeFactor = Math.max(1.3, card.easeFactor - 0.2);
  } else if (rating === 'good') {
    card.interval = Math.ceil(card.interval * card.easeFactor);
  } else if (rating === 'easy') {
    card.interval = Math.ceil(card.interval * card.easeFactor * 1.3);
    card.easeFactor = Math.min(2.5, card.easeFactor + 0.1);
  }
  
  card.nextReview = Date.now() + (card.interval * 86400000);
  
  saveFlashcards();
  nextCard();
}

export function getDueCards() {
  const now = Date.now();
  return flashcards.filter(card => card.nextReview <= now);
}

export function deleteFlashcard(id) {
  flashcards = flashcards.filter(card => card.id !== id);
  saveFlashcards();
  
  if (currentCardIndex >= flashcards.length) {
    currentCardIndex = Math.max(0, flashcards.length - 1);
  }
  
  updateFlashcardDisplay();
}

export function flipCard() {
  const cardElement = document.getElementById('flashcardDisplay');
  if (!cardElement) return;
  
  isFlipped = !isFlipped;
  cardElement.classList.toggle('flipped');
  
  updateCardContent();
}

export function nextCard() {
  if (flashcards.length === 0) return;
  
  currentCardIndex = (currentCardIndex + 1) % flashcards.length;
  isFlipped = false;
  
  const cardElement = document.getElementById('flashcardDisplay');
  if (cardElement) {
    cardElement.classList.remove('flipped');
  }
  
  updateCardContent();
}

export function prevCard() {
  if (flashcards.length === 0) return;
  
  currentCardIndex = currentCardIndex === 0 ? flashcards.length - 1 : currentCardIndex - 1;
  isFlipped = false;
  
  const cardElement = document.getElementById('flashcardDisplay');
  if (cardElement) {
    cardElement.classList.remove('flipped');
  }
  
  updateCardContent();
}

function updateCardContent() {
  const cardContent = document.getElementById('flashcardContent');
  const cardCounter = document.getElementById('flashcardCounter');
  
  if (!cardContent || !cardCounter) return;
  
  if (flashcards.length === 0) {
    cardContent.textContent = 'No flashcards yet. Create one below!';
    cardCounter.textContent = '0 / 0';
    return;
  }
  
  const currentCard = flashcards[currentCardIndex];
  cardContent.textContent = isFlipped ? currentCard.back : currentCard.front;
  cardCounter.textContent = `${currentCardIndex + 1} / ${flashcards.length}`;
}

function updateFlashcardDisplay() {
  updateCardContent();
  updateFlashcardsList();
}

function updateFlashcardsList() {
  const listElement = document.getElementById('flashcardsList');
  if (!listElement) return;
  
  if (flashcards.length === 0) {
    listElement.innerHTML = '<p class="flashcards-empty">No flashcards yet</p>';
    return;
  }
  
  listElement.innerHTML = flashcards.map((card, index) => `
    <div class="flashcard-list-item" onclick="window.selectFlashcard(${index})">
      <div class="flashcard-list-front">${card.front}</div>
      <button class="flashcard-delete" onclick="event.stopPropagation(); window.deleteFlashcard(${card.id})">×</button>
    </div>
  `).join('');
}

function saveFlashcards() {
  localStorage.setItem('crescentFlashcards', JSON.stringify(flashcards));
}

function loadFlashcards() {
  const saved = localStorage.getItem('crescentFlashcards');
  if (saved) {
    flashcards = JSON.parse(saved);
  }
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => notification.classList.add('show'), 10);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

window.initFlashcards = initFlashcards;
window.addFlashcard = addFlashcard;
window.deleteFlashcard = deleteFlashcard;
window.flipCard = flipCard;
window.nextCard = nextCard;
window.prevCard = prevCard;
window.selectFlashcard = (index) => {
  currentCardIndex = index;
  isFlipped = false;
  const cardElement = document.getElementById('flashcardDisplay');
  if (cardElement) cardElement.classList.remove('flipped');
  updateCardContent();
};
