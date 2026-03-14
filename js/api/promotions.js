/**
 * Belle House Website - Promotions API
 * Handles promotional banners and offers
 */

/**
 * Get all promotional banners
 * Cached for 30 minutes
 * @returns {Promise<Array>} - Array of promotion banners
 */
async function getPromotions() {
  return getCachedData('promotions', async () => {
    const response = await apiRequest('/app/promotions/');
    // Handle paginated response - extract results array
    if (Array.isArray(response)) {
      return response;
    }
    return response.results || [];
  }, 1800); // 30 minutes
}

/**
 * Get promotion by ID
 * @param {number} id - Promotion ID
 * @returns {Promise<Object>} - Promotion details
 */
async function getPromotionById(id) {
  if (!id) {
    throw new ApiError('Promotion ID is required', 400, { id: ['This field is required.'] });
  }

  const promotions = await getPromotions();
  const promotion = promotions.find(p => p.id === parseInt(id));

  if (!promotion) {
    throw new ApiError('Promotion not found', 404, { detail: 'Promotion does not exist.' });
  }

  return promotion;
}

/**
 * Get promotions with linked content loaded
 * @returns {Promise<Array>} - Promotions with full portfolio/link data
 */
async function getPromotionsWithContent() {
  const promotions = await getPromotions();

  return Promise.all(promotions.map(async (promo) => {
    const enhanced = { ...promo };

    // Load linked portfolio item if available
    if (promo.linked_portfolio_slug) {
      try {
        enhanced.linked_portfolio_data = await getPortfolioItem(promo.linked_portfolio_slug);
      } catch (error) {
        // If portfolio item not found, just keep the slug
        enhanced.linked_portfolio_data = null;
      }
    }

    return enhanced;
  }));
}

/**
 * Get promotion URL (either portfolio link or external link)
 * @param {Object} promotion - Promotion object
 * @returns {string} - URL to navigate to
 */
function getPromotionUrl(promotion) {
  if (promotion.external_link && promotion.external_link.trim() !== '') {
    return promotion.external_link;
  }

  if (promotion.linked_portfolio_slug) {
    // Assuming this would be handled by client-side routing
    return `/project_details.html?slug=${encodeURIComponent(promotion.linked_portfolio_slug)}`;
  }

  return '#';
}

/**
 * Get promotion link target
 * Determines if link should open in new tab or same window
 * @param {Object} promotion - Promotion object
 * @returns {string} - '_blank' or '_self'
 */
function getPromotionLinkTarget(promotion) {
  // External links open in new tab
  if (promotion.external_link && promotion.external_link.trim() !== '') {
    return '_blank';
  }
  return '_self';
}

/**
 * Format promotion for display
 * @param {Object} promotion - Promotion object
 * @returns {Object} - Formatted promotion
 */
function formatPromotion(promotion) {
  return {
    ...promotion,
    url: getPromotionUrl(promotion),
    target: getPromotionLinkTarget(promotion),
    is_external: promotion.external_link && promotion.external_link.trim() !== '',
    is_internal: promotion.linked_portfolio_slug !== null && promotion.linked_portfolio_slug !== undefined,
  };
}

/**
 * Check if promotion is clickable (has a link)
 * @param {Object} promotion - Promotion object
 * @returns {boolean}
 */
function isClickable(promotion) {
  return (promotion.external_link && promotion.external_link.trim() !== '') ||
         (promotion.linked_portfolio_slug && promotion.linked_portfolio_slug !== '');
}

// ============ EXPORTS ============

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getPromotions,
    getPromotionById,
    getPromotionsWithContent,
    getPromotionUrl,
    getPromotionLinkTarget,
    formatPromotion,
    isClickable,
  };
}
