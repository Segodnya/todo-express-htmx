module.exports = {
  content: [
    './views/**/*.ejs',
    './src/js/**/*.js', // Include JavaScript files for class extraction
  ],
  theme: {
    extend: {
      colors: {
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
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function ({ addComponents }) {
      addComponents({
        '.card': {
          '@apply bg-white shadow sm:rounded-lg': {},
        },
        '.cardSection': {
          '@apply px-4 py-5 sm:px-6': {},
        },
        '.formInput': {
          '@apply appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm':
            {},
        },
        '.formLabel': {
          '@apply block text-sm font-medium text-gray-700': {},
        },
        '.btn': {
          '@apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2':
            {},
        },
        '.btnPrimary': {
          '@apply text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500':
            {},
        },
        '.bttnDanger': {
          '@apply text-red-700 bg-red-100 hover:bg-red-200 focus:ring-red-500':
            {},
        },
        '.listContainer': {
          '@apply divide-y divide-gray-200': {},
        },
        '.listItem': {
          '@apply px-4 py-4 flex items-center justify-between space-x-3 hover:bg-gray-50':
            {},
        },
        // Menu styles for language switcher
        '.menu': {
          '@apply origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none':
            {},
        },
        '.menu-item': {
          '@apply block w-full px-4 py-2 text-sm': {},
        },
        '.menu-item-active': {
          '@apply bg-gray-100 text-gray-900': {},
        },
        '.menu-item-inactive': {
          '@apply text-gray-700 hover:bg-gray-50': {},
        },
      });
    },
  ],
};
