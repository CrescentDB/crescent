export const apiConfigs = {
  wikipedia: {
    name: 'Wikipedia',
    class: 'source-wikipedia',
    search: async (query) => {
      try {
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
        );
        if (!response.ok) return [];
        
        const data = await response.json();
        return [{
          title: data.title,
          excerpt: data.extract,
          source: 'Wikipedia',
          sourceClass: 'source-wikipedia',
          url: data.content_urls?.desktop?.page,
          meta: { type: 'Article' }
        }];
      } catch (error) {
        console.error('Wikipedia API error:', error);
        return [];
      }
    }
  },
  
  openlib: {
    name: 'Open Library',
    class: 'source-openlib',
    search: async (query) => {
      try {
        const response = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`
        );
        const data = await response.json();
        
        return (data.docs || []).map(book => ({
          title: book.title,
          excerpt: `By ${book.author_name?.join(', ') || 'Unknown'} · First published ${book.first_publish_year || 'N/A'}`,
          source: 'Open Library',
          sourceClass: 'source-openlib',
          url: `https://openlibrary.org${book.key}`,
          meta: { type: 'Book' }
        }));
      } catch (error) {
        console.error('Open Library API error:', error);
        return [];
      }
    }
  },
  
  dictionary: {
    name: 'Dictionary',
    class: 'source-dictionary',
    search: async (query) => {
      try {
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(query)}`
        );
        if (!response.ok) return [];
        
        const data = await response.json();
        return data.map(entry => ({
          title: entry.word,
          excerpt: entry.meanings?.map(m => 
            `(${m.partOfSpeech}) ${m.definitions?.[0]?.definition}`
          ).join(' · ') || '',
          source: 'Dictionary',
          sourceClass: 'source-dictionary',
          url: entry.sourceUrls?.[0],
          meta: { type: 'Definition', phonetic: entry.phonetic }
        }));
      } catch (error) {
        console.error('Dictionary API error:', error);
        return [];
      }
    }
  },
  
  nasa: {
    name: 'NASA',
    class: 'source-nasa',
    search: async (query) => {
      try {
        const response = await fetch(
          `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`
        );
        if (!response.ok) return [];
        
        const data = await response.json();
        return (data.collection?.items || []).slice(0, 5).map(item => ({
          title: item.data?.[0]?.title || 'Untitled',
          excerpt: item.data?.[0]?.description?.substring(0, 200) || '',
          source: 'NASA',
          sourceClass: 'source-nasa',
          url: item.links?.[0]?.href,
          meta: { type: 'Image', date: item.data?.[0]?.date_created?.split('T')[0] }
        }));
      } catch (error) {
        console.error('NASA API error:', error);
        return [];
      }
    }
  },
  
  weather: {
    name: 'Weather',
    class: 'source-weather',
    search: async (query) => {
      try {
        const response = await fetch(
          `https://wttr.in/${encodeURIComponent(query)}?format=j1`
        );
        if (!response.ok) return [];
        
        const data = await response.json();
        const current = data.current_condition[0];
        const location = data.nearest_area[0];
        
        return [{
          title: `Weather in ${location.areaName[0].value}, ${location.country[0].value}`,
          excerpt: `${current.temp_C}°C, ${current.weatherDesc[0].value}. Feels like ${current.FeelsLikeC}°C. Humidity: ${current.humidity}%, Wind: ${current.windspeedKmph}km/h`,
          source: 'Weather',
          sourceClass: 'source-weather',
          url: `https://wttr.in/${encodeURIComponent(query)}`,
          meta: { type: 'Weather' }
        }];
      } catch (error) {
        console.error('Weather API error:', error);
        return [];
      }
    }
  },
  
  news: {
    name: 'News',
    class: 'source-news',
    search: async (query) => {
      try {
        const response = await fetch(
          `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=5`
        );
        if (!response.ok) return [];
        
        const data = await response.json();
        return data.hits.map(hit => ({
          title: hit.title,
          excerpt: hit.author ? `By ${hit.author} · ${hit.points} points · ${hit.num_comments} comments` : 'Recent news story',
          source: 'Hacker News',
          sourceClass: 'source-news',
          url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
          meta: { type: 'News' }
        }));
      } catch (error) {
        console.error('News API error:', error);
        return [];
      }
    }
  },
  
  arxiv: {
    name: 'arXiv',
    class: 'source-arxiv',
    search: async (query) => {
      try {
        const response = await fetch(
          `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=5`
        );
        if (!response.ok) return [];
        
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        const entries = xml.querySelectorAll('entry');
        
        return Array.from(entries).map(entry => ({
          title: entry.querySelector('title')?.textContent?.trim() || 'Untitled',
          excerpt: entry.querySelector('summary')?.textContent?.trim()?.substring(0, 200) || '',
          source: 'arXiv',
          sourceClass: 'source-arxiv',
          url: entry.querySelector('id')?.textContent?.trim(),
          meta: { 
            type: 'Research Paper',
            authors: entry.querySelector('author name')?.textContent?.trim()
          }
        }));
      } catch (error) {
        console.error('arXiv API error:', error);
        return [];
      }
    }
  },
  
  github: {
    name: 'GitHub',
    class: 'source-github',
    search: async (query) => {
      try {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&per_page=5`
        );
        if (!response.ok) return [];
        
        const data = await response.json();
        return data.items.map(repo => ({
          title: repo.full_name,
          excerpt: repo.description || 'No description available',
          source: 'GitHub',
          sourceClass: 'source-github',
          url: repo.html_url,
          meta: { 
            type: 'Repository',
            stars: `⭐ ${repo.stargazers_count}`,
            language: repo.language
          }
        }));
      } catch (error) {
        console.error('GitHub API error:', error);
        return [];
      }
    }
  },
  
  youtube: {
    name: 'YouTube',
    class: 'source-youtube',
    search: async (query) => {
      try {
        const response = await fetch(
          `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
        );
        const text = await response.text();
        
        const scriptMatch = text.match(/var ytInitialData = ({.+?});/);
        if (!scriptMatch) return [];
        
        const data = JSON.parse(scriptMatch[1]);
        const contents = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
        
        return contents.slice(0, 5).filter(item => item.videoRenderer).map(item => {
          const video = item.videoRenderer;
          return {
            title: video.title?.runs?.[0]?.text || 'Untitled',
            excerpt: video.descriptionSnippet?.runs?.map(r => r.text).join('') || 'No description',
            source: 'YouTube',
            sourceClass: 'source-youtube',
            url: `https://www.youtube.com/watch?v=${video.videoId}`,
            meta: { 
              type: 'Video',
              views: video.viewCountText?.simpleText
            }
          };
        });
      } catch (error) {
        console.error('YouTube API error:', error);
        return [];
      }
    }
  }
};

