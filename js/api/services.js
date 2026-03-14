/**
 * Belle House Website - Services API
 * Handles all services related API calls
 */

/**
 * Get all services
 * Only active services are returned, pre-sorted by order
 * Cached for 1 hour
 * @returns {Promise<Array>} - Array of all active services
 */
async function getServices() {
  return getCachedData('services', async () => {
    const response = await apiRequest('/services/');
    // Handle paginated response - extract results array
    if (Array.isArray(response)) {
      return response;
    }
    return response.results || [];
  }, 3600); // 1 hour
}

/**
 * Get single service by ID
 * @param {number} id - Service ID
 * @returns {Promise<Object>} - Service details
 */
async function getServiceById(id) {
  if (!id) {
    throw new ApiError('Service ID is required', 400, { id: ['This field is required.'] });
  }
  
  const services = await getServices();
  const service = services.find(s => s.id === parseInt(id));
  
  if (!service) {
    throw new ApiError('Service not found', 404, { detail: 'Service does not exist.' });
  }
  
  return service;
}

/**
 * Search services by title
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} - Matching services
 */
async function searchServices(searchTerm) {
  const services = await getServices();
  const term = searchTerm.toLowerCase();
  
  return services.filter(service =>
    service.title.toLowerCase().includes(term) ||
    service.short_description.toLowerCase().includes(term)
  );
}

// ============ EXPORTS ============

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getServices,
    getServiceById,
    searchServices,
  };
}
