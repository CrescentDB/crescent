export function initBookmarks() {
  loadBookmarks();
}

export function addBookmark(result) {
  const bookmarks = getBookmarks();
  
  const bookmark = {
    id: Date.now(),
    title: result.title,
    excerpt: result.excerpt,
    source: result.source,
    sourceClass: result.sourceClass,
    url: result.url,
    timestamp: new Date().toISOString()
  };
  
  bookmarks.unshift(bookmark);
  
  if (bookmarks.length > 50) {
    bookmarks.pop();
  }
  
  localStorage.setItem('crescentBookmarks', JSON.stringify(bookmarks));
  updateBookmarksDisplay();
  showNotification('Bookmarked!');
}

export function removeBookmark(id) {
  const bookmarks = getBookmarks();
  const filtered = bookmarks.filter(b => b.id !== id);
  localStorage.setItem('crescentBookmarks', JSON.stringify(filtered));
  updateBookmarksDisplay();
}

export function clearBookmarks() {
  if (confirm('Clear all bookmarks?')) {
    localStorage.removeItem('crescentBookmarks');
    updateBookmarksDisplay();
  }
}

export function loadBookmarks() {
  updateBookmarksDisplay();
}

function getBookmarks() {
  const saved = localStorage.getItem('crescentBookmarks');
  return saved ? JSON.parse(saved) : [];
}

function updateBookmarksDisplay() {
  const bookmarksList = document.getElementById('bookmarksList');
  if (!bookmarksList) return;
  
  const bookmarks = getBookmarks();
  
  if (bookmarks.length === 0) {
    bookmarksList.innerHTML = '<p class="bookmarks-empty">No bookmarks yet</p>';
    return;
  }
  
  bookmarksList.innerHTML = bookmarks.map(bookmark => `
    <div class="bookmark-item">
      <div class="bookmark-content" onclick="window.open('${bookmark.url}', '_blank')">
        <div class="bookmark-source">
          <span class="source-dot ${bookmark.sourceClass}"></span>
          ${bookmark.source}
        </div>
        <div class="bookmark-title">${bookmark.title}</div>
        <div class="bookmark-excerpt">${bookmark.excerpt.substring(0, 100)}...</div>
      </div>
      <button class="bookmark-remove" onclick="window.removeBookmark(${bookmark.id})">×</button>
    </div>
  `).join('');
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

window.loadBookmarks = loadBookmarks;
window.addBookmark = addBookmark;
window.removeBookmark = removeBookmark;
window.clearBookmarks = clearBookmarks;
