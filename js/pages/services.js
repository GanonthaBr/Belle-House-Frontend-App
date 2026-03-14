/**
 * Services List Page Integration Script
 * Loads and displays all services, and handles service detail view
 */

document.addEventListener('DOMContentLoaded', initServicesPage);

async function initServicesPage() {
  // Check if we're on the detail page
  const detailContainer = document.querySelector('[data-component="service-detail"]');
  if (detailContainer) {
    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get('id');
    if (serviceId) {
      await loadServiceDetail(parseInt(serviceId, 10));
    } else {
      detailContainer.innerHTML = '<div class="container">' + createErrorMessage('Aucun service sélectionné. <a href="services.html">Voir tous les services</a>') + '</div>';
    }
    return;
  }

  // Otherwise load the services list
  await loadServicesList();
}

// ============ SERVICES LOADING ============

async function loadServicesList() {
  const container = document.querySelector('[data-component="services-list"]');
  if (!container) return;
  
  try {
    container.innerHTML = createLoadingSpinner();
    const services = await getServices();
    
    if (!services || services.length === 0) {
      container.innerHTML = createEmptyState('Aucun service disponible');
      return;
    }
    
    // Display all services
    container.innerHTML = `<div class="row">${createServicesGrid(services)}</div>`;
  } catch (error) {
    console.error('Error loading services:', error);
    container.innerHTML = createErrorMessage(error.message);
  }
}

/**
 * Load and display a single service detail
 * @param {number} serviceId - Service ID
 */
async function loadServiceDetail(serviceId) {
  const container = document.querySelector('[data-component="service-detail"]');
  if (!container) return;
  
  try {
    container.innerHTML = '<div class="container">' + createLoadingSpinner() + '</div>';
    const service = await getServiceById(serviceId);

    // Update hero title
    const heroTitle = document.getElementById('service-detail-hero-title');
    if (heroTitle) heroTitle.textContent = service.title;

    // Update page title
    document.title = service.title + ' - Belle House';

    const iconHtml = service.icon
      ? `<img src="${service.icon}" alt="${service.title}" loading="lazy" decoding="async" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
         <span class="modern-service-fallback-icon" style="display:none;"><i class="fas fa-hard-hat"></i></span>`
      : `<span class="modern-service-fallback-icon"><i class="fas fa-hard-hat"></i></span>`;

    container.innerHTML = `
      <div class="container">
        <!-- Title -->
        <div class="row">
          <div class="col-12">
            <div class="service-detail-title-bar mb-45">
              <span class="service-detail-label">Service</span>
              <h2>${service.title}</h2>
              <div class="service-detail-divider"></div>
            </div>
          </div>
        </div>
        <!-- Image + Description side by side -->
        <div class="row align-items-start">
          <div class="col-lg-6 col-md-12 mb-30">
            <div class="service-detail-icon">
              ${iconHtml}
            </div>
          </div>
          <div class="col-lg-6 col-md-12 mb-30">
            <div class="service-detail-content">
              <div class="service-detail-body">
                <p>${service.short_description || ''}</p>
              </div>
              <div class="service-detail-actions">
                <a href="contact.html" class="btn w-btn">Contactez-nous <i class="ti-arrow-right"></i></a>
                <a href="services.html" class="btn2 ml-20">Tous les services</a>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-50" id="other-services-section">
          <div class="col-12">
            <div class="section-tittle mb-35">
              <h3>Autres Services</h3>
            </div>
          </div>
        </div>
      </div>
    `;

    // Load other services
    loadOtherServices(serviceId);
  } catch (error) {
    console.error('Error loading service detail:', error);
    container.innerHTML = '<div class="container">' + createErrorMessage('Service introuvable. <a href="services.html">Voir tous les services</a>') + '</div>';
  }
}

/**
 * Load other services (excluding current) as suggestions
 */
async function loadOtherServices(currentId) {
  const section = document.getElementById('other-services-section');
  if (!section) return;

  try {
    const services = await getServices();
    const others = services.filter(function(s) { return s.id !== currentId; }).slice(0, 3);
    if (others.length === 0) {
      section.style.display = 'none';
      return;
    }
    section.innerHTML = `
      <div class="col-12">
        <div class="section-tittle mb-35">
          <h3>Autres Services</h3>
        </div>
      </div>
      ${createServicesGrid(others)}
    `;
  } catch (e) {
    section.style.display = 'none';
  }
}
