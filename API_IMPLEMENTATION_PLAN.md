# Belle House Website - API Implementation Plan

**Project:** Belle House Website API Integration  
**API Base URL:** `https://api2.bellehouseniger.com/api`  
**Date:** February 21, 2026

---

## Phase 1: Setup & Configuration

### 1.1 Create API Client Module
**File:** `js/api/client.js`
- Define `API_BASE_URL` constant
- Create default fetch wrapper with error handling
- Implement token refresh logic (if needed for forms)
- Export all API functions

**Dependencies:**
- No external libraries (use native Fetch API)

---

## Phase 2: Core API Functions

### 2.1 Portfolio Endpoints
**File:** `js/api/portfolio.js`

```javascript
// Endpoints to implement:
- getPortfolio(category, featured, page)      // GET /api/portfolio/
- getPortfolioDetail(slug)                      // GET /api/portfolio/{slug}/
```

**Pages using this:**
- `project.html` → display all portfolio items
- `project_details.html` → display single project with gallery

---

### 2.2 Services Endpoints
**File:** `js/api/services.js`

```javascript
// Endpoints to implement:
- getServices()                                 // GET /api/services/
```

**Pages using this:**
- `services.html` → display service listings
- `services_details.html` → display service details (if applicable)

---

### 2.3 Blog Endpoints
**File:** `js/api/blog.js`

```javascript
// Endpoints to implement:
- getBlogPosts(page, search)                   // GET /api/blog/
- getBlogDetail(slug)                          // GET /api/blog/{slug}/
```

**Pages using this:**
- `blog.html` → list all blog posts with pagination
- `blog_details.html` → display single article with full content

---

### 2.4 Testimonials Endpoints
**File:** `js/api/testimonials.js`

```javascript
// Endpoints to implement:
- getTestimonials(featured)                    // GET /api/testimonials/
```

**Pages using this:**
- `index.html` → homepage testimonials carousel
- Possibly `about.html` → customer success stories

---

### 2.5 Partners Endpoints
**File:** `js/api/partners.js`

```javascript
// Endpoints to implement:
- getPartners()                                // GET /api/partners/
```

**Pages using this:**
- `index.html` → partners section/carousel

---

### 2.6 Contact Form Endpoints
**File:** `js/api/contact.js`

```javascript
// Endpoints to implement:
- submitContact(name, email, phone, subject, message)    // POST /api/contact/
- submitBuildForMe(name, phone, email, location, message, interested_in, has_land)  // POST /api/build-for-me/
```

**Pages using this:**
- `contact.html` → general contact form
- `project_details.html` → "Build For Me" lead generation form

---

### 2.7 Promotions Endpoints
**File:** `js/api/promotions.js`

```javascript
// Endpoints to implement:
- getPromotions()                              // GET /api/app/promotions/
```

**Pages using this:**
- `index.html` → promotional banners

---

## Phase 3: Page-by-Page Integration

### 3.1 `index.html` (Homepage)
**Components to integrate:**
- [ ] Portfolio featured items (4-5 latest realizations)
- [ ] Services overview (3 main services)
- [ ] Partners carousel
- [ ] Testimonials slider
- [ ] Promotional banners (optional)

**API Calls:**
```javascript
getPortfolio({ category: 'REALIZATION', is_featured: true })
getServices()
getPartners()
getTestimonials({ featured: true })
getPromotions()
```

---

### 3.2 `project.html` (Projects/Portfolio List)
**Components to integrate:**
- [ ] Portfolio grid with all items
- [ ] Filter by category (PROJECT/REALIZATION)
- [ ] Filter by featured items
- [ ] Pagination (20 items per page)
- [ ] Search functionality

**API Calls:**
```javascript
getPortfolio({ category, is_featured, page, search })
```

---

### 3.3 `project_details.html` (Single Project)
**Components to integrate:**
- [ ] Project title, description, images
- [ ] Project details (area, city, year, owner, contractor, usage)
- [ ] Gallery images with captions
- [ ] Video embeds (if available)
- [ ] "Build For Me" form at bottom

**API Calls:**
```javascript
getPortfolioDetail(slug)
submitBuildForMe(formData)
```

---

### 3.4 `services.html` (Services List)
**Components to integrate:**
- [ ] Service cards with icons
- [ ] Service title and description
- [ ] Call-to-action buttons

**API Calls:**
```javascript
getServices()
```

---

### 3.5 `services_details.html` (Service Details)
**Components to integrate:**
- [ ] Full service description
- [ ] Related services
- [ ] Call-to-action

**API Calls:**
```javascript
getServices()
```

---

### 3.6 `blog.html` (Blog List)
**Components to integrate:**
- [ ] Blog post cards with thumbnails
- [ ] Excerpts and published dates
- [ ] Pagination
- [ ] Search functionality

**API Calls:**
```javascript
getBlogPosts({ page, search })
```

---

### 3.7 `blog_details.html` (Single Blog Post)
**Components to integrate:**
- [ ] Blog title, thumbnail, published date
- [ ] Full HTML content
- [ ] Related posts (optional)

**API Calls:**
```javascript
getBlogDetail(slug)
```

---

### 3.8 `contact.html` (Contact Form)
**Components to integrate:**
- [ ] Contact form with fields: name, email, phone, subject, message
- [ ] Form validation
- [ ] Success/error messages
- [ ] Loading state

**API Calls:**
```javascript
submitContact(formData)
```

---

### 3.9 `about.html` (About Page)
**Components to integrate:**
- [ ] Company testimonials (optional)
- [ ] Featured projects showcase

**API Calls:**
```javascript
getTestimonials({ featured: true })
getPortfolio({ is_featured: true })
```

---

