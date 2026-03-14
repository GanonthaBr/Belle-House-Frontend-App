/**
 * Portfolio Detail Page Integration Script
 * Loads and displays single portfolio item with gallery and build-for-me form
 */

document.addEventListener('DOMContentLoaded', initPortfolioDetailPage);

async function initPortfolioDetailPage() {
  const slug = getQueryParameter('slug');
  
  if (!slug) {
    showError('Portfolio item not found');
    return;
  }
  
  // Load portfolio detail
  await loadPortfolioDetail(slug);
  
  // Load and setup build-for-me form
  setupBuildForMeForm();
}

// ============ PORTFOLIO DETAIL LOADING ============

async function loadPortfolioDetail(slug) {
  const container = document.querySelector('[data-component="portfolio-detail"]');
  if (!container) return;
  
  try {
    container.innerHTML = createLoadingSpinner();
    const item = await getPortfolioItem(slug);
    
    // Build detail HTML
    let html = `
      <div class="project-detail">
        <h1>${item.title}</h1>
        
        <div class="project-meta mb-4">
          <div class="row">
            <div class="col-md-4">
              <strong>Catégorie:</strong> ${item.category_display}
            </div>
            <div class="col-md-4">
              <strong>Localité:</strong> ${item.city}, ${item.country}
            </div>
            <div class="col-md-4">
              <strong>Année:</strong> ${item.year}
            </div>
          </div>
        </div>
        
        <div class="project-details mb-4">
          <div class="row">
            <div class="col-md-6">
              <p><strong>Superficie:</strong> ${item.area}</p>
              <p><strong>Quartier:</strong> ${item.district}</p>
              <p><strong>Usage:</strong> ${item.usage}</p>
            </div>
            <div class="col-md-6">
              <p><strong>Propriétaire:</strong> ${item.owner}</p>
              <p><strong>Entrepreneur:</strong> ${item.contractor}</p>
              <p><strong>Tâche:</strong> ${item.task}</p>
            </div>
          </div>
        </div>
        
        <div class="project-description mb-4">
          <h3>Description</h3>
          <p>${item.description}</p>
        </div>
    `;
    
    // Add gallery if available
    if (item.gallery_images && item.gallery_images.length > 0) {
      html += `
        <div class="project-gallery mb-4">
          <h3>Galerie Photos</h3>
          ${createImageGallery(item.gallery_images)}
        </div>
      `;
    }
    
    // Add videos if available
    if (item.videos && item.videos.length > 0) {
      html += '<div class="project-videos mb-4"><h3>Vidéos</h3>';
      html += createVideoSection(item.videos);
      html += '</div>';
    }
    
    html += '</div>';
    container.innerHTML = html;
    
    // Initialize gallery carousel after DOM insert
    if (item.gallery_images && item.gallery_images.length > 0) {
      initGalleryCarousel();
    }
    
    // Store item ID for build-for-me form
    window._portfolioItemId = item.id;
    
    // Update page title
    document.title = `${item.title} - Belle House`;
    
    // Update hero title
    var heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
      heroTitle.textContent = item.title;
    }
  } catch (error) {
    console.error('Error loading portfolio detail:', error);
    showError(error.message);
  }
}

// ============ BUILD FOR ME FORM ============

function setupBuildForMeForm() {
  const formContainer = document.querySelector('[data-component="build-for-me-form"]');
  if (!formContainer) return;
  
  // Use the shared init function
  initBuildForMeForm();
  
  // Pre-fill interested_in with portfolio item ID
  const form = document.getElementById('build-for-me-form');
  if (form && window._portfolioItemId) {
    const interestedInInput = document.createElement('input');
    interestedInInput.type = 'hidden';
    interestedInInput.name = 'interested_in';
    interestedInInput.value = window._portfolioItemId;
    form.appendChild(interestedInInput);
  }
}

// ============ UTILITIES ============

/**
 * Show error message
 * @param {string} message - Error message
 */
function showError(message) {
  const container = document.querySelector('[data-component="portfolio-detail"]');
  if (container) {
    container.innerHTML = createErrorMessage(message);
  }
}

/**
 * Get query parameter from URL
 * @param {string} param - Parameter name
 * @returns {string|null} - Parameter value or null
 */
function getQueryParameter(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
