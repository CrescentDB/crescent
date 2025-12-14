let currentSession = null;
let sessionInterval = null;

export function initAnalytics() {
  loadAnalytics();
  updateAnalyticsDashboard();
  
  const startBtn = document.getElementById('startSession');
  const stopBtn = document.getElementById('stopSession');
  
  if (startBtn) startBtn.addEventListener('click', startSession);
  if (stopBtn) stopBtn.addEventListener('click', stopSession);
}

export function startSession() {
  if (currentSession) return;
  
  currentSession = {
    start: Date.now(),
    searches: 0,
    sources: {}
  };
  
  sessionInterval = setInterval(updateSessionDisplay, 1000);
  
  document.getElementById('startSession')?.classList.add('hidden');
  document.getElementById('stopSession')?.classList.remove('hidden');
  
  updateSessionDisplay();
}

export function stopSession() {
  if (!currentSession) return;
  
  currentSession.end = Date.now();
  currentSession.duration = currentSession.end - currentSession.start;
  
  saveSession(currentSession);
  
  clearInterval(sessionInterval);
  currentSession = null;
  
  document.getElementById('startSession')?.classList.remove('hidden');
  document.getElementById('stopSession')?.classList.add('hidden');
  
  updateAnalyticsDashboard();
  updateSessionDisplay();
}

export function trackSearch(source) {
  if (!currentSession) return;
  
  currentSession.searches++;
  currentSession.sources[source] = (currentSession.sources[source] || 0) + 1;
  
  updateSessionDisplay();
}

function updateSessionDisplay() {
  const display = document.getElementById('sessionTime');
  if (!display) return;
  
  if (!currentSession) {
    display.textContent = '00:00:00';
    return;
  }
  
  const elapsed = Date.now() - currentSession.start;
  const hours = Math.floor(elapsed / 3600000);
  const minutes = Math.floor((elapsed % 3600000) / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  
  display.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function saveSession(session) {
  const analytics = getAnalytics();
  analytics.sessions.push(session);
  analytics.totalTime += session.duration;
  analytics.totalSearches += session.searches;
  
  Object.entries(session.sources).forEach(([source, count]) => {
    analytics.sourceUsage[source] = (analytics.sourceUsage[source] || 0) + count;
  });
  
  localStorage.setItem('crescentAnalytics', JSON.stringify(analytics));
}

function loadAnalytics() {
  const saved = localStorage.getItem('crescentAnalytics');
  if (!saved) {
    const initial = {
      sessions: [],
      totalTime: 0,
      totalSearches: 0,
      sourceUsage: {},
      created: Date.now()
    };
    localStorage.setItem('crescentAnalytics', JSON.stringify(initial));
  }
}

function getAnalytics() {
  const saved = localStorage.getItem('crescentAnalytics');
  return saved ? JSON.parse(saved) : {
    sessions: [],
    totalTime: 0,
    totalSearches: 0,
    sourceUsage: {},
    created: Date.now()
  };
}

function updateAnalyticsDashboard() {
  const analytics = getAnalytics();
  
  const totalTimeEl = document.getElementById('totalStudyTime');
  const totalSearchesEl = document.getElementById('totalSearches');
  const avgSessionEl = document.getElementById('avgSession');
  const streakEl = document.getElementById('studyStreak');
  
  if (totalTimeEl) {
    const hours = Math.floor(analytics.totalTime / 3600000);
    const minutes = Math.floor((analytics.totalTime % 3600000) / 60000);
    totalTimeEl.textContent = `${hours}h ${minutes}m`;
  }
  
  if (totalSearchesEl) {
    totalSearchesEl.textContent = analytics.totalSearches;
  }
  
  if (avgSessionEl && analytics.sessions.length > 0) {
    const avg = analytics.totalTime / analytics.sessions.length;
    const minutes = Math.floor(avg / 60000);
    avgSessionEl.textContent = `${minutes}m`;
  } else if (avgSessionEl) {
    avgSessionEl.textContent = '0m';
  }
  
  if (streakEl) {
    streakEl.textContent = calculateStreak(analytics);
  }
  
  updateSourceChart(analytics);
}

function calculateStreak(analytics) {
  if (analytics.sessions.length === 0) return 0;
  
  const today = new Date().setHours(0, 0, 0, 0);
  const oneDayMs = 86400000;
  
  let streak = 0;
  let checkDate = today;
  
  for (let i = analytics.sessions.length - 1; i >= 0; i--) {
    const sessionDate = new Date(analytics.sessions[i].start).setHours(0, 0, 0, 0);
    
    if (sessionDate === checkDate) {
      if (checkDate === today || streak > 0) {
        streak = Math.max(streak, 1);
      }
    } else if (sessionDate === checkDate - oneDayMs) {
      streak++;
      checkDate -= oneDayMs;
    } else if (sessionDate < checkDate - oneDayMs) {
      break;
    }
  }
  
  return streak;
}

function updateSourceChart(analytics) {
  const chartEl = document.getElementById('sourceChart');
  if (!chartEl) return;
  
  const sources = Object.entries(analytics.sourceUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  if (sources.length === 0) {
    chartEl.innerHTML = '<p class="chart-empty">No data yet</p>';
    return;
  }
  
  const max = sources[0][1];
  
  chartEl.innerHTML = sources.map(([source, count]) => {
    const percentage = (count / max) * 100;
    return `
      <div class="chart-bar">
        <div class="chart-label">${source}</div>
        <div class="chart-bar-container">
          <div class="chart-bar-fill" style="width: ${percentage}%"></div>
        </div>
        <div class="chart-value">${count}</div>
      </div>
    `;
  }).join('');
}

export function exportAnalytics() {
  const analytics = getAnalytics();
  const blob = new Blob([JSON.stringify(analytics, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `crescent-analytics-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function resetAnalytics() {
  if (!confirm('Reset all analytics data? This cannot be undone.')) return;
  
  localStorage.removeItem('crescentAnalytics');
  loadAnalytics();
  updateAnalyticsDashboard();
}

window.initAnalytics = initAnalytics;
window.startSession = startSession;
window.stopSession = stopSession;
window.trackSearch = trackSearch;
window.exportAnalytics = exportAnalytics;
window.resetAnalytics = resetAnalytics;
