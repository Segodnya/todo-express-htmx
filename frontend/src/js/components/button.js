/**
 * Button Component
 * Handles loading state and HTMX interactions
 */
export function initButtons() {
  // Find all buttons with loading indicators
  const loadingButtons = document.querySelectorAll('button[data-loading="true"]');
  
  loadingButtons.forEach(button => {
    // Find the indicator and content within the button
    const indicator = button.querySelector('.htmx-indicator');
    const content = button.querySelector('.htmx-request-element');
    
    if (!indicator || !content) return;
    
    // Add HTMX event listeners for request start/end
    button.addEventListener('htmx:beforeRequest', () => {
      indicator.classList.remove('hidden');
      content.classList.add('hidden');
    });
    
    button.addEventListener('htmx:afterRequest', () => {
      indicator.classList.add('hidden');
      content.classList.remove('hidden');
    });
  });
} 