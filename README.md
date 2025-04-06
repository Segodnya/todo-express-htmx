# todo-express-htmx

Simple Full-Stack To-do App w/ Express, Mongo, HTMX

## Backlog

- [ ] Add toast notifications for actions
- [ ] Implement optimistic UI updates
- [ ] Add keyboard shortcuts
- [ ] Include loading spinners
- [ ] Implement error boundaries
- [ ] Add filter/sort functionality
- [ ] Bug: When you toggle a todo, server renders the new one inside the existing container
- [+] Feature: Add i18n support, translation keys, translations for ES, PT, FR; language switcher
- [ ] Feature: Add todos' statuses (backlog, in progress, review, test, deploy, done) instead of checkboxes
- [ ] Feature: Add separate page for each todo with additional info
- [ ] Feature: Add label of ownership to the todo. It should open the dropdown and you can pick another user to be responsible for the todo
- [ ] Feature: Add theme switcher (dark, light, system, special)
- [ ] Feature: Dockerize the app - it should be started from the compose with one command
- [ ] Feature: Add MongoDB as a store for the app data
- [ ] Feature: Add logger with Winston
- [ ] Bug: Duplicated style builds with Vite and Tailwind

## Theme Switching - Plan

0. Preparations: extract all the hardcode colors from views, backend HTMX-markup and styles into theme variables in the tailwind config
   - Create a list of themes based on the variables: light, dark, special (light one with acceent colors - red, orange, green, blue, purple, pink, grey, black)
1. Add 'theme' property to user's settings object (type: system, light, dark, special; special should have an extra 'color' property to store the chosen accent random color).
2. We will store theme in a browser localStorage and in the server's user object
3. Update backend infrastructure to work with changing theme property:
   - Create a ThemeController similar to the LanguageController. Maybe we should create a common SettingsController that will take a case (lang, theme)
   - Create repository, service for the Settings logic (if needed).
   - Add a route for theme switching (/change-theme/:theme)
   - Implement middleware to apply theme settings on request
4. Update test infrastructure to be able to check the new functionality:
   - Extend user entity tests to verify theme properties
   - Add tests for theme switching functionality for both authenticated and guest users
5. Create a tailwind palette. 'Special' one should be created as a combination of different brightness for a random color. Color should be saved as a 'color' property for the 'theme' setting and it should be changed once we click the 'special' again only.
6. Add UI for theme switcher (use a language switcher as a reference):
   - Create a new partial template in views/partials/theme-switcher.ejs
   - Style it consistently with the language switcher
   - Position it in the navigation bar near the language switcher
7. Add svg icons from some pack to illustrate the switching options (instead of a text labels)
8. Implement client-side theme application logic:
   - Add a script in the document head to apply theme before page renders
   - Create a themeSwitcher.js component in frontend/src/js/components
   - Handle theme detection and application based on user settings
9. Add smooth transitions between themes to improve user experience
10. Implement server-side rendering support to ensure correct initial theme is applied
11. Create a specialized color generator for the 'special' theme:
    - Ensure generated colors maintain proper contrast ratios for accessibility
    - Create helper functions to derive complementary colors for UI elements
    - Apply color theory principles to generate a cohesive palette
12. There should be a background image for the app if a special theme is selected based oon the color:
   - Images are stored on the server
   - There is a spinner until the background image is loaded
   - Background is blurred with css mask (tailwind)
