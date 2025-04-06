/**
 * Form Input Component
 * Handles validation and error messages
 */
export function initFormInputs() {
  // Find all form inputs
  const formInputs = document.querySelectorAll('.formInput');

  formInputs.forEach((input) => {
    // Basic validation on blur
    input.addEventListener('blur', () => {
      validateInput(input);
    });

    // Clear validation on focus
    input.addEventListener('focus', () => {
      clearValidation(input);
    });
  });

  // Listen for form submissions to validate all inputs
  const forms = document.querySelectorAll('form');
  forms.forEach((form) => {
    form.addEventListener('htmx:validation:validate', (event) => {
      const inputs = form.querySelectorAll('.formInput');
      let isValid = true;

      inputs.forEach((input) => {
        if (!validateInput(input)) {
          isValid = false;
        }
      });

      if (!isValid) {
        event.preventDefault();
      }
    });
  });
}

// Helper function to validate an input
function validateInput(input) {
  if (input.hasAttribute('required') && !input.value.trim()) {
    showError(input, 'This field is required');
    return false;
  }

  if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
    showError(input, 'Please enter a valid email address');
    return false;
  }

  return true;
}

// Helper function to show error message
function showError(input, message) {
  clearValidation(input);
  input.classList.add(
    'border-red-500',
    'focus:ring-red-500',
    'focus:border-red-500'
  );

  const errorElement = document.createElement('p');
  errorElement.className = 'mt-1 text-sm text-red-600';
  errorElement.textContent = message;

  input.parentNode.appendChild(errorElement);
}

// Helper function to clear validation
function clearValidation(input) {
  input.classList.remove(
    'border-red-500',
    'focus:ring-red-500',
    'focus:border-red-500'
  );

  const errorElement = input.parentNode.querySelector('.text-red-600');
  if (errorElement) {
    errorElement.remove();
  }
}

// Helper function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
