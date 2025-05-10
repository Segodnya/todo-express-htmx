/**
 * Custom Scripts
 * General purpose event listeners and utility functions
 */

// Add any custom scripts here
document.body.addEventListener('htmx:configRequest', function (evt) {
  // Add CSRF token if needed
});

document.body.addEventListener('htmx:responseError', function (evt) {
  console.error('HTMX Error:', evt.detail.error);
});
