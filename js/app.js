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
});

function setupEventListeners() {
  const searchBtn = document.getElementById('searchBtn');
  const spotifyToggle = document.getElementById('spotifyToggle');
  const closeSpotify = document.getElementById('closeSpotify');

  searchBtn?.addEventListener('click', performSearch);
  spotifyToggle?.addEventListener('click', toggleSpotify);
  closeSpotify?.addEventListener('click', toggleSpotify);
}

async function loadFeatures() {
  const features = [
    { path: './features/notes.js', init: 'initNotes' },
    { path: './features/history.js', init: 'initHistory' },
    { path: './features/darkmode.js', init: 'initDarkMode' },
    { path: './features/timer.js', init: 'initTimer' },
    { path: './features/bookmarks.js', init: 'initBookmarks' },
  ];

  for (const f of features) {
    try {
      const module = await import(f.path);
      module[f.init]?.();
    } catch {}
  }
}
