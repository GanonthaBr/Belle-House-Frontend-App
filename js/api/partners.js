/**
 * Belle House Website - Partners API
 * Handles all partners related API calls
 */

/**
 * Get all partners
 * Only active partners are returned, pre-sorted by order
 * Cached for 1 hour
 * @returns {Promise<Array>} - Array of all active partners
 */
async function getPartners() {
  return getCachedData('partners', async () => {
    const response = await apiRequest('/partners/');
    // Handle paginated response - extract results array
    if (Array.isArray(response)) {
      return response;
    }
    return response.results || [];
  }, 3600); // 1 hour
}

/**
 * Get partner by ID
 * @param {number} id - Partner ID
 * @returns {Promise<Object>} - Partner details
 */
async function getPartnerById(id) {
  if (!id) {
    throw new ApiError('Partner ID is required', 400, { id: ['This field is required.'] });
  }

  const partners = await getPartners();
  const partner = partners.find(p => p.id === parseInt(id));

  if (!partner) {
    throw new ApiError('Partner not found', 404, { detail: 'Partner does not exist.' });
  }

  return partner;
}

/**
 * Search partners by name
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} - Matching partners
 */
async function searchPartners(searchTerm) {
  const partners = await getPartners();
  const term = searchTerm.toLowerCase();

  return partners.filter(partner =>
    partner.name.toLowerCase().includes(term)
  );
}

/**
 * Get partners with valid websites only
 * @returns {Promise<Array>} - Partners that have a website
 */
async function getPartnersWithWebsite() {
  const partners = await getPartners();
  return partners.filter(p => p.website && p.website.trim() !== '');
}

/**
 * Format partner for display
 * @param {Object} partner - Partner object
 * @returns {Object} - Formatted partner
 */
function formatPartner(partner) {
  return {
    ...partner,
    has_website: partner.website && partner.website.trim() !== '',
    website_domain: extractDomain(partner.website),
  };
}

/**
 * Extract domain from URL
 * @param {string} url - Partner website URL
 * @returns {string} - Domain name or empty string
 */
function extractDomain(url) {
  if (!url) return '';
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch (e) {
    return '';
  }
}

// ============ EXPORTS ============

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getPartners,
    getPartnerById,
    searchPartners,
    getPartnersWithWebsite,
    formatPartner,
    extractDomain,
  };
}
