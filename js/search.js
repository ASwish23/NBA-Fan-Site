// Universal Search System - Works across all pages
class UniversalSearch {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        if (!this.searchInput) return;

        this.searchResults = document.createElement('div');
        this.searchResults.className = 'search-results';
        this.debounceTimeout = null;

        // Database of players
        this.players = [
            { name: 'LeBron James', team: 'Los Angeles Lakers', url: 'players/lebron.html', keywords: ['lebron', 'james', 'lakers', 'la'] },
            { name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', url: 'players/giannis.html', keywords: ['giannis', 'antetokounmpo', 'greek', 'freak', 'bucks', 'milwaukee'] },
            { name: 'Stephen Curry', team: 'Golden State Warriors', url: 'players/curry.html', keywords: ['stephen', 'curry', 'steph', 'warriors', 'golden', 'state'] }
        ];

        // Database of teams with their URLs
        this.teams = [
            // Eastern Conference
            { name: 'Boston Celtics', conference: 'Est', url: 'echipe.html#eastern', keywords: ['boston', 'celtics'] },
            { name: 'Milwaukee Bucks', conference: 'Est', url: 'echipe.html#eastern', keywords: ['milwaukee', 'bucks'] },
            { name: 'Philadelphia 76ers', conference: 'Est', url: 'echipe.html#eastern', keywords: ['philadelphia', '76ers', 'sixers', 'philly'] },
            { name: 'Cleveland Cavaliers', conference: 'Est', url: 'echipe.html#eastern', keywords: ['cleveland', 'cavaliers', 'cavs'] },
            { name: 'New York Knicks', conference: 'Est', url: 'echipe.html#eastern', keywords: ['new', 'york', 'knicks', 'ny'] },
            { name: 'Miami Heat', conference: 'Est', url: 'echipe.html#eastern', keywords: ['miami', 'heat'] },
            { name: 'Brooklyn Nets', conference: 'Est', url: 'echipe.html#eastern', keywords: ['brooklyn', 'nets'] },
            { name: 'Atlanta Hawks', conference: 'Est', url: 'echipe.html#eastern', keywords: ['atlanta', 'hawks'] },
            { name: 'Toronto Raptors', conference: 'Est', url: 'echipe.html#eastern', keywords: ['toronto', 'raptors'] },
            { name: 'Chicago Bulls', conference: 'Est', url: 'echipe.html#eastern', keywords: ['chicago', 'bulls'] },
            { name: 'Indiana Pacers', conference: 'Est', url: 'echipe.html#eastern', keywords: ['indiana', 'pacers'] },
            { name: 'Orlando Magic', conference: 'Est', url: 'echipe.html#eastern', keywords: ['orlando', 'magic'] },
            { name: 'Charlotte Hornets', conference: 'Est', url: 'echipe.html#eastern', keywords: ['charlotte', 'hornets'] },
            { name: 'Washington Wizards', conference: 'Est', url: 'echipe.html#eastern', keywords: ['washington', 'wizards'] },
            { name: 'Detroit Pistons', conference: 'Est', url: 'echipe.html#eastern', keywords: ['detroit', 'pistons'] },
            // Western Conference
            { name: 'Denver Nuggets', conference: 'Vest', url: 'echipe.html#western', keywords: ['denver', 'nuggets'] },
            { name: 'Memphis Grizzlies', conference: 'Vest', url: 'echipe.html#western', keywords: ['memphis', 'grizzlies'] },
            { name: 'Sacramento Kings', conference: 'Vest', url: 'echipe.html#western', keywords: ['sacramento', 'kings'] },
            { name: 'Phoenix Suns', conference: 'Vest', url: 'echipe.html#western', keywords: ['phoenix', 'suns'] },
            { name: 'Los Angeles Clippers', conference: 'Vest', url: 'echipe.html#western', keywords: ['los', 'angeles', 'clippers', 'la', 'lac'] },
            { name: 'Golden State Warriors', conference: 'Vest', url: 'echipe.html#western', keywords: ['golden', 'state', 'warriors', 'gsw'] },
            { name: 'Los Angeles Lakers', conference: 'Vest', url: 'echipe.html#western', keywords: ['los', 'angeles', 'lakers', 'la', 'lal'] },
            { name: 'Minnesota Timberwolves', conference: 'Vest', url: 'echipe.html#western', keywords: ['minnesota', 'timberwolves', 'wolves'] },
            { name: 'New Orleans Pelicans', conference: 'Vest', url: 'echipe.html#western', keywords: ['new', 'orleans', 'pelicans'] },
            { name: 'Oklahoma City Thunder', conference: 'Vest', url: 'echipe.html#western', keywords: ['oklahoma', 'city', 'thunder', 'okc'] },
            { name: 'Portland Trail Blazers', conference: 'Vest', url: 'echipe.html#western', keywords: ['portland', 'trail', 'blazers'] },
            { name: 'Utah Jazz', conference: 'Vest', url: 'echipe.html#western', keywords: ['utah', 'jazz'] },
            { name: 'Dallas Mavericks', conference: 'Vest', url: 'echipe.html#western', keywords: ['dallas', 'mavericks', 'mavs'] },
            { name: 'Houston Rockets', conference: 'Vest', url: 'echipe.html#western', keywords: ['houston', 'rockets'] },
            { name: 'San Antonio Spurs', conference: 'Vest', url: 'echipe.html#western', keywords: ['san', 'antonio', 'spurs'] }
        ];

        // Pages database
        this.pages = [
            { name: 'Acasă', url: 'index.html', keywords: ['acasa', 'home', 'principal'] },
            { name: 'Echipe', url: 'echipe.html', keywords: ['echipe', 'teams', 'clasament', 'standings'] },
            { name: 'Jucători', url: 'jucatori.html', keywords: ['jucatori', 'players'] },
            { name: 'Istorie', url: 'istorie.html', keywords: ['istorie', 'history'] },
            { name: 'Contact', url: 'contact.html', keywords: ['contact'] }
        ];

        this.init();
    }

