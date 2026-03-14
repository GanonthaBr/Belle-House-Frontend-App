/**
 * Homepage Integration Script
 * Loads portfolio, services, testimonials, partners, and promotions
 */

// Initialize homepage data loading
document.addEventListener('DOMContentLoaded', initHomepage);

async function initHomepage() {
  // Load featured portfolio
  loadFeaturedPortfolio();
  
  // Load services
  loadServices();
  
  // Load testimonials
  loadTestimonials();
  
  // Load blog posts
  loadHomepageBlog();
  
  // Load partners
  loadPartners();
  
  // Load promotions
  loadPromotions();

  // Load homepage contact form
  loadHomepageContactForm();
}

// ============ FEATURED PORTFOLIO ============

async function loadFeaturedPortfolio() {
  const container = document.querySelector('[data-component="featured-portfolio"]');
  if (!container) return;
  
  try {
    container.innerHTML = createLoadingSpinner();
    const portfolio = await getFeaturedPortfolio();
    
    if (!portfolio || portfolio.length === 0) {
      container.innerHTML = createEmptyState('Aucun projet en vedette');
      return;
    }
    
    // Display first 4 items
    const items = portfolio.slice(0, 4);
    container.innerHTML = `<div class="row">${createPortfolioGrid(items)}</div>`;
  } catch (error) {
    console.error('Error loading featured portfolio:', error);
    container.innerHTML = createErrorMessage(error.message);
  }
}

// ============ SERVICES ============

async function loadServices() {
  const container = document.querySelector('[data-component="services"]');
  if (!container) return;

  try {
    // Show loading state inside the container while preserving the section wrapper
    const innerHtml = `
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-xl-7 col-lg-8">
            <div class="section-tittle text-center mb-60">
              <span class="element" style="color:#FF3514;">Nos Services</span>
              <h2 style="color:#fff;">Ce que nous faisons de mieux</h2>
            </div>
          </div>
        </div>
        <div class="row" id="services-grid">
          ${createLoadingSpinner()}
        </div>
        <div class="text-center mt-40">
          <a href="services.html" class="btn hero-btn" style="border-color:#FF3514;color:#fff;">Voir tous les services</a>
        </div>
      </div>
    `;
    container.innerHTML = innerHtml;

    const grid = document.getElementById('services-grid');
    const services = await getServices();

    if (!services || services.length === 0) {
      grid.innerHTML = createEmptyState('Aucun service disponible');
      return;
    }

    const items = services.slice(0, 6);
    grid.innerHTML = createServicesGrid(items);
  } catch (error) {
    console.error('Error loading services:', error);
    const grid = document.getElementById('services-grid');
    if (grid) grid.innerHTML = createErrorMessage(error.message);
  }
}

// ============ TESTIMONIALS ============

async function loadTestimonials() {
  const container = document.querySelector('[data-component="testimonials"]');
  if (!container) return;
  
  try {
    container.innerHTML = `<div class="col-12">${createLoadingSpinner()}</div>`;
    const testimonials = await getFeaturedTestimonials();
    
    if (!testimonials || testimonials.length === 0) {
      container.innerHTML = `<div class="col-12">${createTestimonialEmptyState()}</div>`;
      return;
    }
    
    // Display up to 3 testimonial cards
    const items = testimonials.slice(0, 3);
    container.innerHTML = items.map(function(t) {
      return `<div class="col-lg-4 col-md-6 mb-30">${createTestimonialCard(t)}</div>`;
    }).join('');
  } catch (error) {
    console.error('Error loading testimonials:', error);
    container.innerHTML = `<div class="col-12">${createErrorMessage(error.message)}</div>`;
  }
}

// ============ HOMEPAGE BLOG ============

