// Content Manager - Load and inject content from JSON
(function() {
    'use strict';
    
    // Load content from JSON file
    fetch('content.json')
        .then(response => response.json())
        .then(content => {
            // Update page title
            if (content.site && content.site.title) {
                document.title = content.site.title;
            }
            
            // Update header content
            if (content.header) {
                updateElement('.header-info-left li:nth-child(1)', `<i class="fas fa-phone"></i> ${content.header.phone}`);
                updateElement('.header-info-left li:nth-child(2)', `<i class="far fa-envelope"></i>${content.header.email}`);
                updateElement('.header-info-right .btn', `${content.header.ctaButton} <i class="ti-arrow-right"></i>`);
                
                // Update menu items
                if (content.header.menu) {
                    updateText('#navigation > li:nth-child(1) > a', content.header.menu.home);
                    updateText('#navigation > li:nth-child(2) > a', content.header.menu.about);
                    updateText('#navigation > li:nth-child(3) > a', content.header.menu.services);
                    updateText('#navigation > li:nth-child(4) > a', content.header.menu.project);
                    updateText('#navigation > li:nth-child(5) > a', content.header.menu.blog);
                    updateText('#navigation > li:nth-child(7) > a', content.header.menu.contact);
                }
            }
            
            // Update hero section
            if (content.hero) {
                if (content.hero.slide1) {
                    updateElement('.slider-active .single-slider:nth-child(1) h1', content.hero.slide1.title);
                    updateText('.slider-active .single-slider:nth-child(1) p', content.hero.slide1.subtitle);
                    updateElement('.slider-active .single-slider:nth-child(1) .hero-btn', `${content.hero.slide1.buttonText} <i class="ti-arrow-right"></i>`);
                }
                if (content.hero.slide2) {
                    updateElement('.slider-active .single-slider:nth-child(2) h1', content.hero.slide2.title);
                    updateText('.slider-active .single-slider:nth-child(2) p', content.hero.slide2.subtitle);
                    updateElement('.slider-active .single-slider:nth-child(2) .hero-btn', `${content.hero.slide2.buttonText} <i class="ti-arrow-right"></i>`);
                }
            }
            
            // Update about section
            if (content.about) {
                updateText('.about-low-area .element', content.about.sectionLabel);
                updateText('.about-low-area .section-tittle h2', content.about.title);
                updateText('.about-low-area .about-caption p', content.about.description);
                
                if (content.about.stats) {
                    updateText('.experience:nth-child(1) span', content.about.stats.deliveryPackages.value);
                    updateText('.experience:nth-child(1) p', content.about.stats.deliveryPackages.label);
                    updateText('.experience:nth-child(2) span', content.about.stats.countriesCovered.value);
                    updateText('.experience:nth-child(2) p', content.about.stats.countriesCovered.label);
                }
            }
            
            console.log('Content loaded successfully from content.json');
        })
        .catch(error => {
            console.error('Error loading content:', error);
        });
    
    // Helper function to update text content
    function updateText(selector, text) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = text;
        }
    }
    
    // Helper function to update HTML content
    function updateElement(selector, html) {
        const element = document.querySelector(selector);
        if (element) {
            element.innerHTML = html;
        }
    }
})();