    init() {
        // Insert search results container
        this.searchInput.parentNode.appendChild(this.searchResults);

        // Add event listeners
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value.trim().length >= 1) {
                this.showResults();
            }
        });

        // Close results when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.searchInput.parentNode.contains(e.target)) {
                this.hideResults();
            }
        });

        // Handle result clicks
        this.searchResults.addEventListener('click', (e) => {
            const resultItem = e.target.closest('.search-result');
            if (resultItem && resultItem.dataset.url) {
                this.navigateToResult(resultItem.dataset.url);
            }
        });
    }

    handleSearch(e) {
        clearTimeout(this.debounceTimeout);

        this.debounceTimeout = setTimeout(() => {
            const query = e.target.value.toLowerCase().trim();

            if (query.length < 1) {
                this.hideResults();
                return;
            }

            const results = this.searchAll(query);
            this.displayResults(results, query);
        }, 200);
    }

    searchAll(query) {
        const results = [];
        const queryLower = query.toLowerCase();

        // Search players
        this.players.forEach(player => {
            const score = this.calculateScore(queryLower, player.name, player.keywords);
            if (score > 0) {
                results.push({
                    type: 'player',
                    name: player.name,
                    subtitle: player.team,
                    url: player.url,
                    score: score,
                    icon: '👤'
                });
            }
        });

        // Search teams
        this.teams.forEach(team => {
            const score = this.calculateScore(queryLower, team.name, team.keywords);
            if (score > 0) {
                results.push({
                    type: 'team',
                    name: team.name,
                    subtitle: `Conferința ${team.conference}`,
                    url: team.url,
                    score: score,
                    icon: '🏀'
                });
            }
        });

        // Search pages
        this.pages.forEach(page => {
            const score = this.calculateScore(queryLower, page.name, page.keywords);
            if (score > 0) {
                results.push({
                    type: 'page',
                    name: page.name,
                    subtitle: 'Pagină',
                    url: page.url,
                    score: score,
                    icon: '📄'
                });
            }
        });

        // Sort by relevance
        return results.sort((a, b) => b.score - a.score).slice(0, 8);
    }

    calculateScore(query, name, keywords) {
        let score = 0;
        const nameLower = name.toLowerCase();
        const queryWords = query.split(/\s+/);

        // Exact match
        if (nameLower === query) {
            score += 100;
        }

        // Starts with query
        if (nameLower.startsWith(query)) {
            score += 50;
        }

        // Contains query
        if (nameLower.includes(query)) {
            score += 25;
        }

        // Check each query word
        queryWords.forEach(word => {
            if (word.length < 2) return;

            // Name contains word
            if (nameLower.includes(word)) {
                score += 10;
            }

            // Keywords match
            keywords.forEach(keyword => {
                if (keyword.includes(word) || word.includes(keyword)) {
                    score += 5;
                }
            });
        });

        return score;
    }

    displayResults(results, query) {
        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="no-results">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔍</div>
                    <div>Nu s-au găsit rezultate pentru "${this.escapeHtml(query)}"</div>
                </div>
            `;
        } else {
            const groupedResults = this.groupResults(results);
            this.searchResults.innerHTML = Object.keys(groupedResults)
                .map(type => {
                    const items = groupedResults[type];
                    const typeLabel = type === 'player' ? 'Jucători' : type === 'team' ? 'Echipe' : 'Pagini';
                    
                    return `
                        <div class="result-group">
                            <div class="result-group-title">${typeLabel}</div>
                            ${items.map(result => `
                                <div class="search-result" data-url="${result.url}" data-type="${result.type}">
                                    <div class="result-icon">${result.icon}</div>
                                    <div class="result-content">
                                        <div class="result-title">${this.highlightText(result.name, query)}</div>
                                        <div class="result-subtitle">${result.subtitle}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `;
                }).join('');
        }

        this.showResults();
    }

    groupResults(results) {
        const grouped = {};
        results.forEach(result => {
            if (!grouped[result.type]) {
                grouped[result.type] = [];
            }
            grouped[result.type].push(result);
        });
        return grouped;
    }

    highlightText(text, query) {
        const escaped = this.escapeHtml(text);
        const queryWords = query.split(/\s+/).filter(w => w.length > 1);
        
        let highlighted = escaped;
        queryWords.forEach(word => {
            const regex = new RegExp(`(${this.escapeRegex(word)})`, 'gi');
            highlighted = highlighted.replace(regex, '<mark>$1</mark>');
        });
        
        return highlighted;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    navigateToResult(url) {
        // Get current path to determine if we need ../ prefix
        const currentPath = window.location.pathname;
        const isInSubfolder = currentPath.includes('/players/');
        
        // Adjust URL if we're in a subfolder
        const finalUrl = isInSubfolder && !url.startsWith('../') && !url.startsWith('players/') 
            ? '../' + url 
            : url;
            
        window.location.href = finalUrl;
    }

    showResults() {
        this.searchResults.style.display = 'block';
    }

    hideResults() {
        this.searchResults.style.display = 'none';
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UniversalSearch();
});