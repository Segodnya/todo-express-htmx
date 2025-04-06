/**
 * Theme Switcher Component
 * Handles the dropdown behavior of the theme switcher and theme changes
 */
export function initThemeSwitcher() {
  const button = document.getElementById('theme-menu-button');
  const menu = document.getElementById('theme-menu');

  if (!button || !menu) return;

  // Apply saved theme on initialization
  const savedTheme = localStorage.getItem('theme') || 'system';
  applyTheme(savedTheme);

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

  // Handle theme links
  const themeLinks = menu.querySelectorAll('a[href^="/change-theme/"]');
  themeLinks.forEach((link) => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const href = this.getAttribute('href');
      const theme = href.split('/').pop().split('?')[0];

      // Save the theme in localStorage
      localStorage.setItem('theme', theme);

      // If it's special theme, generate a random color
      if (theme === 'special') {
        // Check if we already have the special theme active
        const currentTheme = localStorage.getItem('theme');
        const currentColor = localStorage.getItem('themeColor');

        // Always generate a new random color for special theme
        let randomColor = generateRandomColor();

        // Make sure we get a different color than the current one if possible
        if (currentTheme === 'special' && currentColor) {
          const validColors = [
            'red',
            'orange',
            'green',
            'blue',
            'purple',
            'pink',
            'grey',
            'black',
          ];
          if (validColors.length > 1) {
            // Try to get a different color
            const otherColors = validColors.filter((c) => c !== currentColor);
            randomColor =
              otherColors[Math.floor(Math.random() * otherColors.length)];
          }
        }

        localStorage.setItem('themeColor', randomColor);

        // Update the href to include the random color
        const updatedHref = `/change-theme/special?color=${randomColor}`;

        // Apply the theme with the random color immediately
        applyTheme(theme);
        applySpecialTheme(randomColor);

        // Send the request to the server to save the preference with the color
        fetch(updatedHref, {
          method: 'GET',
          headers: {
            Accept: '*/*',
          },
        }).catch((error) => {
          console.error('Error saving theme preference:', error);
        });
      } else {
        // For non-special themes, just apply normally
        applyTheme(theme);

        // Then send the request to the server to save the preference
        fetch(href, {
          method: 'GET',
          headers: {
            Accept: '*/*',
          },
        }).catch((error) => {
          console.error('Error saving theme preference:', error);
        });
      }

      // Close the menu
      button.setAttribute('aria-expanded', 'false');
      menu.classList.add('hidden');
    });
  });
}

// Helper function to apply theme
function applyTheme(theme) {
  const systemDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;

  // Remove all theme classes first
  document.documentElement.classList.remove('light', 'dark', 'special');

  // Hide background container for non-special themes
  const backgroundContainer = document.getElementById(
    'theme-background-container'
  );
  if (backgroundContainer && theme !== 'special') {
    backgroundContainer.style.display = 'none';
    backgroundContainer.style.opacity = '0';
  }

  if (theme === 'system') {
    // Apply system preference
    document.documentElement.classList.add(systemDarkMode ? 'dark' : 'light');
  } else if (theme === 'special') {
    // Apply special theme with saved color
    const savedColor =
      localStorage.getItem('themeColor') || generateRandomColor();
    document.documentElement.classList.add('special');
    applySpecialTheme(savedColor);
  } else {
    // Apply light or dark theme
    document.documentElement.classList.add(theme);
  }
}

// Helper function to generate a random color
function generateRandomColor() {
  // Get one of the predefined special colors
  const specialColors = [
    'red',
    'orange',
    'green',
    'blue',
    'purple',
    'pink',
    'grey',
    'black',
  ];
  return specialColors[Math.floor(Math.random() * specialColors.length)];
}

