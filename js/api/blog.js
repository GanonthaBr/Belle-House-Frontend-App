/**
 * Belle House Website - Blog API
 * Handles all blog related API calls
 */

/**
 * Get all blog posts with optional filtering
 * Only published posts are returned
 * @param {Object} options - Query options
 * @param {string} options.search - Search in title, content, excerpt
 * @param {string} options.ordering - Sort by: 'published_date', 'created_at', '-published_date', '-created_at'
 * @param {number} options.page - Page number (default: 1)
 * @returns {Promise<Object>} - Paginated blog posts
 */
async function getBlogPosts(options = {}) {
  const query = buildQuery({
    search: options.search,
    ordering: options.ordering || '-published_date',
    page: options.page || 1,
  });

  return apiRequest(`/blog/${query}`);
}

/**
 * Get single blog post by slug
 * @param {string} slug - Blog post slug
 * @returns {Promise<Object>} - Blog post detail with full HTML content
 */
async function getBlogPost(slug) {
  if (!slug) {
    throw new ApiError('Slug is required', 400, { slug: ['This field is required.'] });
  }
  return apiRequest(`/blog/${slug}/`);
}

/**
 * Search blog posts
 * @param {string} searchTerm - Search term
 * @param {number} page - Page number
 * @returns {Promise<Object>} - Paginated search results
 */
async function searchBlog(searchTerm, page = 1) {
  return getBlogPosts({
    search: searchTerm,
    page,
  });
}

/**
 * Get latest blog posts
 * @param {number} limit - Number of posts to return (default: 5)
 * @returns {Promise<Array>} - Array of latest posts
 */
async function getLatestBlogPosts(limit = 5) {
  const response = await getBlogPosts({
    ordering: '-published_date',
    page: 1,
  });

  const posts = getResults(response);
  return posts.slice(0, limit);
}

/**
 * Get blog posts for a specific month/year
 * @param {number} year - Year
 * @param {number} month - Month (1-12, optional)
 * @param {number} page - Page number
 * @returns {Promise<Object>} - Paginated posts
 */
async function getBlogPostsByDate(year, month = null, page = 1) {
  // This would require backend support for date filtering
  // For now, fetch all and filter client-side
  const allPosts = await getBlogPosts({ page });
  
  if (!month) {
    // Filter by year only
    allPosts.results = getResults(allPosts).filter(post => {
      const postYear = new Date(post.published_date).getFullYear();
      return postYear === year;
    });
  } else {
    // Filter by year and month
    allPosts.results = getResults(allPosts).filter(post => {
      const postDate = new Date(post.published_date);
      return postDate.getFullYear() === year && postDate.getMonth() + 1 === month;
    });
  }

  return allPosts;
}

/**
 * Format blog post for display
 * @param {Object} post - Blog post object
 * @returns {Object} - Formatted post
 */
function formatBlogPost(post) {
  const date = new Date(post.published_date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  
  return {
    ...post,
    formatted_date: date.toLocaleDateString('fr-FR', options),
    excerpt_truncated: post.excerpt.substring(0, 120) + '...',
  };
}

// ============ EXPORTS ============

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getBlogPosts,
    getBlogPost,
    searchBlog,
    getLatestBlogPosts,
    getBlogPostsByDate,
    formatBlogPost,
  };
}