async function loadHomepageBlog() {
  const container = document.querySelector('[data-component="homepage-blog"]');
  if (!container) return;
  
  try {
    container.innerHTML = `<div class="col-12">${createLoadingSpinner()}</div>`;
    const posts = await getLatestBlogPosts(3);
    
    if (!posts || posts.length === 0) {
      container.innerHTML = `<div class="col-12">${createEmptyState('Aucun article disponible')}</div>`;
      return;
    }
    
    container.innerHTML = createBlogGrid(posts);
  } catch (error) {
    console.error('Error loading blog posts:', error);
    container.innerHTML = `<div class="col-12">${createErrorMessage(error.message)}</div>`;
  }
}

// ============ PARTNERS ============

async function loadPartners() {
  const container = document.querySelector('[data-component="partners"]');
  if (!container) return;
  
  try {
    container.innerHTML = `<div class="col-12">${createLoadingSpinner()}</div>`;
    const partners = await getPartners();
    
    if (!partners || partners.length === 0) {
      container.innerHTML = `<div class="col-12">${createEmptyState('Aucun partenaire')}</div>`;
      return;
    }
    
    container.innerHTML = partners.map(function(p) {
      return '<div class="col-lg-2 col-md-3 col-sm-4 col-6 mb-30">' + createPartnerLogo(p) + '</div>';
    }).join('');
  } catch (error) {
    console.error('Error loading partners:', error);
    container.innerHTML = `<div class="col-12">${createErrorMessage(error.message)}</div>`;
  }
}

// ============ PROMOTIONS ============

async function loadPromotions() {
  const container = document.querySelector('[data-component="promotions"]');
  if (!container) return;
  
  try {
    container.innerHTML = createLoadingSpinner();
    const promotions = await getPromotions();
    
    if (!promotions || promotions.length === 0) {
      return; // Don't show error for promotions
    }
    
    // Display promotional banners
    const banners = promotions.slice(0, 3);
    let html = '<div class="row">';
    
    for (const promo of banners) {
      const url = getPromotionUrl(promo);
      const target = getPromotionLinkTarget(promo);
      
      html += `
        <div class="col-md-6 col-lg-4 mb-3">
          <a href="${url}" ${target === '_blank' ? 'target="_blank"' : ''} class="promotion-link">
            <img src="${promo.banner_image}" alt="${promo.title}" class="img-fluid rounded">
          </a>
        </div>
      `;
    }
    
    html += '</div>';
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading promotions:', error);
    // Don't show error for optional promotions
  }
}

// ============ HOMEPAGE CONTACT FORM ============

function loadHomepageContactForm() {
  const container = document.querySelector('[data-component="homepage-contact"]');
  if (!container) return;

  // Keep existing title, append the form
  const titleHtml = container.querySelector('.section-tittle') 
    ? container.querySelector('.section-tittle').outerHTML 
    : '<div class="section-tittle section-tittle2 mb-30"><h2>Laissez votre message</h2></div>';

  container.innerHTML = titleHtml + createContactForm();

  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', handleHomepageContactSubmit);
  }
}

async function handleHomepageContactSubmit(e) {
  e.preventDefault();
  var form = e.target;
  var messageDiv = form.querySelector('#form-message');
  var submitBtn = form.querySelector('button[type="submit"]');

  try {
    submitBtn.disabled = true;
    var originalText = submitBtn.textContent;
    submitBtn.textContent = 'Envoi en cours...';
    if (messageDiv) messageDiv.innerHTML = '';

    var formData = new FormData(form);
    var data = {};
    formData.forEach(function(value, key) { data[key] = value; });

    if (!data.name || !data.email || !data.subject || !data.message) {
      throw new Error('Veuillez remplir tous les champs obligatoires');
    }

    var response = await submitContact(data);

    if (messageDiv) {
      messageDiv.innerHTML = '<div class="alert alert-success"><strong>Succès!</strong> ' + response.message + '</div>';
    }
    form.reset();
  } catch (error) {
    console.error('Error submitting contact form:', error);
    if (messageDiv) {
      messageDiv.innerHTML = '<div class="alert alert-danger">' + error.message + '</div>';
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}