### 3.10 `elements.html` (Component Library)
**Components to create:**
- [ ] Reusable portfolio card component
- [ ] Reusable blog card component
- [ ] Reusable service card component
- [ ] Loading spinner
- [ ] Error message component
- [ ] Pagination component

---

## Phase 4: Implementation Steps

### Step 1: Create API Client (`js/api/client.js`)
- [ ] Define API config
- [ ] Create main fetch wrapper
- [ ] Add error handling
- [ ] Export API functions

**Estimated time:** 1-2 hours

---

### Step 2: Create Individual API Modules
- [ ] Create `js/api/portfolio.js`
- [ ] Create `js/api/services.js`
- [ ] Create `js/api/blog.js`
- [ ] Create `js/api/testimonials.js`
- [ ] Create `js/api/partners.js`
- [ ] Create `js/api/contact.js`
- [ ] Create `js/api/promotions.js`

**Estimated time:** 2-3 hours

---

### Step 3: Create Reusable Components (`js/components/`)
- [ ] Create `PortfolioCard.js`
- [ ] Create `BlogCard.js`
- [ ] Create `ServiceCard.js`
- [ ] Create `LoadingSpinner.js`
- [ ] Create `ErrorMessage.js`
- [ ] Create `Pagination.js`

**Estimated time:** 2-3 hours

---

### Step 4: Integrate API Calls into Pages
- [ ] `index.html` (homepage) 
- [ ] `project.html` (portfolio list)
- [ ] `project_details.html` (portfolio detail)
- [ ] `services.html` (services list)
- [ ] `services_details.html` (service details)
- [ ] `blog.html` (blog list)
- [ ] `blog_details.html` (blog detail)
- [ ] `contact.html` (contact form)
- [ ] `about.html` (about page)

**Estimated time:** 4-6 hours

---

### Step 5: Testing & Debugging
- [ ] Test each endpoint with sample data
- [ ] Verify pagination works
- [ ] Test form submissions
- [ ] Test error handling
- [ ] Test responsive design
- [ ] Console error checking

**Estimated time:** 2-3 hours

---

### Step 6: Performance & Optimization
- [ ] Add loading states
- [ ] Add error recovery
- [ ] Cache data where appropriate
- [ ] Optimize image loading

**Estimated time:** 1-2 hours

---

## Phase 5: File Structure

```
js/
├── api/
│   ├── client.js              # Main API wrapper
│   ├── portfolio.js           # Portfolio endpoints
│   ├── services.js            # Services endpoints
│   ├── blog.js                # Blog endpoints
│   ├── testimonials.js        # Testimonials endpoints
│   ├── partners.js            # Partners endpoints
│   ├── contact.js             # Contact form endpoints
│   └── promotions.js          # Promotions endpoints
├── components/
│   ├── portfolio-card.js      # Portfolio card component
│   ├── blog-card.js           # Blog card component
│   ├── service-card.js        # Service card component
│   ├── loading-spinner.js     # Loading indicator
│   ├── error-message.js       # Error display
│   └── pagination.js          # Pagination controls
├── main.js                    # Existing main script
├── content-loader.js          # Existing content loader
└── ...other existing files
```

---

## Phase 6: Development Checklist

### API Setup
- [ ] Verify API is accessible and CORS configured
- [ ] Test endpoints manually with Postman/curl
- [ ] Document response structures

### Frontend Setup
- [ ] Create folder structure
- [ ] Create API client module
- [ ] Create component library

### Homepage Integration
- [ ] [ ] Load portfolio featured items
- [ ] [ ] Load services
- [ ] [ ] Load partners
- [ ] [ ] Load testimonials
- [ ] [ ] Load promotions

### Portfolio Pages
- [ ] [ ] Implement portfolio list with filtering
- [ ] [ ] Implement portfolio detail page
- [ ] [ ] Add image gallery
- [ ] [ ] Add video embeds
- [ ] [ ] Add "Build For Me" form

### Services Pages
- [ ] [ ] Display services list
- [ ] [ ] Create service detail pages (if needed)

### Blog Pages
- [ ] [ ] Display blog list with pagination
- [ ] [ ] Display blog detail with full HTML content
- [ ] [ ] Add search functionality

### Contact Pages
- [ ] [ ] Implement contact form
- [ ] [ ] Add form validation
- [ ] [ ] Add success/error messages
- [ ] [ ] Implement Build For Me form

### Testing
- [ ] [ ] Test all endpoints
- [ ] [ ] Test error scenarios
- [ ] [ ] Test on mobile devices
- [ ] [ ] Test with slow network (throttle)

---

## Dependencies & Tools

**No external libraries required** - Using native:
- Fetch API (for HTTP requests)
- DOM APIs (for rendering)
- LocalStorage (for caching, if needed)

**Optional enhancements:**
- Axios (for more advanced HTTP handling)
- Vue.js/React (for complex components)

---

## Risk & Mitigation

| Risk | Mitigation |
|------|-----------|
| API downtime | Add offline fallback with cached data |
| Slow API response | Add loading states and timeout handling |
| Large image files | Optimize images, add lazy loading |
| Form validation errors | Show field-specific error messages |
| CORS issues | Verify CORS configuration with backend team |

---

## Estimated Timeline

- **Phase 1-2:** API Setup & Client (3-5 hours)
- **Phase 3:** Components (2-3 hours)
- **Phase 4:** Page Integration (4-6 hours)
- **Phase 5:** Testing (2-3 hours)
- **Phase 6:** Optimization (1-2 hours)

**Total: 12-19 hours (2-3 days of full-time work)**

---

## Notes

- All endpoints are public (no authentication needed)
- Images are served from API URLs (https://api2.bellehouseniger.com/media/...)
- Blog content is HTML and can be rendered directly
- Pagination uses page numbers (1-based indexing)
- Error responses follow standard JSON format with field-specific messages

