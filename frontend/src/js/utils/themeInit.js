/**
 * Theme Initialization Script
 * This script runs before the page loads to apply the saved theme
 * and prevent flashing of unstyled content
 */
(function () {
  // Get theme from localStorage or default to system
  const savedTheme = localStorage.getItem('theme') || 'system';
  const systemDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;

  // Remove existing theme classes
  document.documentElement.classList.remove('light', 'dark', 'special');

  // Apply theme
  if (savedTheme === 'system') {
    document.documentElement.classList.add(systemDarkMode ? 'dark' : 'light');
  } else {
    document.documentElement.classList.add(savedTheme);
  }

  // Handle special theme colors
  if (savedTheme === 'special') {
    const themeColor = localStorage.getItem('themeColor') || 'blue';
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

    const baseColor = colorValues[themeColor] || colorValues.blue;

    // Set special theme CSS variables
    document.documentElement.style.setProperty('--special-color', baseColor);
    document.documentElement.style.setProperty(
      '--special-background',
      '#ffffff'
    );
    document.documentElement.style.setProperty('--special-text', '#1a1a1a');
    document.documentElement.style.setProperty('--special-card', '#ffffff');
    document.documentElement.style.setProperty('--special-border', '#e5e7eb');
    document.documentElement.style.setProperty('--special-hover', '#f3f4f6');
    document.documentElement.style.setProperty(
      '--special-secondary',
      '#6b7280'
    );
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
    
    // Initialize background image container if it exists for a smoother experience
    const backgroundContainer = document.getElementById('theme-background-container');
    if (backgroundContainer) {
      backgroundContainer.style.display = 'block';
      backgroundContainer.style.opacity = '0';
      // We'll let the main script fully load the background image later
    }
  }

  /**
   * Helper function to adjust color brightness
   * This needs to be defined in the themeInit script to work independently
   */
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
})();
