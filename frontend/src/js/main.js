/**
 * Main JavaScript Entry Point
 * Initializes all components
 */
import { initLanguageSwitcher } from './components/languageSwitcher';
import { initButtons } from './components/button';
import { initFormInputs } from './components/formInput';

// DOM Ready Event
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initLanguageSwitcher();
  initButtons();
  initFormInputs();

  // Additional component initializations will go here
});
