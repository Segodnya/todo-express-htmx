module.exports = {
  content: [
    './views/**/*.ejs',
    './src/js/**/*.js', // Include JavaScript files for class extraction
  ],
  safelist: ['light', 'dark', 'special'],
  darkMode: ['class', '.dark'],
  theme: {
    extend: {
      colors: {
        // Light theme colors
        light: {
          background: '#ffffff',
          text: '#1a1a1a',
          primary: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
            950: '#082f49',
          },
          secondary: '#6b7280',
          accent: '#3b82f6',
          border: '#e5e7eb',
          card: '#ffffff',
          hover: '#f3f4f6',
          danger: {
            light: '#fee2e2',
            DEFAULT: '#ef4444',
            dark: '#b91c1c',
          },
        },
        // Dark theme colors
        dark: {
          background: '#1a1a1a',
          text: '#ffffff',
          primary: {
            50: '#082f49',
            100: '#0c4a6e',
            200: '#075985',
            300: '#0369a1',
            400: '#0284c7',
            500: '#0ea5e9',
            600: '#38bdf8',
            700: '#7dd3fc',
            800: '#bae6fd',
            900: '#e0f2fe',
            950: '#f0f9ff',
          },
          secondary: '#9ca3af',
          accent: '#60a5fa',
          border: '#374151',
          card: '#262626',
          hover: '#404040',
          danger: {
            light: '#7f1d1d',
            DEFAULT: '#dc2626',
            dark: '#fee2e2',
          },
        },
        // Special theme base colors (will be dynamically modified)
        special: {
          red: '#ef4444',
          orange: '#f97316',
          green: '#22c55e',
          blue: '#3b82f6',
          purple: '#a855f7',
          pink: '#ec4899',
          grey: '#6b7280',
          black: '#171717',
          // CSS variable based colors for the special theme
          background: 'var(--special-background, #ffffff)',
          text: 'var(--special-text, #1a1a1a)',
          primary: {
            50: 'var(--special-primary-50, #f0f9ff)',
            100: 'var(--special-primary-100, #e0f2fe)',
            200: 'var(--special-primary-200, #bae6fd)',
            300: 'var(--special-primary-300, #7dd3fc)',
            400: 'var(--special-primary-400, #38bdf8)',
            500: 'var(--special-primary-500, #0ea5e9)',
            600: 'var(--special-primary-600, #0284c7)',
            700: 'var(--special-primary-700, #0369a1)',
            800: 'var(--special-primary-800, #075985)',
            900: 'var(--special-primary-900, #0c4a6e)',
            950: 'var(--special-primary-950, #082f49)',
          },
          secondary: 'var(--special-secondary, #6b7280)',
          accent: 'var(--special-accent, #3b82f6)',
          border: 'var(--special-border, #e5e7eb)',
          card: 'var(--special-card, #ffffff)',
          hover: 'var(--special-hover, #f3f4f6)',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function ({ addVariant, addComponents }) {
      // Add the special variant
      addVariant('special', '.special &');

      addComponents({
        '.card': {
          '@apply bg-light-card dark:bg-dark-card shadow sm:rounded-lg': {},
        },
        '.cardSection': {
          '@apply px-4 py-5 sm:px-6': {},
        },
        '.formInput': {
          '@apply appearance-none block w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-md shadow-sm placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:ring-light-accent dark:focus:ring-dark-accent focus:border-light-accent dark:focus:border-dark-accent sm:text-sm bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text':
            {},
        },
        '.formLabel': {
          '@apply block text-sm font-medium text-light-text dark:text-dark-text':
            {},
        },
        '.btn': {
          '@apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2':
            {},
        },
        '.btnPrimary': {
          '@apply text-white bg-light-primary-600 dark:bg-dark-primary-600 hover:bg-light-primary-700 dark:hover:bg-dark-primary-700 focus:ring-light-primary-500 dark:focus:ring-dark-primary-500':
            {},
        },
        '.bttnDanger': {
          '@apply text-light-danger-dark dark:text-dark-danger-dark bg-light-danger-light dark:bg-dark-danger-light hover:bg-light-danger dark:hover:bg-dark-danger focus:ring-light-danger dark:focus:ring-dark-danger':
            {},
        },
        '.listContainer': {
          '@apply divide-y divide-light-border dark:divide-dark-border': {},
        },
        '.listItem': {
          '@apply px-4 py-4 flex items-center justify-between space-x-3 hover:bg-light-hover dark:hover:bg-dark-hover':
            {},
        },
        '.menu': {
          '@apply origin-top-right rounded-md shadow-lg bg-light-card dark:bg-dark-card ring-1 ring-light-border dark:ring-dark-border ring-opacity-5 divide-y divide-light-border dark:divide-dark-border focus:outline-none':
            {},
        },
        '.menu-item': {
          '@apply block w-full px-4 py-2 text-sm': {},
        },
        '.menu-item-active': {
          '@apply text-light-text dark:text-dark-text':
            {},
        },
        '.menu-item-inactive': {
          '@apply text-light-secondary dark:text-dark-secondary hover:bg-light-hover dark:hover:bg-dark-hover':
            {},
        },
      });
    },
  ],
};