let selectedAPI = 'all';

export function initSearch() {
  document.querySelectorAll('.api-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.api-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedAPI = chip.dataset.api;
    });
  });

  document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });
}

export async function performSearch() {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return;

  const resultsSection = document.getElementById('resultsSection');
  const emptyState = document.getElementById('emptyState');
  const loading = document.getElementById('loading');
  const resultsGrid = document.getElementById('resultsGrid');
  const resultsCount = document.getElementById('resultsCount');

  resultsSection.style.display = 'block';
  emptyState.style.display = 'none';
  loading.classList.add('active');
  resultsGrid.innerHTML = '';

  try {
    let results = [];
    
    if (selectedAPI === 'all') {
      const promises = Object.values(apiConfigs).map(api => 
        api.search(query).catch(() => [])
      );
      const allResults = await Promise.all(promises);
      results = allResults.flat();
    } else if (apiConfigs[selectedAPI]) {
      results = await apiConfigs[selectedAPI].search(query);
    }

    loading.classList.remove('active');
    resultsCount.textContent = `${results.length} result${results.length !== 1 ? 's' : ''}`;

    if (results.length === 0) {
      resultsGrid.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
          <p>No results found. Try a different search term or source.</p>
        </div>
      `;
      return;
    }

    results.forEach((result, index) => {
      const card = document.createElement('div');
      card.className = 'result-card';
      card.style.animationDelay = `${index * 0.1}s`;
      card.innerHTML = `
        <div class="result-source">
          <span class="source-dot ${result.sourceClass}"></span>
          ${result.source}
        </div>
        <h3 class="result-title">${result.title}</h3>
        <p class="result-excerpt">${result.excerpt}</p>
        <div class="result-meta">
          <span>${result.meta?.type || 'Result'}</span>
          ${result.meta?.phonetic ? `<span>${result.meta.phonetic}</span>` : ''}
          ${result.meta?.date ? `<span>${result.meta.date}</span>` : ''}
        </div>
        <button class="bookmark-btn" onclick="event.stopPropagation(); window.addBookmark(${JSON.stringify(result).replace(/"/g, '&quot;')})">⭐</button>
      `;
      card.onclick = () => {
        if (result.url) window.open(result.url, '_blank');
      };
      resultsGrid.appendChild(card);
    });
    
    if (typeof window.addToSearchHistory === 'function') {
      window.addToSearchHistory(query, results.length);
    }

  } catch (error) {
    loading.classList.remove('active');
    resultsGrid.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
        <p>Something went wrong. Please try again.</p>
      </div>
    `;
  }
}
