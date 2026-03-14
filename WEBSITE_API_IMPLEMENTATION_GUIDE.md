# 🌐 Belle House Website - API Implementation Guide

**Version:** 1.0.0  
**Last Updated:** February 2026  
**API Base URL:** `https://api2.bellehouseniger.com/api`  
**Swagger Docs:** `https://api2.bellehouseniger.com/api/docs/`

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Public API Endpoints (No Authentication)](#public-api-endpoints-no-authentication)
   - [Portfolio](#portfolio)
   - [Services](#services)
   - [Partners](#partners)
   - [Testimonials](#testimonials)
   - [Blog](#blog)
   - [Contact Forms](#contact-forms)
4. [Authentication](#authentication)
5. [Authenticated User Endpoints](#authenticated-user-endpoints)
6. [Data Models & Enums](#data-models--enums)
7. [Error Handling](#error-handling)
8. [Pagination & Filtering](#pagination--filtering)
9. [Code Examples](#code-examples)

---

## Overview

This API powers the Belle House public website. It provides:

- **Public Endpoints** (no authentication required):
  - Portfolio showcase (design projects & completed realizations)
  - Services listing
  - Partners showcase
  - Client testimonials
  - Blog articles
  - Contact & lead generation forms

- **Authenticated Endpoints** (JWT token required):
  - User registration & login
  - Profile management
  - Client projects & invoices (for registered clients)

---

## Getting Started

### Base Configuration

```javascript
// config/api.js
const API_BASE_URL = 'https://api2.bellehouseniger.com/api';

// Default headers for all requests
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Add authorization header for authenticated requests
const authHeaders = (token) => ({
  ...defaultHeaders,
  'Authorization': `Bearer ${token}`,
});
```

### CORS

The API accepts requests from:
- `https://bellehouseniger.com`
- `http://localhost:3000` (for development)
- `http://127.0.0.1:3000` (for development)

---

## Public API Endpoints (No Authentication)

### Portfolio

Portfolio items showcase Belle House's design projects (maquettes) and completed realizations.

#### List All Portfolio Items

```http
GET /api/portfolio/
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by category: `PROJECT` (maquettes) or `REALIZATION` (completed) |
| `is_featured` | boolean | Filter featured items: `true` or `false` |
| `city` | string | Filter by city |
| `year` | number | Filter by year |
| `search` | string | Search in title, description, city, district |
| `ordering` | string | Sort by: `order`, `created_at`, `year`, `-created_at` (prefix `-` for descending) |
| `page` | number | Page number (default: 1) |

**Example Request:**
```http
GET /api/portfolio/?category=REALIZATION&is_featured=true&ordering=-year
```

**Response (200 OK):**
```json
{
  "count": 12,
  "next": "https://api2.bellehouseniger.com/api/portfolio/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Villa Moderne Niamey",
      "slug": "villa-moderne-niamey",
      "category": "REALIZATION",
      "category_display": "Réalisation",
      "main_image": "https://api2.bellehouseniger.com/media/portfolio/main/villa_niamey.jpg",
      "area": "405.30 m²",
      "city": "Niamey",
      "year": 2024,
      "is_featured": true,
      "order": 1
    },
    {
      "id": 2,
      "title": "Bureau Moderne",
      "slug": "bureau-moderne",
      "category": "PROJECT",
      "category_display": "Projet (Maquette)",
      "main_image": "https://api2.bellehouseniger.com/media/portfolio/main/bureau.jpg",
      "area": "250 m²",
      "city": "Maradi",
      "year": 2025,
      "is_featured": false,
      "order": 2
    }
  ]
}
```

---

#### Get Portfolio Item Detail

```http
GET /api/portfolio/{slug}/
```

**Note:** Uses `slug` as the lookup field, NOT `id`.

**Example Request:**
```http
GET /api/portfolio/villa-moderne-niamey/
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Villa Moderne Niamey",
  "slug": "villa-moderne-niamey",
  "category": "REALIZATION",
  "category_display": "Réalisation",
  "main_image": "https://api2.bellehouseniger.com/media/portfolio/main/villa_niamey.jpg",
  "description": "Une villa moderne avec piscine, construite pour M. Christophe dans le quartier Plateau à Niamey.",
  "area": "405.30 m²",
  "task": "Conception et Réalisation",
  "owner": "M. Christophe",
  "contractor": "Belle House",
  "year": 2024,
  "usage": "Habitation",
  "district": "Plateau",
  "city": "Niamey",
  "country": "Niger",
  "order": 1,
  "is_featured": true,
  "gallery_images": [
    {
      "id": 1,
      "image": "https://api2.bellehouseniger.com/media/portfolio/gallery/villa_1.jpg",
      "caption": "Vue de face",
      "order": 1
    },
    {
      "id": 2,
      "image": "https://api2.bellehouseniger.com/media/portfolio/gallery/villa_2.jpg",
      "caption": "Piscine",
      "order": 2
    }
  ],
  "videos": [
    {
      "id": 1,
      "title": "Visite virtuelle",
      "video_url": "https://www.youtube.com/watch?v=example123",
      "order": 1
    }
  ],
  "created_at": "2024-03-15T10:30:00Z",
  "updated_at": "2024-06-20T14:45:00Z"
}
```

---

### Services

List of services offered by Belle House.

#### List All Services

```http
GET /api/services/
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Construction",
    "icon": "https://api2.bellehouseniger.com/media/services/icons/construction.svg",
    "short_description": "Construction de bâtiments résidentiels et commerciaux avec les meilleurs standards de qualité.",
    "order": 1
  },
  {
    "id": 2,
    "title": "Conception Architecturale",
    "icon": "https://api2.bellehouseniger.com/media/services/icons/architecture.svg",
    "short_description": "Conception de plans architecturaux modernes adaptés à vos besoins.",
    "order": 2
  },
  {
    "id": 3,
    "title": "Rénovation",
    "icon": "https://api2.bellehouseniger.com/media/services/icons/renovation.svg",
    "short_description": "Services de rénovation complète pour moderniser votre espace.",
    "order": 3
  }
]
```

**Note:** Only active services are returned, pre-sorted by `order`.

---

### Partners

List of Belle House's partner companies.

#### List All Partners

```http
GET /api/partners/
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Cimenterie du Niger",
    "logo": "https://api2.bellehouseniger.com/media/partners/logos/cimenterie.png",
    "website": "https://cimenterie-niger.com",
    "order": 1
  },
  {
    "id": 2,
    "name": "Quincaillerie Moderne",
    "logo": "https://api2.bellehouseniger.com/media/partners/logos/quincaillerie.png",
    "website": "",
    "order": 2
  }
]
```

**Note:** Only active partners are returned, pre-sorted by `order`.

---

### Testimonials

Client testimonials for social proof.

#### List All Testimonials

```http
GET /api/testimonials/
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `is_featured` | boolean | Filter featured testimonials: `true` or `false` |

**Example Request:**
```http
GET /api/testimonials/?is_featured=true
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "client_name": "M. Abdoulaye Ibrahim",
    "role": "Propriétaire",
    "photo": "https://api2.bellehouseniger.com/media/testimonials/photos/abdoulaye.jpg",
    "content": "Belle House a construit ma maison avec un professionnalisme remarquable. Je recommande vivement leurs services.",
    "rating": 5,
    "is_featured": true
  },
  {
    "id": 2,
    "client_name": "Mme. Fatima Hassan",
    "role": "Directrice d'entreprise",
    "photo": null,
    "content": "Excellent travail sur nos bureaux. L'équipe est compétente et respecte les délais.",
    "rating": 4,
    "is_featured": true
  }
]
```

**Note:** 
- Rating is from 1 to 5
- `photo` can be null
- Only active testimonials are returned

---

### Blog

Blog articles for content marketing.

#### List All Blog Posts

```http
GET /api/blog/
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search in title, content, excerpt |
| `ordering` | string | Sort by: `published_date`, `created_at` (prefix `-` for descending) |
| `page` | number | Page number (default: 1) |

**Response (200 OK):**
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Les tendances architecturales 2026",
      "slug": "tendances-architecturales-2026",
      "thumbnail": "https://api2.bellehouseniger.com/media/blog/thumbnails/trends.jpg",
      "excerpt": "Découvrez les nouvelles tendances en architecture résidentielle cette année.",
      "published_date": "2026-01-15T09:00:00Z",
      "created_at": "2026-01-10T14:30:00Z"
    }
  ]
}
```

**Note:** Only published blog posts are returned.

---

#### Get Blog Post Detail

```http
GET /api/blog/{slug}/
```

**Note:** Uses `slug` as the lookup field, NOT `id`.

**Example Request:**
```http
GET /api/blog/tendances-architecturales-2026/
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Les tendances architecturales 2026",
  "slug": "tendances-architecturales-2026",
  "thumbnail": "https://api2.bellehouseniger.com/media/blog/thumbnails/trends.jpg",
  "content": "<p>Full HTML content of the blog post...</p><h2>Section 1</h2><p>More content...</p>",
  "excerpt": "Découvrez les nouvelles tendances en architecture résidentielle cette année.",
  "published_date": "2026-01-15T09:00:00Z",
  "is_published": true,
  "created_at": "2026-01-10T14:30:00Z",
  "updated_at": "2026-01-14T16:20:00Z"
}
```

**Note:** The `content` field contains full HTML that can be rendered directly.

---

### Contact Forms

Two forms for lead generation: "Build For Me" and general contact.

#### Build For Me Form (Construction Lead)

For visitors interested in having Belle House build for them.

```http
POST /api/build-for-me/
```

**Request Body:**
```json
{
  "name": "Mohamed Ali",
  "phone": "+227 91 23 45 67",
  "email": "mohamed.ali@example.com",
  "has_land": true,
  "location_of_land": "Niamey, Quartier Kalley",
  "interested_in": 5,
  "message": "Je souhaite construire une villa similaire au projet Villa Moderne."
}
```

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ Yes | Full name of the visitor |
| `phone` | string | ✅ Yes | Phone number |
| `email` | string | ✅ Yes | Email address |
| `has_land` | boolean | ❌ No | Whether they own land (default: false) |
| `location_of_land` | string | ❌ No | Location of their land |
| `interested_in` | integer | ❌ No | Portfolio item ID they're interested in |
| `message` | string | ❌ No | Additional details |

**Response (201 Created):**
```json
{
  "message": "Votre demande a été envoyée avec succès. Nous vous contacterons bientôt.",
  "data": {
    "name": "Mohamed Ali",
    "phone": "+227 91 23 45 67",
    "email": "mohamed.ali@example.com",
    "has_land": true,
    "location_of_land": "Niamey, Quartier Kalley",
    "interested_in": 5,
    "message": "Je souhaite construire une villa similaire au projet Villa Moderne."
  }
}
```

---

#### General Contact Form

For general inquiries from the contact page.

```http
POST /api/contact/
```

**Request Body:**
```json
{
  "name": "Aisha Moussa",
  "email": "aisha@example.com",
  "phone": "+227 90 00 00 00",
  "subject": "Question sur vos services",
  "message": "Bonjour, je souhaite avoir plus d'informations sur vos tarifs de construction..."
}
```

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ Yes | Full name |
| `email` | string | ✅ Yes | Email address |
| `phone` | string | ❌ No | Phone number |
| `subject` | string | ✅ Yes | Subject of the inquiry |
| `message` | string | ✅ Yes | Message content |

**Response (201 Created):**
```json
{
  "message": "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
  "data": {
    "name": "Aisha Moussa",
    "email": "aisha@example.com",
    "phone": "+227 90 00 00 00",
    "subject": "Question sur vos services",
    "message": "Bonjour, je souhaite avoir plus d'informations sur vos tarifs de construction..."
  }
}
```

---

## Authentication

The API uses **JWT (JSON Web Tokens)** for authentication.

### Token Lifetime
- **Access Token:** 60 minutes
- **Refresh Token:** 7 days

### Authentication Header

For authenticated requests, include the access token:

```http
Authorization: Bearer {access_token}
```

---

### Register a New Account

```http
POST /api/auth/register/
```

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response (201 Created):**
```json
{
  "message": "Compte créé avec succès.",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

---

### Login

```http
POST /api/auth/login/
```

**Request Body (with username):**
```json
{
  "username": "john_doe",
  "password": "SecurePassword123!"
}
```

**OR with email:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Connexion réussie.",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

---

### Refresh Access Token

When the access token expires, use the refresh token to get a new one.

```http
POST /api/auth/token/refresh/
```

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

---

### Verify Token

Check if a token is valid.

```http
POST /api/auth/token/verify/
```

**Request Body:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response (200 OK):** Empty response if valid  
**Response (401 Unauthorized):** If token is invalid or expired

---

### Get Current User Profile

```http
GET /api/auth/me/
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

---

### Change Password

```http
POST /api/auth/change-password/
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "old_password": "OldPassword123!",
  "new_password": "NewSecurePassword456!",
  "confirm_password": "NewSecurePassword456!"
}
```

**Response (200 OK):**
```json
{
  "message": "Mot de passe modifié avec succès."
}
```

---

### Password Reset Request

Request a password reset email.

```http
POST /api/auth/password-reset/
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Un email de réinitialisation a été envoyé."
}
```

---

### Password Reset Confirm

Confirm password reset with the token from email.

```http
POST /api/auth/password-reset/confirm/
```

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "new_password": "NewSecurePassword789!",
  "confirm_password": "NewSecurePassword789!"
}
```

**Response (200 OK):**
```json
{
  "message": "Mot de passe réinitialisé avec succès."
}
```

---

### Logout

Invalidate the refresh token.

```http
POST /api/auth/logout/
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response (200 OK):**
```json
{
  "message": "Successfully logged out"
}
```

---

## Authenticated User Endpoints

These endpoints require authentication (Bearer token).

### Client Profile

Get the authenticated client's profile.

```http
GET /api/app/profile/
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+227 91 23 45 67",
  "address": "Niamey, Niger",
  "whatsapp_enabled": false,
  "fcm_token": ""
}
```

---

### Update Client Profile

```http
PATCH /api/app/profile/
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe Updated",
  "phone": "+227 92 00 00 00",
  "address": "New Address, Niamey"
}
```

**Response (200 OK):** Updated profile object

---

### My Projects

List all construction projects assigned to the authenticated client.

```http
GET /api/app/my-projects/
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "project_name": "Villa Christophe",
      "start_date": "2024-01-15",
      "estimated_completion": "2025-06-30",
      "progress_percentage": 65,
      "current_phase": "CREPISSAGE",
      "current_phase_display": "Crépissage",
      "total_quote": 50000000.00,
      "amount_paid": 32500000.00,
      "remaining_amount": 17500000.00,
      "payment_percentage": 65.00,
      "location": "Niamey - Plateau"
    }
  ]
}
```

---

### My Project Detail

Get detailed information about a specific project.

```http
GET /api/app/my-projects/{project_id}/
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "project_name": "Villa Christophe",
  "description": "Modern villa with pool",
  "location": "Niamey - Plateau",
  "start_date": "2024-01-15",
  "estimated_completion": "2025-06-30",
  "progress_percentage": 65,
  "current_phase": "CREPISSAGE",
  "current_phase_display": "Crépissage",
  "total_quote": 50000000.00,
  "amount_paid": 32500000.00,
  "remaining_amount": 17500000.00,
  "payment_percentage": 65.00,
  "updates": [
    {
      "id": 1,
      "title": "Crépissage terminé",
      "description": "Le crépissage extérieur est maintenant terminé.",
      "image": "https://api2.bellehouseniger.com/media/projects/updates/crepissage.jpg",
      "video_url": "",
      "posted_at": "2025-12-20T14:30:00Z"
    }
  ],
  "invoices": [
    {
      "id": 1,
      "invoice_number": "BH/2025/1",
      "subject": "Fondations",
      "status": "PAID",
      "status_display": "Payé",
      "total_ttc": 10000000.00
    }
  ],
  "created_at": "2024-01-10T08:30:00Z",
  "updated_at": "2025-12-20T15:45:00Z"
}
```

---

### My Project Updates (Timeline)

Get all construction updates for a project.

```http
GET /api/app/my-projects/{project_id}/updates/
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
[
  {
    "id": 3,
    "title": "Crépissage terminé",
    "description": "Le crépissage extérieur et intérieur est maintenant terminé.",
    "image": "https://api2.bellehouseniger.com/media/projects/updates/crepissage.jpg",
    "video_url": "",
    "posted_at": "2025-12-20T14:30:00Z"
  },
  {
    "id": 2,
    "title": "Dalle coulée",
    "description": "La dalle a été coulée avec succès.",
    "image": "https://api2.bellehouseniger.com/media/projects/updates/dalle.jpg",
    "video_url": "https://youtube.com/watch?v=example",
    "posted_at": "2025-10-15T10:00:00Z"
  }
]
```

---

### My Project Invoices

Get all invoices for a specific project.

```http
GET /api/app/my-projects/{project_id}/invoices/
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "invoice_number": "BH/2025/1",
    "invoice_type": "INVOICE",
    "invoice_type_display": "Facture",
    "subject": "Fondations et préparation",
    "status": "PAID",
    "status_display": "Payé",
    "issue_date": "2025-02-01",
    "due_date": "2025-02-28",
    "total_ttc": 12000000.00,
    "net_to_pay": 0.00,
    "payment_mode": "CASH",
    "payment_mode_display": "Espèces",
    "project": 1,
    "project_name": "Villa Christophe",
    "client_name": "John Christophe"
  }
]
```

---

### Invoice Detail

Get detailed invoice with line items.

```http
GET /api/app/invoices/{invoice_id}/
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "invoice_number": "BH/2025/1",
  "invoice_type": "INVOICE",
  "invoice_type_display": "Facture",
  "subject": "Fondations et préparation",
  "status": "PAID",
  "status_display": "Payé",
  "issue_date": "2025-02-01",
  "due_date": "2025-02-28",
  "tax_percentage": 0.00,
  "advance_payment": 0.00,
  "payment_mode": "TRANSFER",
  "payment_mode_display": "Virement",
  "client_name": "John Christophe",
  "client_address": "Niamey, Niger",
  "client_phone": "+227 91 23 45 67",
  "subtotal": 12000000.00,
  "tax_amount": 0.00,
  "total_ttc": 12000000.00,
  "net_to_pay": 0.00,
  "project": 1,
  "project_name": "Villa Christophe",
  "items": [
    {
      "id": 1,
      "description": "Fondations en béton armé",
      "quantity": 1,
      "unit_price": 8000000.00,
      "total_price": 8000000.00,
      "order": 1
    },
    {
      "id": 2,
      "description": "Préparation du terrain",
      "quantity": 1,
      "unit_price": 4000000.00,
      "total_price": 4000000.00,
      "order": 2
    }
  ],
  "notes": "Première facture du projet.",
  "created_at": "2025-02-01T10:00:00Z",
  "updated_at": "2025-02-28T14:30:00Z"
}
```

---

### App Promotions (Banners)

Get promotional banners for the app/website.

```http
GET /api/app/promotions/
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Nouvelle Villa Design 2026",
      "banner_image": "https://api2.bellehouseniger.com/media/promotions/banners/villa_2026.jpg",
      "linked_portfolio": 5,
      "linked_portfolio_slug": "villa-moderne-2026",
      "external_link": "",
      "order": 1
    },
    {
      "id": 2,
      "title": "Offre Spéciale",
      "banner_image": "https://api2.bellehouseniger.com/media/promotions/banners/special.jpg",
      "linked_portfolio": null,
      "linked_portfolio_slug": null,
      "external_link": "https://bellehouseniger.com/special-offer",
      "order": 2
    }
  ]
}
```

---

## Data Models & Enums

### Portfolio Category

```typescript
enum PortfolioCategory {
  PROJECT = "PROJECT",       // Design maquettes (not yet built)
  REALIZATION = "REALIZATION" // Completed realizations
}
```

### Project Phase

Construction phases with their progress percentages:

```typescript
enum ProjectPhase {
  CONCEPTION = "CONCEPTION",           // 5%  - Design & permits
  IMPLANTATION = "IMPLANTATION",       // 8%  - Site layout
  FONDATIONS = "FONDATIONS",           // 23% - Foundations
  ELEVATION_MURS = "ELEVATION_MURS",   // 41% - Wall elevation
  DALLE = "DALLE",                     // 57% - Slab & Acrotere
  CREPISSAGE = "CREPISSAGE",           // 65% - Plastering
  ELECTRICITE_PLOMBERIE = "ELECTRICITE_PLOMBERIE", // 81% - Electrical & Plumbing
  RESEAUX = "RESEAUX",                 // 87% - Networks & Security
  CARRELAGE_PLAFOND = "CARRELAGE_PLAFOND", // 94% - Tiling & Ceiling
  PEINTURE_MENUISERIE = "PEINTURE_MENUISERIE", // 99% - Painting & Carpentry
  EXTERIEUR = "EXTERIEUR"              // 100% - Exterior finishing
}
```

### Invoice Status

```typescript
enum InvoiceStatus {
  DRAFT = "DRAFT",       // Brouillon
  SENT = "SENT",         // Envoyé
  PAID = "PAID",         // Payé
  OVERDUE = "OVERDUE",   // En Retard
  CANCELLED = "CANCELLED" // Annulé
}
```

### Invoice Type

```typescript
enum InvoiceType {
  PROFORMA = "PROFORMA", // Facture Proforma
  QUOTE = "QUOTE",       // Devis
  INVOICE = "INVOICE"    // Facture
}
```

### Payment Mode

```typescript
enum PaymentMode {
  CASH = "CASH",         // Espèces
  TRANSFER = "TRANSFER", // Virement
  CHECK = "CHECK"        // Chèque
}
```

### Tax Type

```typescript
enum TaxType {
  NONE = "NONE",     // No tax (0%)
  ISB = "ISB",       // ISB (-2%)
  TVA = "TVA",       // TVA (+5%)
  CUSTOM = "CUSTOM"  // Custom rate
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "detail": "Error message",
  "field_name": ["Field-specific error message"]
}
```

### Common HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid data or missing required fields |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |

### Error Examples

**Validation Error (400):**
```json
{
  "email": ["Enter a valid email address."],
  "name": ["This field is required."]
}
```

**Authentication Error (401):**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

**Token Expired (401):**
```json
{
  "detail": "Given token not valid for any token type",
  "code": "token_not_valid",
  "messages": [
    {
      "token_class": "AccessToken",
      "token_type": "access",
      "message": "Token is invalid or expired"
    }
  ]
}
```

**Not Found (404):**
```json
{
  "detail": "Not found."
}
```

---

## Pagination & Filtering

### Pagination

All list endpoints use page-based pagination.

**Default page size:** 20 items

**Query Parameters:**
- `page` - Page number (starting from 1)

**Response format:**
```json
{
  "count": 45,
  "next": "https://api2.bellehouseniger.com/api/portfolio/?page=2",
  "previous": null,
  "results": [...]
}
```

### Filtering

Use query parameters to filter results.

**Common filters:**
- Boolean: `?is_featured=true`
- Exact match: `?category=REALIZATION`
- Search: `?search=villa`

### Ordering

Use the `ordering` parameter to sort results.

- Ascending: `?ordering=created_at`
- Descending: `?ordering=-created_at`
- Multiple fields: `?ordering=order,-created_at`

---

## Code Examples

### JavaScript/TypeScript (Fetch API)

```typescript
// api/client.ts
const API_BASE = 'https://api2.bellehouseniger.com/api';

interface ApiResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: T[];
  // For non-paginated responses
  [key: string]: any;
}

// Token storage (use secure storage in production)
let accessToken: string | null = null;
let refreshToken: string | null = null;

// Set tokens after login
export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);
}

// Clear tokens on logout
export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

// Load tokens from storage
export function loadTokens() {
  accessToken = localStorage.getItem('accessToken');
  refreshToken = localStorage.getItem('refreshToken');
}

// Refresh the access token
async function refreshAccessToken(): Promise<boolean> {
  if (!refreshToken) return false;
  
  try {
    const response = await fetch(`${API_BASE}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    if (response.ok) {
      const data = await response.json();
      accessToken = data.access;
      localStorage.setItem('accessToken', data.access);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Main API request function with automatic token refresh
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...options.headers,
  };

  let response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  // If 401 and we have a refresh token, try to refresh
  if (response.status === 401 && refreshToken) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry the request with new token
      response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }

  return response.json();
}

// ============ PUBLIC ENDPOINTS ============

// Get all portfolio items
export async function getPortfolio(params?: {
  category?: 'PROJECT' | 'REALIZATION';
  is_featured?: boolean;
  page?: number;
}) {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.is_featured !== undefined) query.set('is_featured', String(params.is_featured));
  if (params?.page) query.set('page', String(params.page));
  
  const queryString = query.toString();
  return apiRequest<ApiResponse<PortfolioItem>>(
    `/portfolio/${queryString ? `?${queryString}` : ''}`
  );
}

// Get single portfolio item
export async function getPortfolioItem(slug: string) {
  return apiRequest<PortfolioItemDetail>(`/portfolio/${slug}/`);
}

// Get services
export async function getServices() {
  return apiRequest<Service[]>('/services/');
}

// Get partners
export async function getPartners() {
  return apiRequest<Partner[]>('/partners/');
}

// Get testimonials
export async function getTestimonials(featured?: boolean) {
  const query = featured !== undefined ? `?is_featured=${featured}` : '';
  return apiRequest<Testimonial[]>(`/testimonials/${query}`);
}

// Get blog posts
export async function getBlogPosts(params?: { search?: string; page?: number }) {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.page) query.set('page', String(params.page));
  
  const queryString = query.toString();
  return apiRequest<ApiResponse<BlogPost>>(`/blog/${queryString ? `?${queryString}` : ''}`);
}

// Get single blog post
export async function getBlogPost(slug: string) {
  return apiRequest<BlogPostDetail>(`/blog/${slug}/`);
}

// Submit build-for-me form
export async function submitBuildForMe(data: {
  name: string;
  phone: string;
  email: string;
  has_land?: boolean;
  location_of_land?: string;
  interested_in?: number;
  message?: string;
}) {
  return apiRequest<{ message: string; data: any }>('/build-for-me/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Submit contact form
export async function submitContact(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  return apiRequest<{ message: string; data: any }>('/contact/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ============ AUTHENTICATION ============

// Login
export async function login(credentials: {
  username?: string;
  email?: string;
  password: string;
}) {
  const response = await apiRequest<{
    message: string;
    user: User;
    tokens: { access: string; refresh: string };
  }>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  
  setTokens(response.tokens.access, response.tokens.refresh);
  return response;
}

// Register
export async function register(data: {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}) {
  const response = await apiRequest<{
    message: string;
    user: User;
    tokens: { access: string; refresh: string };
  }>('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  setTokens(response.tokens.access, response.tokens.refresh);
  return response;
}

// Logout
export async function logout() {
  if (refreshToken) {
    await apiRequest('/auth/logout/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });
  }
  clearTokens();
}

// Get current user
export async function getCurrentUser() {
  return apiRequest<User>('/auth/me/');
}

// ============ TYPE DEFINITIONS ============

interface PortfolioItem {
  id: number;
  title: string;
  slug: string;
  category: 'PROJECT' | 'REALIZATION';
  category_display: string;
  main_image: string;
  area: string;
  city: string;
  year: number;
  is_featured: boolean;
  order: number;
}

interface PortfolioItemDetail extends PortfolioItem {
  description: string;
  task: string;
  owner: string;
  contractor: string;
  usage: string;
  district: string;
  country: string;
  gallery_images: { id: number; image: string; caption: string; order: number }[];
  videos: { id: number; title: string; video_url: string; order: number }[];
  created_at: string;
  updated_at: string;
}

interface Service {
  id: number;
  title: string;
  icon: string;
  short_description: string;
  order: number;
}

interface Partner {
  id: number;
  name: string;
  logo: string;
  website: string;
  order: number;
}

interface Testimonial {
  id: number;
  client_name: string;
  role: string;
  photo: string | null;
  content: string;
  rating: number;
  is_featured: boolean;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  excerpt: string;
  published_date: string;
  created_at: string;
}

interface BlogPostDetail extends BlogPost {
  content: string;
  is_published: boolean;
  updated_at: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}
```

### React Hook Example

```tsx
// hooks/usePortfolio.ts
import { useState, useEffect } from 'react';
import { getPortfolio, getPortfolioItem } from '../api/client';

export function usePortfolioList(category?: 'PROJECT' | 'REALIZATION', featured?: boolean) {
  const [data, setData] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getPortfolio({ category, is_featured: featured })
      .then((response) => {
        setData(response.results || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [category, featured]);

  return { data, loading, error };
}

export function usePortfolioDetail(slug: string) {
  const [data, setData] = useState<PortfolioItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    
    setLoading(true);
    getPortfolioItem(slug)
      .then((response) => {
        setData(response);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  return { data, loading, error };
}
```

### Usage in React Component

```tsx
// pages/Portfolio.tsx
import { usePortfolioList } from '../hooks/usePortfolio';

function PortfolioPage() {
  const [filter, setFilter] = useState<'PROJECT' | 'REALIZATION' | undefined>();
  const { data: items, loading, error } = usePortfolioList(filter);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <h1>Notre Portfolio</h1>
      
      {/* Filter buttons */}
      <div className="filters">
        <button onClick={() => setFilter(undefined)}>Tous</button>
        <button onClick={() => setFilter('PROJECT')}>Maquettes</button>
        <button onClick={() => setFilter('REALIZATION')}>Réalisations</button>
      </div>
      
      {/* Portfolio grid */}
      <div className="portfolio-grid">
        {items.map((item) => (
          <PortfolioCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
```

---

## Quick Reference

### Public Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/portfolio/` | List portfolio items |
| GET | `/api/portfolio/{slug}/` | Get portfolio detail |
| GET | `/api/services/` | List services |
| GET | `/api/partners/` | List partners |
| GET | `/api/testimonials/` | List testimonials |
| GET | `/api/blog/` | List blog posts |
| GET | `/api/blog/{slug}/` | Get blog post detail |
| POST | `/api/build-for-me/` | Submit construction lead |
| POST | `/api/contact/` | Submit contact form |

### Authentication Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new account |
| POST | `/api/auth/login/` | Login |
| POST | `/api/auth/logout/` | Logout |
| GET | `/api/auth/me/` | Get current user |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| POST | `/api/auth/token/verify/` | Verify token |
| POST | `/api/auth/change-password/` | Change password |
| POST | `/api/auth/password-reset/` | Request password reset |
| POST | `/api/auth/password-reset/confirm/` | Confirm password reset |

### Authenticated User Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/app/profile/` | Get client profile |
| PATCH | `/api/app/profile/` | Update client profile |
| GET | `/api/app/my-projects/` | List client's projects |
| GET | `/api/app/my-projects/{id}/` | Get project detail |
| GET | `/api/app/my-projects/{id}/updates/` | Get project updates |
| GET | `/api/app/my-projects/{id}/invoices/` | Get project invoices |
| GET | `/api/app/invoices/{id}/` | Get invoice detail |
| GET | `/api/app/promotions/` | Get promotions/banners |

---

## Support

- **Interactive API Docs:** https://api2.bellehouseniger.com/api/docs/
- **ReDoc:** https://api2.bellehouseniger.com/api/redoc/
- **Admin Panel:** https://api2.bellehouseniger.com/admin/

For any questions or issues, contact the backend development team.
