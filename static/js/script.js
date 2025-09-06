// static/js/search.js

class SearchComponent {
    constructor() {
        this.searchInput = document.querySelector('.search-input');
        this.searchBox = document.querySelector('.search-box');
        this.searchResults = document.getElementById('searchResults');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardShortcut();
    }

    setupEventListeners() {
        // Поиск при вводе с debounce
        this.searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
        
        // Закрытие результатов при клике вне области
        document.addEventListener('click', (e) => {
            if (!this.searchBox.contains(e.target)) {
                this.hideResults();
            }
        });

        // Навигация по результатам стрелками
        this.searchInput.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
    }

    setupKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.searchInput.focus();
                this.searchInput.select();
            }
        });
    }

    async handleSearch(e) {
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            this.hideResults();
            return;
        }

        this.showLoading();
        
        try {
            // Здесь будет запрос к вашему API
            const results = await this.fetchSearchResults(query);
            this.displayResults(results);
        } catch (error) {
            this.displayError();
        }
    }

    async fetchSearchResults(query) {
        // Заглушка - замените на реальный API call
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');
        return await response.json();
    }

    displayResults(results) {
        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="search-no-results">
                    Ничего не найдено. Попробуйте другой запрос.
                </div>
            `;
            return;
        }

        this.searchResults.innerHTML = results.map(result => `
            <div class="search-result-item" data-id="${result.id}">
                <div class="search-result-title">#${result.id} - ${result.title}</div>
                <div class="search-result-desc">${result.description || 'Нет описания'}</div>
            </div>
        `).join('');
    }

    showLoading() {
        this.searchBox.classList.add('loading');
    }

    hideLoading() {
        this.searchBox.classList.remove('loading');
    }

    hideResults() {
        this.searchResults.style.opacity = '0';
        this.searchResults.style.visibility = 'hidden';
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new SearchComponent();
});