let timerInterval = null;
let timeLeft = 25 * 60;
let isRunning = false;

export function initTimer() {
  updateTimerDisplay();
  
  const startBtn = document.getElementById('startTimer');
  const stopBtn = document.getElementById('stopTimer');
  const resetBtn = document.getElementById('resetTimer');
  
  if (startBtn) {
    startBtn.addEventListener('click', startTimer);
  }
  
  if (stopBtn) {
    stopBtn.addEventListener('click', stopTimer);
  }
  
  if (resetBtn) {
    resetBtn.addEventListener('click', resetTimer);
  }
}

export function startTimer() {
  if (isRunning) return;
  
  isRunning = true;
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    
    if (timeLeft === 0) {
      stopTimer();
      playTimerSound();
      showNotification('Time for a break! 🎉');
      timeLeft = 5 * 60;
      updateTimerDisplay();
    }
  }, 1000);
  
  updateTimerButtons();
}

export function stopTimer() {
  isRunning = false;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  updateTimerButtons();
}

export function resetTimer() {
  stopTimer();
  timeLeft = 25 * 60;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const display = document.getElementById('timerDisplay');
  if (!display) return;
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateTimerButtons() {
  const startBtn = document.getElementById('startTimer');
  const stopBtn = document.getElementById('stopTimer');
  
  if (startBtn) {
    startBtn.disabled = isRunning;
    startBtn.style.opacity = isRunning ? '0.5' : '1';
  }
  
  if (stopBtn) {
    stopBtn.disabled = !isRunning;
    stopBtn.style.opacity = !isRunning ? '0.5' : '1';
  }
}

function playTimerSound() {
  const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIF2m98OScTgwOUKfj8LZjHAU5k9nzyn0vBSF0yPLaizsKElyx6OyrWBUIQ5vd8sFuJAUuhM/z2Ik3CRdqvfDjnE0MElCn4+y/aB0GNpPZ88p9LwUgdMny2Ys7ChJcsevsq1gVCEGZ2/G/biQFL4TP89mJNwgZa77w45xNDBJQqOPtv2gdBTaU2vPKfC8FIHbJ8diLOwkSW7Tr7KpYFghDmdvyv24jBS+Dz/PZiTYIGWu/8eSbTgwST6jk7cBoHAU2lNrzynwvBSB2yfPZizsKElux6+urWBQJQpjb8b9uIwUug9Dz2Yk2CBlrv/HkmkoME0+o4+y/aBwFNpTa88p8LgUfdsnx2Io6CRFbsOvqq1cUCEGY2/G+bSIFL4PR89iHNgcZarztopxODRNPp+PsvmYcBTaU2fPKfS4FH3fK8diKOggRWq/s66pYFAk/l9nyv24jBS+E0fPYhzUHGGm+8d+aTQ0UT6fj7L5mHAU2lNn0yXwuBR95yfHYizoJEVqv7OuqWRUJP5fZ8r5tIwYug9DzWYk2Bxdpv/HfmE8MFE+o4+y+ZhwFN5Ta88l8LgQefcny2Yo6CRFar+ztqldUCT+X2fK+biMFLoPQ81mJNgcZab/x4ZhODBRPpuPsvmYcBjGU2vLJfC4EH37K8NiJOwkRWrDr7KpYFQlBmNrxv24jBS6E0PPYiTUHGWu+8eCZTgwTT6jj7b5mHAYxldrzyHwuAx98yvDYijsJEFux6+yrWBUJQJfZ8b9uIwUugM/z2Ik1Bxlqv/HhmU4MFE+o4+y+ZhwGMZTa88h9LwQffsrw2Io7ChFaset9Z2YnDw==');
  audio.play().catch(() => {});
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

window.initTimer = initTimer;
window.startTimer = startTimer;
window.stopTimer = stopTimer;
window.resetTimer = resetTimer;
