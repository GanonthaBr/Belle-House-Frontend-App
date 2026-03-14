/**
 * Belle House Website - Contact API
 * Handles all contact form submissions
 */

/**
 * Submit general contact form
 * @param {Object} data - Form data
 * @param {string} data.name - Full name (required)
 * @param {string} data.email - Email address (required)
 * @param {string} data.phone - Phone number (optional)
 * @param {string} data.subject - Subject (required)
 * @param {string} data.message - Message content (required)
 * @returns {Promise<Object>} - Response with success message
 */
async function submitContact(data) {
  // Validate required fields
  const requiredFields = ['name', 'email', 'subject', 'message'];
  const errors = {};

  requiredFields.forEach(field => {
    if (!data[field] || data[field].trim() === '') {
      errors[field] = ['This field is required.'];
    }
  });

  // Validate email format
  if (data.email && !isValidEmail(data.email)) {
    errors.email = ['Enter a valid email address.'];
  }

  if (Object.keys(errors).length > 0) {
    throw new ApiError('Validation error', 400, errors);
  }

  const payload = {
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone ? data.phone.trim() : '',
    subject: data.subject.trim(),
    message: data.message.trim(),
  };

  return apiRequest('/contact/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Submit "Build For Me" construction lead form
 * @param {Object} data - Form data
 * @param {string} data.name - Full name (required)
 * @param {string} data.phone - Phone number (required)
 * @param {string} data.email - Email address (required)
 * @param {boolean} data.has_land - Whether they own land (optional)
 * @param {string} data.location_of_land - Location of their land (optional)
 * @param {number} data.interested_in - Portfolio item ID they're interested in (optional)
 * @param {string} data.message - Additional details (optional)
 * @returns {Promise<Object>} - Response with success message
 */
async function submitBuildForMe(data) {
  // Validate required fields
  const requiredFields = ['name', 'phone', 'email'];
  const errors = {};

  requiredFields.forEach(field => {
    if (!data[field] || data[field].trim() === '') {
      errors[field] = ['This field is required.'];
    }
  });

  // Validate email format
  if (data.email && !isValidEmail(data.email)) {
    errors.email = ['Enter a valid email address.'];
  }

  // Validate phone format (basic check)
  if (data.phone && !isValidPhone(data.phone)) {
    errors.phone = ['Enter a valid phone number.'];
  }

  if (Object.keys(errors).length > 0) {
    throw new ApiError('Validation error', 400, errors);
  }

  const payload = {
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: data.email.trim(),
    has_land: data.has_land || false,
    location_of_land: data.location_of_land ? data.location_of_land.trim() : '',
    interested_in: data.interested_in ? parseInt(data.interested_in) : null,
    message: data.message ? data.message.trim() : '',
  };

  return apiRequest('/build-for-me/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ============ VALIDATION HELPERS ============

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format (basic check)
 * Accepts +, spaces, and numbers
 * @param {string} phone - Phone to validate
 * @returns {boolean}
 */
function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7;
}

/**
 * Format phone number for display
 * @param {string} phone - Phone number
 * @returns {string} - Formatted phone
 */
function formatPhone(phone) {
  if (!phone) return '';
  // Remove all non-digits except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  return cleaned;
}

/**
 * Format form data for submission
 * @param {Object} data - Raw form data
 * @returns {Object} - Cleaned data
 */
function cleanFormData(data) {
  const cleaned = {};
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'string') {
      cleaned[key] = value.trim();
    } else if (value === null || value === undefined) {
      cleaned[key] = '';
    } else {
      cleaned[key] = value;
    }
  });
  return cleaned;
}

// ============ EXPORTS ============

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    submitContact,
    submitBuildForMe,
    isValidEmail,
    isValidPhone,
    formatPhone,
    cleanFormData,
  };
}
