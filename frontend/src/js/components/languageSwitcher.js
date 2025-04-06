/**
 * Language Switcher Component
 * Handles the dropdown behavior of the language switcher
 */
export function initLanguageSwitcher() {
  const button = document.getElementById('language-menu-button');
  const menu = document.getElementById('language-menu');

  if (!button || !menu) return;

  // Toggle menu
  button.addEventListener('click', function (event) {
    event.stopPropagation();
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !expanded);
    menu.classList.toggle('hidden');
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (event) {
    if (!button.contains(event.target) && !menu.contains(event.target)) {
      button.setAttribute('aria-expanded', 'false');
      menu.classList.add('hidden');
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      button.setAttribute('aria-expanded', 'false');
      menu.classList.add('hidden');
    }
  });

  // Prevent menu from closing when clicking inside it
  menu.addEventListener('click', function (event) {
    event.stopPropagation();
  });
}
