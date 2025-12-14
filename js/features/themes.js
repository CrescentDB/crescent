const themes = {
  light: {
    name: 'Light',
    colors: {
      '--bg-primary': '#f7f5f2',
      '--bg-secondary': '#fffef9',
      '--bg-card': 'rgba(255, 255, 255, 0.85)',
      '--text-primary': '#2c2c2c',
      '--text-secondary': '#6b6b6b',
      '--text-muted': '#9a9a9a',
      '--accent': '#c4a87c',
      '--accent-soft': '#e8dcc8',
      '--accent-hover': '#b8996d'
    }
  },
  dark: {
    name: 'Dark',
    colors: {
      '--bg-primary': '#0f0f0f',
      '--bg-secondary': '#1a1a1a',
      '--bg-card': 'rgba(30, 30, 30, 0.92)',
      '--text-primary': '#ffffff',
      '--text-secondary': '#d4d4d4',
      '--text-muted': '#8a8a8a',
      '--accent': '#c4a87c',
      '--accent-soft': '#e8dcc8',
      '--accent-hover': '#b8996d'
    }
  },
  ocean: {
    name: 'Ocean',
    colors: {
      '--bg-primary': '#e8f4f8',
      '--bg-secondary': '#f0f8ff',
      '--bg-card': 'rgba(255, 255, 255, 0.85)',
      '--text-primary': '#1a3a52',
      '--text-secondary': '#4a7c9d',
      '--text-muted': '#7ba7c3',
      '--accent': '#4a90a4',
      '--accent-soft': '#b8d8e8',
      '--accent-hover': '#3a7a8a'
    }
  },
  forest: {
    name: 'Forest',
    colors: {
      '--bg-primary': '#e8f5e9',
      '--bg-secondary': '#f1f8f4',
      '--bg-card': 'rgba(255, 255, 255, 0.85)',
      '--text-primary': '#1b5e20',
      '--text-secondary': '#4caf50',
      '--text-muted': '#81c784',
      '--accent': '#66bb6a',
      '--accent-soft': '#c8e6c9',
      '--accent-hover': '#4caf50'
    }
  },
  sunset: {
    name: 'Sunset',
    colors: {
      '--bg-primary': '#fff3e0',
      '--bg-secondary': '#fff8f0',
      '--bg-card': 'rgba(255, 255, 255, 0.85)',
      '--text-primary': '#4a2c2a',
      '--text-secondary': '#8d6e63',
      '--text-muted': '#a1887f',
      '--accent': '#ff6f00',
      '--accent-soft': '#ffe0b2',
      '--accent-hover': '#e65100'
    }
  },
  midnight: {
    name: 'Midnight',
    colors: {
      '--bg-primary': '#0d1117',
      '--bg-secondary': '#161b22',
      '--bg-card': 'rgba(22, 27, 34, 0.92)',
      '--text-primary': '#c9d1d9',
      '--text-secondary': '#8b949e',
      '--text-muted': '#6e7681',
      '--accent': '#58a6ff',
      '--accent-soft': '#1f6feb',
      '--accent-hover': '#388bfd'
    }
  }
};

let currentTheme = 'light';

export function initThemes() {
  loadTheme();
  createThemeSelector();
}

function loadTheme() {
  const saved = localStorage.getItem('crescentTheme');
  if (saved && themes[saved]) {
    applyTheme(saved);
  }
}

function applyTheme(themeName) {
  if (!themes[themeName]) return;
  
  currentTheme = themeName;
  const theme = themes[themeName];
  
  Object.entries(theme.colors).forEach(([property, value]) => {
    document.documentElement.style.setProperty(property, value);
  });
  
  document.body.classList.toggle('dark-mode', themeName === 'dark' || themeName === 'midnight');
  
  localStorage.setItem('crescentTheme', themeName);
  
  updateThemeSelector();
}

function createThemeSelector() {
  const container = document.getElementById('themeSelector');
  if (!container) return;
  
  container.innerHTML = Object.entries(themes).map(([key, theme]) => `
    <button 
      class="theme-option ${key === currentTheme ? 'active' : ''}" 
      data-theme="${key}"
      onclick="window.selectTheme('${key}')"
    >
      <div class="theme-preview" style="background: ${theme.colors['--bg-primary']}; border-color: ${theme.colors['--accent']}">
        <div class="theme-accent" style="background: ${theme.colors['--accent']}"></div>
      </div>
      <span>${theme.name}</span>
    </button>
  `).join('');
}

function updateThemeSelector() {
  document.querySelectorAll('.theme-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === currentTheme);
  });
}

window.initThemes = initThemes;
window.selectTheme = applyTheme;
