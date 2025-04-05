# todo-express-htmx

Simple Full-Stack To-do App w/ Express, Mongo, HTMX

## Implementation Plan

### 1. Project Setup
- [v] Set up the basic HTML structure with HTMX CDN
- [v] Create a layout template with common styles and scripts
- [v] Set up static file serving in Express
- [v] Implement basic CSS styling (can use TailwindCSS for quick styling)

### 2. Authentication Pages
- [ ] Create signup page with HTMX form
  - Email and password fields
  - Client-side validation
  - HTMX POST request to /auth/signup
  - Show success/error messages inline
- [ ] Create signin page with HTMX form
  - Email and password fields
  - HTMX POST request to /auth/signin
  - Handle authentication errors inline
- [ ] Implement session management
  - Set up session middleware
  - Create protected routes
  - Add logout functionality

### 3. Todo List Implementation
- [ ] Create main todos page layout
  - Header with user info and logout button
  - Todo list container
  - New todo form
- [ ] Implement todo list display
  - HTMX GET request to load todos
  - Display each todo with completion status
  - Add loading states
- [ ] Add new todo functionality
  - Form with HTMX POST request
  - Inline form validation
  - Optimistic UI updates
- [ ] Todo item interactions
  - Toggle completion with HTMX PUT request
  - Edit todo with inline form
  - Delete todo with confirmation
  - Real-time updates using HTMX swap

### 4. Features Breakdown

#### Todo Item Component
```html
<div class="todo-item" hx-target="this" hx-swap="outerHTML">
  <input type="checkbox" hx-put="/api/todos/{id}/toggle">
  <span class="todo-text" hx-get="/api/todos/{id}/edit" hx-trigger="dblclick">
    {todo text}
  </span>
  <button hx-delete="/api/todos/{id}" 
          hx-confirm="Are you sure?">Delete</button>
</div>
```

#### Add Todo Form
```html
<form hx-post="/api/todos" 
      hx-swap="beforeend" 
      hx-target="#todo-list">
  <input type="text" name="text" required>
  <button type="submit">Add Todo</button>
</form>
```

### 5. Implementation Order
1. Basic HTML setup with HTMX
2. Authentication forms
3. Todo list display
4. Add todo functionality
5. Edit/Delete operations
6. Toggle completion
7. Polish UI/UX
8. Add loading states and error handling

### 6. Additional Enhancements
- [ ] Add toast notifications for actions
- [ ] Implement optimistic UI updates
- [ ] Add keyboard shortcuts
- [ ] Include loading spinners
- [ ] Implement error boundaries
- [ ] Add filter/sort functionality

### Tech Stack
- Backend: Express.js, MongoDB
- Frontend: HTMX, HTML, CSS (TailwindCSS)
- Authentication: Session-based
- Additional libraries: 
  - `htmx.org` for AJAX requests
  - `hyperscript` for enhanced interactivity (optional)
  - `@tailwindcss/forms` for form styling
