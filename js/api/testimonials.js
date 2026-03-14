/**
 * Belle House Website - Testimonials API
 * Handles all testimonials (client reviews) related API calls
 */

/**
 * Get all testimonials
 * Only active testimonials are returned
 * @param {Object} options - Query options
 * @param {boolean} options.is_featured - Filter featured testimonials only
 * @returns {Promise<Array>} - Array of testimonials
 */
async function getTestimonials(options = {}) {
  const query = buildQuery({
    is_featured: options.is_featured,
  });

  const response = await apiRequest(`/testimonials/${query}`);
  // Handle paginated response - extract results array
  if (Array.isArray(response)) {
    return response;
  }
  return response.results || [];
}

/**
 * Get featured testimonials only
 * Cached for 1 hour
 * @param {number} limit - Number of featured testimonials to return
 * @returns {Promise<Array>} - Array of featured testimonials
 */
async function getFeaturedTestimonials(limit = null) {
  return getCachedData('featured_testimonials', () => {
    return getTestimonials({ is_featured: true });
  }, 3600).then(testimonials => {
    return limit ? testimonials.slice(0, limit) : testimonials;
  });
}

/**
 * Get testimonial by ID
 * @param {number} id - Testimonial ID
 * @returns {Promise<Object>} - Testimonial object
 */
async function getTestimonialById(id) {
  if (!id) {
    throw new ApiError('Testimonial ID is required', 400, { id: ['This field is required.'] });
  }

  const testimonials = await getTestimonials();
  const testimonial = testimonials.find(t => t.id === parseInt(id));

  if (!testimonial) {
    throw new ApiError('Testimonial not found', 404, { detail: 'Testimonial does not exist.' });
  }

  return testimonial;
}

/**
 * Get testimonials with average rating
 * @returns {Promise<Object>} - Testimonials and stats
 */
async function getTestimonialsWithStats() {
  const testimonials = await getTestimonials();

  const totalRating = testimonials.reduce((sum, t) => sum + (t.rating || 0), 0);
  const averageRating = testimonials.length > 0 ? (totalRating / testimonials.length).toFixed(1) : 0;

  return {
    testimonials,
    stats: {
      total: testimonials.length,
      average_rating: parseFloat(averageRating),
      breakdown: {
        five_star: testimonials.filter(t => t.rating === 5).length,
        four_star: testimonials.filter(t => t.rating === 4).length,
        three_star: testimonials.filter(t => t.rating === 3).length,
        two_star: testimonials.filter(t => t.rating === 2).length,
        one_star: testimonials.filter(t => t.rating === 1).length,
      },
    },
  };
}

/**
 * Format testimonial for display
 * @param {Object} testimonial - Testimonial object
 * @returns {Object} - Formatted testimonial
 */
function formatTestimonial(testimonial) {
  return {
    ...testimonial,
    rating_stars: '★'.repeat(testimonial.rating || 0) + '☆'.repeat(5 - (testimonial.rating || 0)),
    has_photo: testimonial.photo !== null && testimonial.photo !== undefined && testimonial.photo !== '',
  };
}

// ============ EXPORTS ============

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getTestimonials,
    getFeaturedTestimonials,
    getTestimonialById,
    getTestimonialsWithStats,
    formatTestimonial,
  };
}
