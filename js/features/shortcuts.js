export function initShortcuts() {
  document.addEventListener('keydown', handleShortcut);
  
  const helpBtn = document.getElementById('shortcutsHelp');
  if (helpBtn) {
    helpBtn.addEventListener('click', showShortcutsModal);
  }
}

function handleShortcut(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    return;
  }
  
  if (e.key === '/' || e.key === 's') {
    e.preventDefault();
    document.getElementById('searchInput')?.focus();
  }
  
  else if (e.key === 'Escape') {
    document.getElementById('searchInput')?.blur();
    document.activeElement?.blur();
  }
  
  else if (e.key === 'd') {
    e.preventDefault();
    if (typeof window.toggleDarkMode === 'function') {
      window.toggleDarkMode();
    }
  }
  
  else if (e.key === 'n') {
    e.preventDefault();
    document.getElementById('notesTextarea')?.focus();
  }
  
  else if (e.key === 't') {
    e.preventDefault();
    if (typeof window.startTimer === 'function') {
      window.startTimer();
    }
  }
  
  else if (e.key === 'f') {
    e.preventDefault();
    if (typeof window.flipCard === 'function') {
      window.flipCard();
    }
  }
  
  else if (e.key === 'ArrowRight' && e.ctrlKey) {
    e.preventDefault();
    if (typeof window.nextCard === 'function') {
      window.nextCard();
    }
  }
  
  else if (e.key === 'ArrowLeft' && e.ctrlKey) {
    e.preventDefault();
    if (typeof window.prevCard === 'function') {
      window.prevCard();
    }
  }
  
  else if (e.key === '?') {
    e.preventDefault();
    showShortcutsModal();
  }
}

function showShortcutsModal() {
  const existingModal = document.getElementById('shortcutsModal');
  if (existingModal) {
    existingModal.remove();
    return;
  }
  
  const modal = document.createElement('div');
  modal.id = 'shortcutsModal';
  modal.className = 'shortcuts-modal';
  modal.innerHTML = `
    <div class="shortcuts-content">
      <button class="modal-close" onclick="this.parentElement.parentElement.remove()">×</button>
      <h2>⌨️ Keyboard Shortcuts</h2>
      
      <div class="shortcuts-section">
        <h3>Search</h3>
        <div class="shortcut-item">
          <kbd>/</kbd> or <kbd>S</kbd>
          <span>Focus search</span>
        </div>
        <div class="shortcut-item">
          <kbd>Esc</kbd>
          <span>Blur/exit</span>
        </div>
      </div>
      
      <div class="shortcuts-section">
        <h3>Features</h3>
        <div class="shortcut-item">
          <kbd>D</kbd>
          <span>Toggle dark mode</span>
        </div>
        <div class="shortcut-item">
          <kbd>N</kbd>
          <span>Focus notes</span>
        </div>
        <div class="shortcut-item">
          <kbd>T</kbd>
          <span>Start/stop timer</span>
        </div>
      </div>
      
      <div class="shortcuts-section">
        <h3>Flashcards</h3>
        <div class="shortcut-item">
          <kbd>F</kbd>
          <span>Flip card</span>
        </div>
        <div class="shortcut-item">
          <kbd>Ctrl</kbd> + <kbd>→</kbd>
          <span>Next card</span>
        </div>
        <div class="shortcut-item">
          <kbd>Ctrl</kbd> + <kbd>←</kbd>
          <span>Previous card</span>
        </div>
      </div>
      
      <div class="shortcuts-section">
        <h3>Help</h3>
        <div class="shortcut-item">
          <kbd>?</kbd>
          <span>Show this help</span>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

window.initShortcuts = initShortcuts;
