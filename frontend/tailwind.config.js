module.exports = {
  content: ['./views/**/*.ejs'],
  theme: {
    extend: {},
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
      });
    },
  ],
};
