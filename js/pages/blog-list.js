/**
 * Blog List Page Integration Script
 * Loads and displays blog posts with pagination and search
 */

let blogCurrentPage = 1;
let blogSearchTerm = '';

document.addEventListener('DOMContentLoaded', initBlogPage);

async function initBlogPage() {
  // Load blog posts
  await loadBlogList();
  
  // Load sidebar latest posts
  loadLatestBlogSidebar();
  
  // Setup search
  setupBlogSearch();
}

// ============ BLOG LOADING ============

async function loadBlogList(page = 1, searchTerm = '') {
  const container = document.querySelector('[data-component="blog-list"]');
  if (!container) return;
  
  try {
    container.innerHTML = createLoadingSpinner();
    blogCurrentPage = page;
    blogSearchTerm = searchTerm;
    
    const options = {
      page: page,
      search: searchTerm || undefined,
      ordering: '-published_date',
    };
    
    const response = await getBlogPosts(options);
    
    if (!response.results || response.results.length === 0) {
      container.innerHTML = createEmptyState(searchTerm ? `Aucun article ne correspond à "${searchTerm}"` : 'Aucun article disponible');
      return;
    }
    
    // Create grid
    let html = `<div class="row">${createBlogGrid(response.results)}</div>`;
    
    // Add pagination
    const pageCount = Math.ceil(response.count / 20);
    if (pageCount > 1) {
      html += `<div class="row mt-4"><div class="col-12">${createPagination(blogCurrentPage, pageCount, 'handleBlogPageChange')}</div></div>`;
    }
    
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading blog posts:', error);
    container.innerHTML = createErrorMessage(error.message);
  }
}

// ============ BLOG SEARCH ============

function setupBlogSearch() {
  const searchInput = document.getElementById('blog-search');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const term = e.target.value;
        loadBlogList(1, term);
      }, 300); // Debounce search
    });
  }
}

/**
 * Handle blog page change
 * @param {number} page - Page number
 */
function handleBlogPageChange(page) {
  loadBlogList(page, blogSearchTerm);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Load latest blog posts for sidebar
 * @param {number} limit - Number of posts
 */
async function loadLatestBlogSidebar(limit = 5) {
  const container = document.querySelector('[data-component="latest-blog-sidebar"]');
  if (!container) return;
  
  try {
    container.innerHTML = createLoadingSpinner();
    const posts = await getLatestBlogPosts(limit);
    
    if (!posts || posts.length === 0) {
      container.innerHTML = createEmptyState('Aucun article récent');
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
    console.error('Error loading sidebar posts:', error);
    container.innerHTML = createErrorMessage(error.message);
  }
}
