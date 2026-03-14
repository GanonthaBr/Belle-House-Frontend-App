/**
 * Portfolio List Page Integration Script
 * Loads and displays portfolio with filtering and pagination
 */

let currentPage = 1;
let currentFilters = {};

document.addEventListener('DOMContentLoaded', initPortfolioPage);

async function initPortfolioPage() {
  // Load portfolio
  await loadPortfolioList();
  
  // Setup filter listeners
  setupFilters();
}

// ============ PORTFOLIO LOADING ============

async function loadPortfolioList(page = 1) {
  const container = document.querySelector('[data-component="portfolio-list"]');
  if (!container) return;
  
  try {
    container.innerHTML = createLoadingSpinner();
    currentPage = page;
    
    // Build filter options
    const options = {
      page: page,
      category: currentFilters.category,
      is_featured: currentFilters.is_featured,
      city: currentFilters.city,
      year: currentFilters.year,
      search: currentFilters.search,
      ordering: currentFilters.ordering || '-year',
    };
    
    const response = await getPortfolio(options);
    
    if (!response.results || response.results.length === 0) {
      container.innerHTML = createEmptyState('Aucun projet ne correspond à vos critères');
      return;
    }
    
    // Create grid
    let html = `<div class="row">${createPortfolioGrid(response.results)}</div>`;
    
    // Add pagination if needed
    const pageCount = Math.ceil(response.count / 20);
    if (pageCount > 1) {
      html += `<div class="row mt-4"><div class="col-12">${createPagination(currentPage, pageCount, 'loadPortfolioList')}</div></div>`;
    }
    
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading portfolio:', error);
    container.innerHTML = createErrorMessage(error.message);
  }
}

// ============ FILTERING ============

function setupFilters() {
  // Category tab buttons
  const categoryTabs = document.querySelectorAll('.portfolio-filter-btn[data-category]');
  if (categoryTabs.length > 0) {
    categoryTabs.forEach(function(btn) {
      btn.addEventListener('click', function() {
        categoryTabs.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        currentFilters.category = this.dataset.category || null;
        loadPortfolioList(1);
      });
    });
  }

  // Category select filter (fallback)
  const categoryFilter = document.getElementById('filter-category');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', (e) => {
      currentFilters.category = e.target.value || null;
      loadPortfolioList(1);
    });
  }
  
  // Featured filter
  const featuredFilter = document.getElementById('filter-featured');
  if (featuredFilter) {
    featuredFilter.addEventListener('change', (e) => {
      currentFilters.is_featured = e.target.value ? (e.target.value === 'true') : null;
      loadPortfolioList(1);
    });
  }
  
  // City filter
  const cityFilter = document.getElementById('filter-city');
  if (cityFilter) {
    cityFilter.addEventListener('change', (e) => {
      currentFilters.city = e.target.value || null;
      loadPortfolioList(1);
    });
  }
  
  // Year filter
  const yearFilter = document.getElementById('filter-year');
  if (yearFilter) {
    yearFilter.addEventListener('change', (e) => {
      currentFilters.year = e.target.value ? parseInt(e.target.value) : null;
      loadPortfolioList(1);
    });
  }
  
  // Ordering filter
  const orderingFilter = document.getElementById('filter-ordering');
  if (orderingFilter) {
    orderingFilter.addEventListener('change', (e) => {
      currentFilters.ordering = e.target.value || '-year';
      loadPortfolioList(1);
    });
  }
  
  // Search
  const searchInput = document.getElementById('filter-search');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentFilters.search = e.target.value || null;
        loadPortfolioList(1);
      }, 300); // Debounce search
    });
  }
}

// ============ QUICK FILTERS ============

/**
 * Quick filter by category
 * @param {string} category - 'PROJECT' or 'REALIZATION'
 */
function filterByCategory(category) {
  currentFilters = { category };
  loadPortfolioList(1);
}

/**
 * Quick filter to show only featured
 */
function filterByFeatured() {
  currentFilters.is_featured = true;
  loadPortfolioList(1);
}

/**
 * Quick filter by year
 * @param {number} year
 */
function filterByYear(year) {
  currentFilters = { year };
  loadPortfolioList(1);
}

/**
 * Clear all filters
 */
function clearFilters() {
  currentFilters = {};
  // Reset all filter inputs
  document.querySelectorAll('[data-filter]').forEach(el => {
    if (el.tagName === 'SELECT' || el.tagName === 'INPUT') {
      el.value = '';
    }
  });
  loadPortfolioList(1);
}