// Apply special theme with the given color
function applySpecialTheme(color) {
  localStorage.setItem('themeColor', color);

  // Define color values for each named color
  const colorValues = {
    red: '#ef4444',
    orange: '#f97316',
    green: '#22c55e',
    blue: '#3b82f6',
    purple: '#a855f7',
    pink: '#ec4899',
    grey: '#6b7280',
    black: '#111827',
  };

  const baseColor = colorValues[color] || colorValues.blue;

  // Set special theme CSS variables
  document.documentElement.style.setProperty('--special-color', baseColor);
  document.documentElement.style.setProperty('--special-background', '#ffffff');
  document.documentElement.style.setProperty('--special-text', '#1a1a1a');
  document.documentElement.style.setProperty('--special-card', '#ffffff');
  document.documentElement.style.setProperty('--special-border', '#e5e7eb');
  document.documentElement.style.setProperty('--special-hover', '#f3f4f6');
  document.documentElement.style.setProperty('--special-secondary', '#6b7280');
  document.documentElement.style.setProperty('--special-accent', baseColor);

  // Set primary color variants
  document.documentElement.style.setProperty(
    '--special-primary-500',
    baseColor
  );

  // Darker variants
  document.documentElement.style.setProperty(
    '--special-primary-600',
    adjustColorBrightness(baseColor, -10)
  );
  document.documentElement.style.setProperty(
    '--special-primary-700',
    adjustColorBrightness(baseColor, -20)
  );
  document.documentElement.style.setProperty(
    '--special-primary-800',
    adjustColorBrightness(baseColor, -30)
  );
  document.documentElement.style.setProperty(
    '--special-primary-900',
    adjustColorBrightness(baseColor, -40)
  );
  document.documentElement.style.setProperty(
    '--special-primary-950',
    adjustColorBrightness(baseColor, -50)
  );

  // Lighter variants
  document.documentElement.style.setProperty(
    '--special-primary-400',
    adjustColorBrightness(baseColor, 10)
  );
  document.documentElement.style.setProperty(
    '--special-primary-300',
    adjustColorBrightness(baseColor, 20)
  );
  document.documentElement.style.setProperty(
    '--special-primary-200',
    adjustColorBrightness(baseColor, 30)
  );
  document.documentElement.style.setProperty(
    '--special-primary-100',
    adjustColorBrightness(baseColor, 40)
  );
  document.documentElement.style.setProperty(
    '--special-primary-50',
    adjustColorBrightness(baseColor, 50)
  );

  // Load background image for the special theme
  loadBackgroundImage(color);
}

// Load the background image for the special theme
function loadBackgroundImage(color) {
  // Get the background container
  const backgroundContainer = document.getElementById(
    'theme-background-container'
  );
  const loadingSpinner = document.getElementById('background-loading-spinner');

  if (!backgroundContainer || !loadingSpinner) return;

  // Show the container but keep it transparent during loading
  backgroundContainer.style.display = 'block';
  backgroundContainer.style.opacity = '0';
  loadingSpinner.style.display = 'flex';

  // Create a new image element to preload the image
  const img = new Image();

  // Set up the onload handler
  img.onload = function () {
    // Hide the spinner once the image is loaded
    loadingSpinner.style.display = 'none';

    // Set the background image and fade it in
    backgroundContainer.style.backgroundImage = `url('/assets/images/wallpapers/${color}.webp')`;
    backgroundContainer.style.opacity = '1';
  };

  // Set up the onerror handler
  img.onerror = function () {
    console.error(`Failed to load background image for color: ${color}`);
    // Hide the spinner and container if the image fails to load
    loadingSpinner.style.display = 'none';
    backgroundContainer.style.display = 'none';
  };

  // Start loading the image
  img.src = `/assets/images/wallpapers/${color}.webp`;
}

// Helper function to adjust color brightness
function adjustColorBrightness(hex, percent) {
  // Convert hex to RGB
  hex = hex.replace(/^#/, '');
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Adjust brightness
  r = Math.max(0, Math.min(255, r + Math.floor((256 * percent) / 100)));
  g = Math.max(0, Math.min(255, g + Math.floor((256 * percent) / 100)));
  b = Math.max(0, Math.min(255, b + Math.floor((256 * percent) / 100)));

  // Convert back to hex
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
