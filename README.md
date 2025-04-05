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
- [ ] Feature: Add i18n support, translation keys, translations for ES, PT, FR; language switcher
- [ ] Feature: Add todos' statuses (backlog, in progress, review, test, deploy, done) instead of checkboxes
- [ ] Feature: Add separate page for each todo with additional info
- [ ] Feature: Add label of ownership to the todo. It should open the dropdown and you can pick another user to be responsible for the todo
- [ ] Feature: Add theme switcher (dark, light, system)
- [ ] Feature: Dockerize the app - it should be started from the compose with one command
- [ ] Feature: Add MongoDB as a store for the app data

## i18n Support - Implementation Plan

1. **Library Selection**: Use `i18next` with `i18next-http-middleware` and `i18next-fs-backend` for Express integration.
   - Benefits: Robust ecosystem, Express middleware support, popular in Node.js applications
   - Additional plugins: `i18next-browser-languagedetector` for detecting user language preferences

2. **Translation Structure**:
   - Store translations in JSON files organized by language (`/locales/{lng}/{namespace}.json`)
   - Create namespaces for different sections: `common.json`, `todos.json`, `auth.json`
   - Example structure:
     ```
     /locales
       /en
         common.json
         todos.json
         auth.json
       /es
         ...
       /pt
         ...
       /fr
         ...
     ```

3. **Backend Integration**:
   - Create i18n middleware to detect language from:
     - URL parameter (e.g., `?lng=es`)
     - User's data object
     - Browser accept-language header
   - Add language to response locals for use in templates
   - Implement language switching endpoint

4. **Frontend Integration**:
   - Modify EJS templates to use translation function
   - Create helper functions for template access
   - Use format: `<%= t('namespace:key', { variables }) %>`
   - Add language selector in UI header

5. **Implementation Steps**:
   - Set up i18n configuration and middleware
   - Extract all hardcoded strings into translation files
   - Update templates with translation keys
   - Add language switcher component
   - Create user preference persistence (in user's data object)

6. **Testing**:
   - Add unit tests for i18n configuration
   - Add tests to verify all templates have translation keys
   - Test language switching functionality
   - Ensure proper fallback to default language
