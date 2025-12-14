export function initNotes() {
  const notesPanel = document.getElementById('notesPanel');
  if (!notesPanel) return;
  
  loadNotes();
  
  const saveBtn = document.getElementById('saveNotesBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveNotes);
  }
  
  const textarea = document.getElementById('notesTextarea');
  if (textarea) {
    textarea.addEventListener('input', () => {
      localStorage.setItem('crescentNotes', textarea.value);
    });
  }
}

export function saveNotes() {
  const textarea = document.getElementById('notesTextarea');
  if (!textarea) return;
  
  localStorage.setItem('crescentNotes', textarea.value);
  showNotification('Notes saved!');
}

export function loadNotes() {
  const textarea = document.getElementById('notesTextarea');
  if (!textarea) return;
  
  const saved = localStorage.getItem('crescentNotes');
  if (saved) {
    textarea.value = saved;
  }
}

export function clearNotes() {
  const textarea = document.getElementById('notesTextarea');
  if (!textarea) return;
  
  if (confirm('Clear all notes?')) {
    textarea.value = '';
    localStorage.removeItem('crescentNotes');
    showNotification('Notes cleared');
  }
}

export function exportNotes() {
  const textarea = document.getElementById('notesTextarea');
  if (!textarea || !textarea.value.trim()) {
    alert('No notes to export');
    return;
  }
  
  const notes = textarea.value;
  const blob = new Blob([notes], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `crescent-notes-${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  
  showNotification('Notes exported!');
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
  }, 2000);
}

window.loadNotes = loadNotes;
window.saveNotes = saveNotes;
window.clearNotes = clearNotes;
window.exportNotes = exportNotes;
