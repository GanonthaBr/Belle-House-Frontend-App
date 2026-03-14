/**
 * Blog Detail Page Integration Script
 * Loads and displays single blog post with full HTML content
 */

document.addEventListener('DOMContentLoaded', initBlogDetailPage);

async function initBlogDetailPage() {
  const slug = getQueryParameter('slug');
  
  if (!slug) {
    showBlogError('Article not found');
    return;
  }
  
  // Load blog post
  await loadBlogDetail(slug);
  
  // Load related posts in sidebar
  loadRelatedPosts(slug);
}

// ============ BLOG DETAIL LOADING ============

async function loadBlogDetail(slug) {
  const container = document.querySelector('[data-component="blog-detail"]');
  if (!container) return;
  
  try {
    container.innerHTML = createLoadingSpinner();
    const post = await getBlogPost(slug);
    
    // Format date
    const publishedDate = new Date(post.published_date);
    const dateStr = publishedDate.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Build detail HTML
    let html = `
      <article class="blog-detail">
        <div class="blog-detail-header mb-4">
          <h1>${post.title}</h1>
          <div class="blog-meta">
            <span class="publish-date">
              <i class="fas fa-calendar"></i> ${dateStr}
            </span>
          </div>
        </div>
        
        <div class="blog-detail-thumbnail mb-4">
          <img src="${post.thumbnail}" alt="${post.title}" class="img-fluid" loading="lazy">
        </div>
        
        <div class="blog-detail-content">
          ${post.content}
        </div>
      </article>
    `;
    
    container.innerHTML = html;
    
    // Update page title and meta
    document.title = `${post.title} - Belle House Blog`;
    
    // Sanitize HTML content if needed (optional, depends on security requirements)
    sanitizeBlogContent();
  } catch (error) {
    console.error('Error loading blog detail:', error);
    showBlogError(error.message);
  }
}

/**
 * Sanitize blog content HTML
 * This adds target="_blank" to external links for security
 */
function sanitizeBlogContent() {
  const content = document.querySelector('.blog-detail-content');
  if (!content) return;
  
  // Add target="_blank" to external links
  content.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('/') && !href.startsWith('#')) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
  
  // Make images responsive
  content.querySelectorAll('img').forEach(img => {
    img.classList.add('img-fluid');
    img.setAttribute('loading', 'lazy');
  });
}

/**
 * Load related blog posts
 * @param {string} currentSlug - Current post slug to exclude
 * @param {number} limit - Number of related posts
 */
async function loadRelatedPosts(currentSlug, limit = 3) {
  const container = document.querySelector('[data-component="related-posts"]');
  if (!container) return;
  
  try {
    container.innerHTML = createLoadingSpinner();
    const allPosts = await getBlogPosts({ page: 1 });
    
    // Filter out current post
    let posts = (allPosts.results || []).filter(p => p.slug !== currentSlug);
    
    // Get random sample
    posts = posts.sort(() => 0.5 - Math.random()).slice(0, limit);
    
    if (!posts || posts.length === 0) {
      container.innerHTML = '';
      return;
    }
    
    container.innerHTML = posts.map(function(post) {
      var date = new Date(post.published_date);
      var dateStr = date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
      var url = 'blog_details.html?slug=' + encodeURIComponent(post.slug);
      var thumb = post.thumbnail || 'img/gallery/default-blog.jpg';
      return '<div class="sidebar-post-item">' +
        '<a href="' + url + '" class="sidebar-post-link">' +
          '<img src="' + thumb + '" alt="' + post.title + '" class="sidebar-post-thumb">' +
          '<div class="sidebar-post-info">' +
            '<h4>' + post.title + '</h4>' +
            '<span>' + dateStr + '</span>' +
          '</div>' +
        '</a>' +
      '</div>';
    }).join('');
  } catch (error) {
    console.error('Error loading related posts:', error);
    // Don't show error for related posts
  }
}

// ============ UTILITIES ============

/**
 * Get query parameter from URL
 * @param {string} param - Parameter name
 * @returns {string|null}
 */
function getQueryParameter(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Show error message
 * @param {string} message
 */
function showBlogError(message) {
  const container = document.querySelector('[data-component="blog-detail"]');
  if (container) {
    container.innerHTML = createErrorMessage(message);
  }
}
