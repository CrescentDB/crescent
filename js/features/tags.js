export function initTags() {
  loadTags();
}

export function addTagToBookmark(bookmarkId, tag) {
  const tags = getTags();
  if (!tags.bookmarks[bookmarkId]) {
    tags.bookmarks[bookmarkId] = [];
  }
  if (!tags.bookmarks[bookmarkId].includes(tag)) {
    tags.bookmarks[bookmarkId].push(tag);
    saveTags(tags);
  }
}

export function addTagToNote(noteId, tag) {
  const tags = getTags();
  if (!tags.notes[noteId]) {
    tags.notes[noteId] = [];
  }
  if (!tags.notes[noteId].includes(tag)) {
    tags.notes[noteId].push(tag);
    saveTags(tags);
  }
}

export function removeTag(itemType, itemId, tag) {
  const tags = getTags();
  if (tags[itemType][itemId]) {
    tags[itemType][itemId] = tags[itemType][itemId].filter(t => t !== tag);
    saveTags(tags);
  }
}

export function getItemsByTag(tag) {
  const tags = getTags();
  const items = { bookmarks: [], notes: [] };
  
  Object.entries(tags.bookmarks).forEach(([id, itemTags]) => {
    if (itemTags.includes(tag)) {
      items.bookmarks.push(id);
    }
  });
  
  Object.entries(tags.notes).forEach(([id, itemTags]) => {
    if (itemTags.includes(tag)) {
      items.notes.push(id);
    }
  });
  
  return items;
}

export function getAllTags() {
  const tags = getTags();
  const allTags = new Set();
  
  Object.values(tags.bookmarks).forEach(itemTags => {
    itemTags.forEach(tag => allTags.add(tag));
  });
  
  Object.values(tags.notes).forEach(itemTags => {
    itemTags.forEach(tag => allTags.add(tag));
  });
  
  return Array.from(allTags).sort();
}

function getTags() {
  const saved = localStorage.getItem('crescentTags');
  return saved ? JSON.parse(saved) : { bookmarks: {}, notes: {} };
}

function saveTags(tags) {
  localStorage.setItem('crescentTags', JSON.stringify(tags));
}

function loadTags() {
  getTags();
}

window.initTags = initTags;
window.addTagToBookmark = addTagToBookmark;
window.addTagToNote = addTagToNote;
window.removeTag = removeTag;
window.getAllTags = getAllTags;
