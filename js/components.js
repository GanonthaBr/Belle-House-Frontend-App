/**
 * Belle House Website - UI Components
 * Reusable rendering components for displaying API data
 */

// ============ LOADING & ERROR STATES ============

/**
 * Create loading spinner HTML
 * @returns {string} - HTML for loading spinner
 */
function createLoadingSpinner() {
  return `
    <div class="loading-spinner text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Chargement...</span>
      </div>
      <p class="mt-3">Chargement en cours...</p>
    </div>
  `;
}

/**
 * Create error message HTML
 * @param {string} message - Error message to display
 * @returns {string} - HTML for error display
 */
function createErrorMessage(message = 'Une erreur s\'est produite. Veuillez réessayer.') {
  return `
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>Erreur:</strong> ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}

/**
 * Create empty state message
 * @param {string} message - Empty state message
 * @returns {string} - HTML for empty state
 */
function createEmptyState(message = 'Aucune donnée disponible') {
  return `
    <div class="empty-state text-center py-5">
      <p class="text-muted">${message}</p>
    </div>
  `;
}

// ============ PORTFOLIO COMPONENTS ============

/**
 * Create portfolio card HTML
 * @param {Object} item - Portfolio item object
 * @returns {string} - HTML for portfolio card
 */
function createPortfolioCard(item) {
  const imageUrl = item.main_image || 'img/gallery/default.jpg';
  const url = `project_details.html?slug=${encodeURIComponent(item.slug)}`;
  
  return `
    <div class="col-lg-4 col-md-6 mb-30">
      <div class="portfolio-card">
        <div class="portfolio-card-img">
          <a href="${url}">
            <img src="${imageUrl}" alt="${item.title}" loading="lazy" decoding="async">
          </a>
          <span class="portfolio-category-badge">${item.category_display || item.category}</span>
        </div>
        <div class="portfolio-card-info">
          <h4><a href="${url}">${item.title}</a></h4>
          <div class="portfolio-card-meta">
            ${item.city ? '<span><i class="fas fa-map-marker-alt"></i> ' + item.city + '</span>' : ''}
            ${item.year ? '<span><i class="fas fa-calendar-alt"></i> ' + item.year + '</span>' : ''}
            ${item.area ? '<span><i class="fas fa-ruler-combined"></i> ' + item.area + '</span>' : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Create portfolio grid
 * @param {Array} items - Array of portfolio items
 * @returns {string} - HTML grid
 */
function createPortfolioGrid(items) {
  if (!items || items.length === 0) {
    return createEmptyState('Aucun projet disponible');
  }
  return items.map(item => createPortfolioCard(item)).join('');
}

// ============ SERVICE COMPONENTS ============

/**
 * Create service card HTML
 * @param {Object} service - Service object
 * @param {number} index - Card index for numbering
 * @returns {string} - HTML for service card
 */
function createServiceCard(service, index) {
  const iconUrl = service.icon || '';
  const num = String(index + 1).padStart(2, '0');
  const detailUrl = `services_details.html?id=${service.id}`;

  // Use icon from API if available, otherwise show a fallback icon
  const iconHtml = iconUrl
    ? `<img src="${iconUrl}" alt="${service.title}" loading="lazy" decoding="async" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
       <span class="modern-service-fallback-icon" style="display:none;"><i class="fas fa-hard-hat"></i></span>`
    : `<span class="modern-service-fallback-icon"><i class="fas fa-hard-hat"></i></span>`;

  return `
    <div class="col-lg-4 col-md-6 mb-30">
      <div class="modern-service-card">
        <div class="modern-service-number">${num}</div>
        <div class="modern-service-icon">
          ${iconHtml}
        </div>
        <h4 class="modern-service-title">${service.title}</h4>
        <p class="modern-service-desc">${service.short_description || service.description || ''}</p>
        <a href="${detailUrl}" class="modern-service-link">
          En savoir plus <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `;
}

/**
 * Create services grid
 * @param {Array} services - Array of service objects
 * @returns {string} - HTML grid
 */
function createServicesGrid(services) {
  if (!services || services.length === 0) {
    return createEmptyState('Aucun service disponible');
  }
  return services.map((service, i) => createServiceCard(service, i)).join('');
}

// ============ BLOG COMPONENTS ============

/**
 * Create blog card HTML
 * @param {Object} post - Blog post object
 * @returns {string} - HTML for blog card
 */
function createBlogCard(post) {
  const thumbnailUrl = post.thumbnail || 'img/gallery/default-blog.jpg';
  const postDate = new Date(post.published_date);
  const dateStr = postDate.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  const url = `blog_details.html?slug=${encodeURIComponent(post.slug)}`;
  
  return `
    <div class="col-lg-4 col-md-6 mb-30">
      <div class="home-blog-single">
        <div class="blog-img-cap">
          <div class="blog-img">
            <img src="${thumbnailUrl}" alt="${post.title}" loading="lazy" decoding="async">
          </div>
          <div class="blog-cap">
            <span>${dateStr}</span>
            <h3><a href="${url}">${post.title}</a></h3>
            <p>${post.excerpt}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Create blog grid
 * @param {Array} posts - Array of blog posts
 * @returns {string} - HTML grid
 */
function createBlogGrid(posts) {
  if (!posts || posts.length === 0) {
    return createEmptyState('Aucun article disponible');
  }
  return posts.map(post => createBlogCard(post)).join('');
}

// ============ TESTIMONIAL COMPONENTS ============

/**
 * Create testimonial card HTML
 * @param {Object} testimonial - Testimonial object
 * @returns {string} - HTML for testimonial
 */
function createTestimonialCard(testimonial) {
  const photoUrl = testimonial.photo || 'img/gallery/default-avatar.jpg';
  const hasPhoto = testimonial.photo;
  const stars = '★'.repeat(testimonial.rating || 0) + '☆'.repeat(5 - (testimonial.rating || 0));
  
  return `
    <div class="single-testimonial">
      <div class="testimonial-caption">
        <svg class="mb-20" width="33" height="28" viewBox="0 0 33 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M32.1875 28H20.5308V14.6821C20.5308 11.738 21.7388 9.57308 24.6527 9.57308C26.326 9.57308 27.5308 10.5044 28.2992 11.8125L31.4167 9.22644C29.9274 6.64286 27.2131 4.44174 24.0539 4.44174C17.5155 4.44174 14.0385 9.20659 14.0385 15.3906V28H32.1875Z" fill="currentColor"/>
          <path d="M14.4395 28H2.78275V14.6821C2.78275 11.738 3.99074 9.57308 6.90462 9.57308C8.57792 9.57308 9.78275 10.5044 10.5511 11.8125L13.6686 9.22644C12.1793 6.64286 9.46496 4.44174 6.30577 4.44174C-0.232905 4.44174 -3.70993 9.20659 -3.70993 15.3906V28H14.4395Z" fill="currentColor"/>
        </svg>
        <p>${testimonial.content}</p>
        <div class="testimonial-rating mb-10">
          <span class="stars">${stars}</span>
        </div>
        <div class="testimonial-person">
          ${hasPhoto ? `<img src="${photoUrl}" alt="${testimonial.client_name}" loading="lazy">` : '<div class="avatar-placeholder"></div>'}
          <div class="testimonial-person-info">
            <h6>${testimonial.client_name}</h6>
            <p>${testimonial.role}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Create empty state for testimonials section
 * @returns {string} - HTML for empty testimonial state
 */
function createTestimonialEmptyState() {
  return `
    <div class="testimonial-empty-state">
      <div class="testimonial-empty-icon">
        <svg width="64" height="54" viewBox="0 0 33 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M32.1875 28H20.5308V14.6821C20.5308 11.738 21.7388 9.57308 24.6527 9.57308C26.326 9.57308 27.5308 10.5044 28.2992 11.8125L31.4167 9.22644C29.9274 6.64286 27.2131 4.44174 24.0539 4.44174C17.5155 4.44174 14.0385 9.20659 14.0385 15.3906V28H32.1875Z" fill="currentColor"/>
          <path d="M14.4395 28H2.78275V14.6821C2.78275 11.738 3.99074 9.57308 6.90462 9.57308C8.57792 9.57308 9.78275 10.5044 10.5511 11.8125L13.6686 9.22644C12.1793 6.64286 9.46496 4.44174 6.30577 4.44174C-0.232905 4.44174 -3.70993 9.20659 -3.70993 15.3906V28H14.4395Z" fill="currentColor"/>
        </svg>
      </div>
      <h4>Aucun témoignage pour le moment</h4>
      <p>Nos clients n'ont pas encore partagé leurs expériences. Soyez le premier à travailler avec nous!</p>
      <a href="contact.html" class="btn hero-btn mt-20">Contactez-nous <i class="ti-arrow-right"></i></a>
    </div>
  `;
}

/**
 * Create testimonials carousel
 * @param {Array} testimonials - Array of testimonials
 * @returns {string} - HTML carousel
 */
function createTestimonialCarousel(testimonials) {
  if (!testimonials || testimonials.length === 0) {
    return createEmptyState('Aucun témoignage disponible');
  }
  
  const items = testimonials.map((t, idx) => `
    <div class="single-testimonial-slide" ${idx === 0 ? '' : 'style="display: none;"'}>
      ${createTestimonialCard(t)}
    </div>
  `).join('');
  
  return `<div class="testimonial-container">${items}</div>`;
}

// ============ PARTNER COMPONENTS ============

/**
 * Create partner logo HTML
 * @param {Object} partner - Partner object
 * @returns {string} - HTML for partner
 */
function createPartnerLogo(partner) {
  const url = partner.website || '#';
  const target = partner.website ? '_blank' : '';
  const rel = partner.website ? 'noopener noreferrer' : '';
  
  return `
    <div class="single-partner">
      <a href="${url}" ${target ? `target="${target}"` : ''} ${rel ? `rel="${rel}"` : ''}>
        <img src="${partner.logo}" alt="${partner.name}" loading="lazy" title="${partner.name}">
      </a>
    </div>
  `;
}

/**
 * Create partners carousel
 * @param {Array} partners - Array of partners
 * @returns {string} - HTML carousel
 */
function createPartnersCarousel(partners) {
  if (!partners || partners.length === 0) {
    return createEmptyState('Aucun partenaire disponible');
  }
  return partners.map(partner => createPartnerLogo(partner)).join('');
}

// ============ PAGINATION COMPONENTS ============

/**
 * Create pagination controls
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {Function} onPageChange - Callback when page changes
 * @returns {string} - HTML for pagination
 */
function createPagination(currentPage, totalPages, onPageChange) {
  if (totalPages <= 1) return '';
  
  let html = '<nav aria-label="Pagination"><ul class="pagination">';
  
  // Previous button
  if (currentPage > 1) {
    html += `<li class="page-item"><button class="page-link" onclick="(${onPageChange})(${currentPage - 1})">Précédent</button></li>`;
  }
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      html += `<li class="page-item active"><span class="page-link">${i}</span></li>`;
    } else {
      html += `<li class="page-item"><button class="page-link" onclick="(${onPageChange})(${i})">${i}</button></li>`;
    }
  }
  
  // Next button
  if (currentPage < totalPages) {
    html += `<li class="page-item"><button class="page-link" onclick="(${onPageChange})(${currentPage + 1})">Suivant</button></li>`;
  }
  
  html += '</ul></nav>';
  return html;
}

// ============ CONTACT FORM COMPONENTS ============

/**
 * Create contact form HTML
 * @returns {string} - HTML for contact form
 */
function createContactForm() {
  return `
    <form id="contact-form" class="contact-form">
      <div class="row">
        <div class="col-md-6 mb-3">
          <input type="text" name="name" placeholder="Votre nom *" required>
        </div>
        <div class="col-md-6 mb-3">
          <input type="email" name="email" placeholder="Votre email *" required>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 mb-3">
          <input type="tel" name="phone" placeholder="Votre téléphone">
        </div>
        <div class="col-md-6 mb-3">
          <input type="text" name="subject" placeholder="Sujet *" required>
        </div>
      </div>
      <div class="row">
        <div class="col-12 mb-3">
          <textarea name="message" placeholder="Votre message *" rows="6" required></textarea>
        </div>
      </div>
      <div id="form-message" class="mb-3"></div>
      <button type="submit" class="btn btn-primary">Envoyer</button>
    </form>
  `;
}

/**
 * Create "Build For Me" form HTML
 * @returns {string} - HTML for build for me form
 */
function createBuildForMeForm() {
  return `
    <form id="build-for-me-form" class="contact-form">
      <div class="row">
        <div class="col-md-6 mb-3">
          <input type="text" name="name" placeholder="Votre nom complet *" required>
        </div>
        <div class="col-md-6 mb-3">
          <input type="tel" name="phone" placeholder="Votre téléphone *" required>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 mb-3">
          <input type="email" name="email" placeholder="Votre email *" required>
        </div>
        <div class="col-md-6 mb-3">
          <select name="has_land" class="form-select">
            <option value="">-- Avez-vous un terrain? --</option>
            <option value="true">Oui</option>
            <option value="false">Non</option>
          </select>
        </div>
      </div>
      <div class="row">
        <div class="col-12 mb-3">
          <input type="text" name="location_of_land" placeholder="Localisation du terrain (optionnel)">
        </div>
      </div>
      <div class="row">
        <div class="col-12 mb-3">
          <textarea name="message" placeholder="Détails supplémentaires (optionnel)" rows="5"></textarea>
        </div>
      </div>
      <div id="form-message" class="mb-3"></div>
      <button type="submit" class="btn btn-primary">Soumettre votre demande</button>
    </form>
  `;
}

/**
 * Initialize a build-for-me form in a container
 * Renders the form and attaches submit handler
 * @param {string} selector - Container selector (default: '[data-component="build-for-me-form"]')
 */
function initBuildForMeForm(selector) {
  var container = document.querySelector(selector || '[data-component="build-for-me-form"]');
  if (!container) return;
  
  container.innerHTML = createBuildForMeForm();
  
  var form = document.getElementById('build-for-me-form');
  if (!form) return;
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    var messageDiv = form.querySelector('#form-message');
    var submitBtn = form.querySelector('button[type="submit"]');
    
    try {
      submitBtn.disabled = true;
      var originalText = submitBtn.textContent;
      submitBtn.textContent = 'Envoi en cours...';
      
      var formData = new FormData(form);
      var data = {};
      formData.forEach(function(value, key) { data[key] = value; });
      
      var response = await submitBuildForMe(data);
      
      if (messageDiv) {
        messageDiv.innerHTML = '<div class="alert alert-success"><strong>Succès!</strong> ' + (response.message || 'Votre demande a été envoyée avec succès.') + '</div>';
      }
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    } catch (error) {
      console.error('Error submitting build-for-me form:', error);
      if (messageDiv) {
        messageDiv.innerHTML = createErrorMessage(error.message);
      }
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

// ============ GALLERY COMPONENTS ============

/**
 * Create image gallery as an Owl Carousel with lightbox support
 * @param {Array} images - Array of gallery images
 * @returns {string} - HTML for gallery carousel
 */
function createImageGallery(images) {
  if (!images || images.length === 0) {
    return '<p class="text-muted">Aucune image disponible</p>';
  }

  var items = images.map(function(img, idx) {
    var caption = img.caption || 'Image ' + (idx + 1);
    return '<div class="gallery-carousel-item">' +
      '<a href="' + img.image + '" class="gallery-lightbox" title="' + caption + '">' +
        '<img src="' + img.image + '" alt="' + caption + '" loading="lazy">' +
        (img.caption ? '<span class="gallery-carousel-caption">' + img.caption + '</span>' : '') +
      '</a>' +
    '</div>';
  }).join('');

  return '<div class="gallery-carousel owl-carousel">' + items + '</div>';
}

/**
 * Initialize gallery carousel and lightbox after DOM insertion
 */
function initGalleryCarousel() {
  var $carousel = $('.gallery-carousel');
  if (!$carousel.length) return;

  $carousel.owlCarousel({
    items: 1,
    loop: true,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    smartSpeed: 600,
    navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
    responsive: {
      0:   { items: 1 },
      768: { items: 2 },
      992: { items: 3 }
    }
  });

  // Magnific Popup lightbox on gallery images
  $carousel.magnificPopup({
    delegate: '.gallery-lightbox',
    type: 'image',
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0, 1],
      tCounter: '%curr% / %total%'
    },
    image: {
      titleSrc: 'title'
    }
  });
}

// ============ VIDEO COMPONENTS ============

/**
 * Create YouTube video section from video array
 * @param {Array} videos - Array of video objects with title and video_url
 * @returns {string} - HTML for video section
 */
function createVideoSection(videos) {
  if (!videos || videos.length === 0) return '';

  var items = videos.map(function(video) {
    var embedUrl = extractYoutubeEmbedUrl(video.video_url);
    if (!embedUrl) return '';
    return '<div class="col-md-6 mb-4">' +
      '<div class="video-card">' +
        '<div class="video-wrapper">' +
          '<iframe src="' + embedUrl + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' +
        '</div>' +
        (video.title ? '<h5 class="video-card-title">' + video.title + '</h5>' : '') +
      '</div>' +
    '</div>';
  }).join('');

  return '<div class="row">' + items + '</div>';
}

/**
 * Extract YouTube embed URL from various YouTube URL formats
 * @param {string} url - YouTube URL
 * @returns {string} - Embeddable URL
 */
function extractYoutubeEmbedUrl(url) {
  if (!url) return '';
  var match1 = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  if (match1) return 'https://www.youtube.com/embed/' + match1[1];
  var match2 = url.match(/youtube\.com\/embed\/([^&\n?#]+)/);
  if (match2) return url;
  return '';
}

// ============ BUILD FOR ME MODAL ============

/**
 * Open "Build For Me" modal with form
 */
function openBuildForMeModal() {
  // Prevent duplicate modals
  if (document.getElementById('buildForMeModal')) {
    $('#buildForMeModal').modal('show');
    return;
  }

  var modalHtml = '<div class="modal fade" id="buildForMeModal" tabindex="-1" role="dialog" aria-labelledby="buildForMeModalLabel" aria-hidden="true">' +
    '<div class="modal-dialog modal-lg modal-dialog-centered" role="document">' +
      '<div class="modal-content build-for-me-modal-content">' +
        '<div class="modal-header">' +
          '<h4 class="modal-title" id="buildForMeModalLabel">Faites Construire Votre Projet</h4>' +
          '<button type="button" class="close" data-dismiss="modal" aria-label="Fermer"><span aria-hidden="true">&times;</span></button>' +
        '</div>' +
        '<div class="modal-body">' +
          '<p class="text-muted mb-4">Remplissez le formulaire ci-dessous et nous vous contacterons pour discuter de votre projet de construction.</p>' +
          '<div data-component="build-for-me-modal-form"></div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  initBuildForMeForm('[data-component="build-for-me-modal-form"]');
  $('#buildForMeModal').modal('show');
}

/**
 * Auto-bind all "Build For Me" nav buttons to open the modal
 */
function initBuildForMeButtons() {
  $(document).on('click', '.btn-build-for-me', function(e) {
    e.preventDefault();
    openBuildForMeModal();
  });
}

// ============ EXPORTS ============

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // Loading & Error
    createLoadingSpinner,
    createErrorMessage,
    createEmptyState,
    
    // Portfolio
    createPortfolioCard,
    createPortfolioGrid,
    
    // Services
    createServiceCard,
    createServicesGrid,
    
    // Blog
    createBlogCard,
    createBlogGrid,
    
    // Testimonials
    createTestimonialCard,
    createTestimonialCarousel,
    
    // Partners
    createPartnerLogo,
    createPartnersCarousel,
    
    // Pagination
    createPagination,
    
    // Forms
    createContactForm,
    createBuildForMeForm,
    initBuildForMeForm,
    
    // Gallery
    createImageGallery,
    initGalleryCarousel,
    
    // Video
    createVideoSection,
    extractYoutubeEmbedUrl,
    
    // Build For Me Modal
    openBuildForMeModal,
    initBuildForMeButtons,
  };
}

// Auto-init Build For Me buttons on all pages
$(document).ready(function() {
  initBuildForMeButtons();
});
