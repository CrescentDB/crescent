let isFocusMode = false;

export function initFocusMode() {
  const toggleBtn = document.getElementById('focusModeToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleFocusMode);
  }
}

export function toggleFocusMode() {
  isFocusMode = !isFocusMode;
  document.body.classList.toggle('focus-mode', isFocusMode);
  
  const toggleBtn = document.getElementById('focusModeToggle');
  if (toggleBtn) {
    toggleBtn.textContent = isFocusMode ? '👁️' : '🎯';
    toggleBtn.title = isFocusMode ? 'Exit Focus Mode' : 'Enter Focus Mode';
  }
  
  if (isFocusMode) {
    document.getElementById('searchInput')?.focus();
  }
}

window.initFocusMode = initFocusMode;
window.toggleFocusMode = toggleFocusMode;
