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
- [v] Feature: Add i18n support, translation keys, translations for ES, PT, FR; language switcher
- [ ] Feature: Add todos' statuses (backlog, in progress, review, test, deploy, done) instead of checkboxes
- [ ] Feature: Add separate page for each todo with additional info
- [ ] Feature: Add label of ownership to the todo. It should open the dropdown and you can pick another user to be responsible for the todo
- [v] Feature: Add theme switcher (dark, light, system, special)
- [ ] Feature: Dockerize the app - it should be started from the compose with one command
- [ ] Feature: Add MongoDB as a store for the app data
- [ ] Feature: Add logger with Winston
- [ ] Bug: Duplicated style builds with Vite and Tailwind

## Theme Switching - Refactoring Plan

1. Consolidate Settings Management
   - Create a unified `SettingsController` that handles both theme and language preferences
   - Implement a generic `SettingsService` to manage all user settings
   - Create a `SettingsRepository` for database interactions related to user settings
   - Use a strategy pattern to handle different types of settings (theme, language, etc.)

2. Improve View Templates Organization
   - Create a component-based architecture for EJS templates
   - Implement partials for common UI elements to reduce code duplication
   - Standardize naming conventions across all template files

3. Frontend JavaScript Improvements
   - Use JavaScript modules more effectively with proper imports/exports
   - Implement a simple state management solution for client-side data
   - Create utility functions for common operations (DOM manipulation, API calls)
   - Consolidate duplicate code in theme and language switchers into a generic "preference switcher"

4. CSS Optimization
   - Reorganize CSS structure with better use of Tailwind layers
   - Create a more systematic approach to theme variables
   - Reduce specificity in selectors where possible
   - Use CSS custom properties more effectively for themeable components
   - Implement a more consistent naming convention for custom classes

5. Backend Architecture Improvements
   - Implement proper dependency injection throughout the application
   - Create middleware factories for common operations
   - Standardize error handling across all controllers
   - Improve separation of concerns in route handlers
   - Update unit tests for controller and service logic

6. Performance Optimization
   - Implement caching for static assets
   - Optimize theme switching to reduce layout shifts
   - Reduce the number of DOM manipulations during theme/language changes
   - Implement lazy loading for non-critical resources
