/**
 * About Page Integration Script
 * Loads featured portfolio and testimonials for about page
 */

document.addEventListener('DOMContentLoaded', initAboutPage);

async function initAboutPage() {
  // Load featured portfolio
  loadAboutFeaturedPortfolio();
  
  // Load testimonials
  loadAboutTestimonials();
}

// ============ FEATURED PORTFOLIO ============

async function loadAboutFeaturedPortfolio() {
  const container = document.querySelector('[data-component="about-portfolio"]');
  if (!container) return;
  
  try {
    container.innerHTML = createLoadingSpinner();
    const portfolio = await getFeaturedPortfolio();
    
    if (!portfolio || portfolio.length === 0) {
      container.innerHTML = createEmptyState('Aucun projet en vedette');
      return;
    }
    
    // Display first 3 items
    const items = portfolio.slice(0, 3);
    container.innerHTML = `<div class="row">${createPortfolioGrid(items)}</div>`;
  } catch (error) {
    console.error('Error loading featured portfolio:', error);
    container.innerHTML = createErrorMessage(error.message);
  }
}

// ============ TESTIMONIALS ============

async function loadAboutTestimonials() {
  const container = document.querySelector('[data-component="about-testimonials"]');
  if (!container) return;
  
  try {
    container.innerHTML = createLoadingSpinner();
    const testimonials = await getFeaturedTestimonials();
    
    if (!testimonials || testimonials.length === 0) {
      container.innerHTML = createEmptyState('Aucun témoignage disponible');
      return;
    }
    
    container.innerHTML = createTestimonialCarousel(testimonials);
  } catch (error) {
    console.error('Error loading testimonials:', error);
    container.innerHTML = createErrorMessage(error.message);
  }
}
