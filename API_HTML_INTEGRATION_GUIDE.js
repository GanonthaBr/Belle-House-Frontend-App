/**
 * HTML Integration Guide
 * Shows how to add data-component attributes to your HTML for API integration
 * 
 * Copy the data-component attributes into your HTML elements
 */

/*
  
=== HOMEPAGE (index.html) ===

For Featured Portfolio Section:
  <div data-component="featured-portfolio"></div>

For Services Section:
  <div data-component="services"></div>

For Testimonials Section:
  <div data-component="testimonials" class="h1-testimonial-active"></div>

For Partners Section:
  <div data-component="partners"></div>

For Promotions Section:
  <div data-component="promotions"></div>


=== PORTFOLIO LIST PAGE (project.html) ===

For Portfolio Grid:
  <div data-component="portfolio-list"></div>

For Filters (optional):
  <select id="filter-category" data-filter="category">
    <option value="">All Categories</option>
    <option value="PROJECT">Projects</option>
    <option value="REALIZATION">Realizations</option>
  </select>
  
  <select id="filter-city" data-filter="city">
    <option value="">All Cities</option>
  </select>
  
  <select id="filter-ordering" data-filter="ordering">
    <option value="-year">Latest First</option>
    <option value="year">Oldest First</option>
    <option value="order">Featured</option>
  </select>
  
  <input type="search" id="filter-search" data-filter="search" placeholder="Search...">

For Quick Filter Buttons:
  <button onclick="filterByCategory('PROJECT')">View Projects</button>
  <button onclick="filterByCategory('REALIZATION')">View Realizations</button>
  <button onclick="filterByFeatured()">Featured Only</button>
  <button onclick="clearFilters()">Clear Filters</button>


=== PORTFOLIO DETAIL PAGE (project_details.html) ===

For Portfolio Detail:
  <div data-component="portfolio-detail"></div>

For Build-For-Me Form:
  <div data-component="build-for-me-form"></div>

Note: Requires URL parameter: ?slug=project-slug


=== SERVICES PAGE (services.html) ===

For Services List:
  <div data-component="services-list"></div>

For Service Detail (if using service detail page):
  <div data-component="service-detail"></div>

For Search:
  <input type="search" id="service-search" placeholder="Search services...">
  <div data-component="services-search-results"></div>


=== SERVICES DETAIL PAGE (services_details.html) ===

For Service Detail Display:
  <div data-component="service-detail"></div>

In your page script, call:
  loadServiceDetail(serviceId);


=== BLOG LIST PAGE (blog.html) ===

For Blog Grid:
  <div data-component="blog-list"></div>

For Search:
  <input type="search" id="blog-search" placeholder="Search articles...">


=== BLOG DETAIL PAGE (blog_details.html) ===

For Blog Detail:
  <div data-component="blog-detail"></div>

For Related Posts:
  <div data-component="related-posts"></div>

Note: Requires URL parameter: ?slug=article-slug

After loading detail, call:
  const slug = getQueryParameter('slug');
  loadRelatedPosts(slug);


=== CONTACT PAGE (contact.html) ===

For Contact Form:
  <div data-component="contact-form"></div>


=== ABOUT PAGE (about.html) ===

For Featured Portfolio:
  <div data-component="about-portfolio"></div>

For Testimonials:
  <div data-component="about-testimonials"></div>


=== REQUIRED SCRIPT TAGS IN HTML ===

Add these scripts to your HTML head or before closing body tag:

1. API Client (required for all pages):
   <script src="js/api/client.js"></script>

2. API Modules (required based on which endpoints you use):
   <script src="js/api/portfolio.js"></script>
   <script src="js/api/services.js"></script>
   <script src="js/api/blog.js"></script>
   <script src="js/api/testimonials.js"></script>
   <script src="js/api/partners.js"></script>
   <script src="js/api/contact.js"></script>
   <script src="js/api/promotions.js"></script>

3. Components (required for rendering):
   <script src="js/components.js"></script>

4. Page-specific scripts (add the one for your current page):
   
   For Homepage:
   <script src="js/pages/homepage.js"></script>
   
   For Portfolio List (project.html):
   <script src="js/pages/portfolio-list.js"></script>
   
   For Portfolio Detail (project_details.html):
   <script src="js/pages/portfolio-detail.js"></script>
   
   For Services (services.html):
   <script src="js/pages/services.js"></script>
   
   For Blog List (blog.html):
   <script src="js/pages/blog-list.js"></script>
   
   For Blog Detail (blog_details.html):
   <script src="js/pages/blog-detail.js"></script>
   
   For Contact (contact.html):
   <script src="js/pages/contact.js"></script>
   
   For About (about.html):
   <script src="js/pages/about.js"></script>


=== EXAMPLE COMPLETE HTML SNIPPET ===

For homepage (index.html), add before </body>:

  <!-- API Client -->
  <script src="js/api/client.js"></script>
  
  <!-- API Modules -->
  <script src="js/api/portfolio.js"></script>
  <script src="js/api/services.js"></script>
  <script src="js/api/testimonials.js"></script>
  <script src="js/api/partners.js"></script>
  <script src="js/api/promotions.js"></script>
  
  <!-- Components -->
  <script src="js/components.js"></script>
  
  <!-- Page Script -->
  <script src="js/pages/homepage.js"></script>


=== EXAMPLE PORTFOLIO LIST PAGE ===

<div class="container">
  <h1>Portfolio</h1>
  
  <div class="filters mb-4">
    <select id="filter-category" data-filter="category">
      <option value="">All Categories</option>
      <option value="PROJECT">Projects</option>
      <option value="REALIZATION">Realizations</option>
    </select>
    
    <select id="filter-ordering" data-filter="ordering">
      <option value="-year">Latest</option>
      <option value="year">Oldest</option>
    </select>
    
    <input type="search" id="filter-search" data-filter="search" placeholder="Search...">
  </div>
  
  <!-- Portfolio Grid Will Load Here -->
  <div data-component="portfolio-list"></div>
</div>

<!-- Scripts -->
<script src="js/api/client.js"></script>
<script src="js/api/portfolio.js"></script>
<script src="js/components.js"></script>
<script src="js/pages/portfolio-list.js"></script>


=== STYLING CSS CLASSES ===

Add these CSS classes for better styling (optional):

.loading-spinner { display: flex; justify-content: center; padding: 40px; }
.empty-state { padding: 40px; text-align: center; color: #999; }
.error-message { padding: 20px; background-color: #f8d7da; border: 1px solid #f5c6cb; }
.portfolio-card { border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.blog-card { border-radius: 8px; overflow: hidden; }
.pagination { display: flex; gap: 5px; justify-content: center; margin: 20px 0; }
.page-item { list-style: none; }
.page-link { padding: 8px 12px; border: 1px solid #ddd; cursor: pointer; }
.page-link:hover { background-color: #f0f0f0; }
.page-item.active .page-link { background-color: #007bff; color: white; }

*/
