/**
 * Belle House Website - API Client
 * Main API communication module with error handling and utilities
 */

// ============ API CONFIGURATION ============

const API_CONFIG = {
  BASE_URL: 'https://api2.bellehouseniger.com/api',
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// ============ ERROR HANDLING ============

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Parse error response from API
 * @param {Response} response - Fetch response object
 * @returns {Promise<ApiError>}
 */
async function parseError(response) {
  let data = {};
  try {
    data = await response.json();
  } catch (e) {
    // If response is not JSON, just use status text
    data = { detail: response.statusText };
  }

  let message = data.detail || data.message || response.statusText;

  // Handle field-specific errors
  if (typeof data === 'object' && !data.detail && !data.message) {
    const errors = Object.entries(data)
      .map(([field, errors]) => {
        const fieldName = field.replace(/_/g, ' ');
        const errorMsg = Array.isArray(errors) ? errors[0] : errors;
        return `${fieldName}: ${errorMsg}`;
      })
      .join('; ');
    if (errors) message = errors;
  }

  return new ApiError(message, response.status, data);
}

// ============ MAIN API REQUEST FUNCTION ============

/**
 * Main API request function with error handling and timeout
 * @param {string} endpoint - API endpoint (e.g., '/portfolio/')
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - Parsed JSON response
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    method: 'GET',
    headers: { ...API_CONFIG.HEADERS },
    ...options,
  };

  // Build headers
  if (typeof defaultOptions.headers !== 'object') {
    defaultOptions.headers = { ...API_CONFIG.HEADERS };
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw await parseError(response);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408, { detail: 'Request took too long' });
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      error.message || 'Network error',
      0,
      { detail: error.message }
    );
  }
}

// ============ UTILITY FUNCTIONS ============

/**
 * Build query string from parameters
 * @param {Object} params - Query parameters
 * @returns {string} - Query string or empty string
 */
function buildQuery(params) {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }

  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      query.set(key, value);
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Retry logic for failed requests
 * @param {Function} fn - Function to retry
 * @param {number} retries - Number of retries
 * @param {number} delay - Delay between retries in ms
 * @returns {Promise}
 */
async function retryRequest(fn, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0 || error.status === 401 || error.status === 403) {
      throw error;
    }

    await new Promise(resolve => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1, delay * 2);
  }
}

/**
 * Cache responses to reduce API calls
 * @param {string} key - Cache key
 * @param {Function} fn - Function that fetches data
 * @param {number} ttl - Time to live in seconds (default: 5 minutes)
 * @returns {Promise}
 */
const CACHE_VERSION = 'v2'; // Increment to invalidate old cache
async function getCachedData(key, fn, ttl = 300) {
  const cacheKey = `cache_${CACHE_VERSION}_${key}`;
  const cache = sessionStorage.getItem(cacheKey);
  const timestamp = sessionStorage.getItem(`${cacheKey}_time`);

  if (cache && timestamp) {
    const age = (Date.now() - parseInt(timestamp)) / 1000;
    if (age < ttl) {
      return JSON.parse(cache);
    }
  }

  const data = await fn();
  sessionStorage.setItem(cacheKey, JSON.stringify(data));
  sessionStorage.setItem(`${cacheKey}_time`, Date.now().toString());

  return data;
}

/**
 * Clear cache for specific key or all cache
 * @param {string} key - Cache key (optional)
 */
function clearCache(key) {
  if (key) {
    sessionStorage.removeItem(`cache_${key}`);
    sessionStorage.removeItem(`cache_${key}_time`);
  } else {
    Object.keys(sessionStorage).forEach(k => {
      if (k.startsWith('cache_')) {
        sessionStorage.removeItem(k);
      }
    });
  }
}

// ============ API RESPONSE UTILITIES ============

/**
 * Extract results from paginated response
 * @param {Object} response - API response with pagination
 * @returns {Array} - Array of items
 */
function getResults(response) {
  if (Array.isArray(response)) {
    return response;
  }
  return response.results || [];
}

/**
 * Check if response has more pages
 * @param {Object} response - Paginated API response
 * @returns {boolean}
 */
function hasNextPage(response) {
  return response.next !== null && response.next !== undefined;
}

/**
 * Get page number from next/previous URLs
 * @param {string} url - Next or previous URL
 * @returns {number|null}
 */
function getPageNumber(url) {
  if (!url) return null;
  const match = url.match(/[?&]page=(\d+)/);
  return match ? parseInt(match[1]) : null;
}

// ============ EXPORTS ============

// For use with es6 modules if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    apiRequest,
    ApiError,
    buildQuery,
    retryRequest,
    getCachedData,
    clearCache,
    getResults,
    hasNextPage,
    getPageNumber,
    API_CONFIG,
  };
}
