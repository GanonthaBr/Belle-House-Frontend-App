/**
 * Belle House Website - Portfolio API
 * Handles all portfolio (projects & realizations) related API calls
 */

/**
 * Get all portfolio items with optional filtering
 * @param {Object} options - Query options
 * @param {string} options.category - Filter by category: 'PROJECT' or 'REALIZATION'
 * @param {boolean} options.is_featured - Filter featured items only
 * @param {string} options.city - Filter by city
 * @param {number} options.year - Filter by year
 * @param {string} options.search - Search in title, description, city, district
 * @param {string} options.ordering - Sort by: 'order', 'created_at', 'year', '-created_at'
 * @param {number} options.page - Page number (default: 1)
 * @returns {Promise<Object>} - Paginated portfolio items
 */
async function getPortfolio(options = {}) {
  const query = buildQuery({
    category: options.category,
    is_featured: options.is_featured,
    city: options.city,
    year: options.year,
    search: options.search,
    ordering: options.ordering,
    page: options.page || 1,
  });

  return apiRequest(`/portfolio/${query}`);
}

/**
 * Get single portfolio item by slug
 * @param {string} slug - Portfolio item slug
 * @returns {Promise<Object>} - Portfolio item detail with gallery and videos
 */
async function getPortfolioItem(slug) {
  if (!slug) {
    throw new ApiError('Slug is required', 400, { slug: ['This field is required.'] });
  }
  return apiRequest(`/portfolio/${slug}/`);
}

/**
 * Get featured portfolio items (realizations)
 * Cached for 30 minutes
 * @returns {Promise<Array>} - Array of featured items
 */
async function getFeaturedPortfolio() {
  return getCachedData('featured_portfolio', () => {
    return getPortfolio({
      category: 'REALIZATION',
      is_featured: true,
      ordering: '-year',
    }).then(response => getResults(response));
  }, 1800); // 30 minutes
}

/**
 * Get all projects (maquettes)
 * @param {Object} options - Query options
 * @returns {Promise<Object>} - Paginated projects
 */
async function getProjects(options = {}) {
  return getPortfolio({
    ...options,
    category: 'PROJECT',
  });
}

/**
 * Get all realizations (completed work)
 * @param {Object} options - Query options
 * @returns {Promise<Object>} - Paginated realizations
 */
async function getRealizations(options = {}) {
  return getPortfolio({
    ...options,
    category: 'REALIZATION',
  });
}

/**
 * Get portfolio items for a specific city
 * @param {string} city - City name
 * @param {number} page - Page number
 * @returns {Promise<Object>} - Paginated items for that city
 */
async function getPortfolioByCity(city, page = 1) {
  return getPortfolio({
    city,
    page,
  });
}

/**
 * Get portfolio items from a specific year
 * @param {number} year - Year
 * @param {number} page - Page number
 * @returns {Promise<Object>} - Paginated items from that year
 */
async function getPortfolioByYear(year, page = 1) {
  return getPortfolio({
    year,
    page,
  });
}

/**
 * Search portfolio items
 * @param {string} searchTerm - Search term
 * @param {number} page - Page number
 * @returns {Promise<Object>} - Paginated search results
 */
async function searchPortfolio(searchTerm, page = 1) {
  return getPortfolio({
    search: searchTerm,
    page,
  });
}

// ============ EXPORTS ============

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getPortfolio,
    getPortfolioItem,
    getFeaturedPortfolio,
    getProjects,
    getRealizations,
    getPortfolioByCity,
    getPortfolioByYear,
    searchPortfolio,
  };
}
