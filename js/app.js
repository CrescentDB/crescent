import { initSearch, performSearch } from './search.js';
import { updateClock, toggleSpotify, fadeInPage } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('🌙 Crescent initialized');
  
  updateClock();
  setInterval(updateClock, 1000);
  
  initSearch();
  
  setupEventListeners();
  
  fadeInPage();
  
  loadFeatures();
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed:', err));
  }
});

function setupEventListeners() {
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
  }
  
  const spotifyToggle = document.getElementById('spotifyToggle');
  const closeSpotify = document.getElementById('closeSpotify');
  
  if (spotifyToggle) {
    spotifyToggle.addEventListener('click', toggleSpotify);
  }
  
  if (closeSpotify) {
    closeSpotify.addEventListener('click', toggleSpotify);
  }
  
  const themesToggle = document.getElementById('themesToggle');
  if (themesToggle) {
    themesToggle.addEventListener('click', () => {
      document.getElementById('themesPanel')?.classList.toggle('open');
    });
  }
}

async function loadFeatures() {
  try {
    const { initNotes } = await import('./features/notes.js');
    initNotes();
  } catch (e) {}
  
  try {
    const { initHistory } = await import('./features/history.js');
    initHistory();
  } catch (e) {}
  
  try {
    const { initDarkMode } = await import('./features/darkmode.js');
    initDarkMode();
  } catch (e) {}
  
  try {
    const { initTimer } = await import('./features/timer.js');
    initTimer();
  } catch (e) {}
  
  try {
    const { initBookmarks } = await import('./features/bookmarks.js');
    initBookmarks();
  } catch (e) {}
  
  try {
    const { initMath } = await import('./features/math.js');
    initMath();
  } catch (e) {}
  
  try {
    const { initFlashcards } = await import('./features/flashcards.js');
    initFlashcards();
  } catch (e) {}
  
  try {
    const { initShortcuts } = await import('./features/shortcuts.js');
    initShortcuts();
  } catch (e) {}
  
  try {
    const { initFocusMode } = await import('./features/focus.js');
    initFocusMode();
  } catch (e) {}
  
  try {
    const { initAnalytics } = await import('./features/analytics.js');
    initAnalytics();
  } catch (e) {}
  
  try {
    const { initThemes } = await import('./features/themes.js');
    initThemes();
  } catch (e) {}
  
  try {
    const { initTags } = await import('./features/tags.js');
    initTags();
  } catch (e) {}
  
  try {
    const { initReadingList } = await import('./features/reading.js');
    initReadingList();
  } catch (e) {}
}
