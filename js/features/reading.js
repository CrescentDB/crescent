export function initReadingList() {
  loadReadingList();
  updateReadingListDisplay();
}

export function addToReadingList(result) {
  const readingList = getReadingList();
  
  const item = {
    id: Date.now(),
    title: result.title,
    excerpt: result.excerpt,
    source: result.source,
    sourceClass: result.sourceClass,
    url: result.url,
    addedAt: new Date().toISOString(),
    read: false
  };
  
  readingList.unshift(item);
  
  if (readingList.length > 100) {
    readingList.pop();
  }
  
  localStorage.setItem('crescentReadingList', JSON.stringify(readingList));
  updateReadingListDisplay();
  showNotification('Added to reading list!');
}

export function markAsRead(id) {
  const readingList = getReadingList();
  const item = readingList.find(i => i.id === id);
  if (item) {
    item.read = !item.read;
    localStorage.setItem('crescentReadingList', JSON.stringify(readingList));
    updateReadingListDisplay();
  }
}

export function removeFromReadingList(id) {
  const readingList = getReadingList();
  const filtered = readingList.filter(i => i.id !== id);
  localStorage.setItem('crescentReadingList', JSON.stringify(filtered));
  updateReadingListDisplay();
}

export function clearReadingList() {
  if (confirm('Clear all items from reading list?')) {
    localStorage.removeItem('crescentReadingList');
    updateReadingListDisplay();
  }
}

function getReadingList() {
  const saved = localStorage.getItem('crescentReadingList');
  return saved ? JSON.parse(saved) : [];
}

function loadReadingList() {
  getReadingList();
}

function updateReadingListDisplay() {
  const listElement = document.getElementById('readingListItems');
  if (!listElement) return;
  
  const readingList = getReadingList();
  
  if (readingList.length === 0) {
    listElement.innerHTML = '<p class="reading-empty">No items in reading list</p>';
    return;
  }
  
  listElement.innerHTML = readingList.map(item => `
    <div class="reading-item ${item.read ? 'read' : ''}">
      <div class="reading-content" onclick="window.open('${item.url}', '_blank')">
        <div class="reading-source">
          <span class="source-dot ${item.sourceClass}"></span>
          ${item.source}
        </div>
        <div class="reading-title">${item.title}</div>
        <div class="reading-excerpt">${item.excerpt.substring(0, 100)}...</div>
      </div>
      <div class="reading-actions">
        <button onclick="event.stopPropagation(); window.markAsRead(${item.id})" title="${item.read ? 'Mark as unread' : 'Mark as read'}">
          ${item.read ? '✓' : '○'}
        </button>
        <button onclick="event.stopPropagation(); window.removeFromReadingList(${item.id})" title="Remove">×</button>
      </div>
    </div>
  `).join('');
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

window.initReadingList = initReadingList;
window.addToReadingList = addToReadingList;
window.markAsRead = markAsRead;
window.removeFromReadingList = removeFromReadingList;
window.clearReadingList = clearReadingList;
