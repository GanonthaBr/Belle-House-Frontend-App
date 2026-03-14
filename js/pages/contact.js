/**
 * Contact Page Integration Script
 * Handles contact form submission
 */

document.addEventListener('DOMContentLoaded', initContactPage);

async function initContactPage() {
  setupContactForm();
}

// ============ CONTACT FORM ============

function setupContactForm() {
  const formContainer = document.querySelector('[data-component="contact-form"]');
  if (!formContainer) return;
  
  formContainer.innerHTML = createContactForm();
  
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', handleContactSubmit);
  }
}

async function handleContactSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const messageDiv = form.querySelector('#form-message');
  const submitBtn = form.querySelector('button[type="submit"]');
  
  try {
    // Disable submit button
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Envoi en cours...';
    
    // Clear previous messages
    messageDiv.innerHTML = '';
    
    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate data
    if (!data.name || !data.email || !data.subject || !data.message) {
      throw new Error('Veuillez remplir tous les champs obligatoires');
    }
    
    // Submit form
    const response = await submitContact(data);
    
    // Show success message
    messageDiv.innerHTML = `
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>Succès!</strong> ${response.message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
    
    // Reset form
    form.reset();
    
    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    
    messageDiv.innerHTML = createErrorMessage(error.message);
    
    // Scroll to error
    messageDiv.scrollIntoView({ behavior: 'smooth' });
  } finally {
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

/**
 * Pre-fill contact form with data
 * @param {Object} data - Form data to pre-fill
 */
function prefillContactForm(data) {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  if (data.name) form.querySelector('[name="name"]').value = data.name;
  if (data.email) form.querySelector('[name="email"]').value = data.email;
  if (data.phone) form.querySelector('[name="phone"]').value = data.phone;
  if (data.subject) form.querySelector('[name="subject"]').value = data.subject;
  if (data.message) form.querySelector('[name="message"]').value = data.message;
}
