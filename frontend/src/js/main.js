/**
 * Main JavaScript Entry Point
 * Initializes all components
 */
import { initLanguageSwitcher } from './components/languageSwitcher';
import { initButtons } from './components/button';
import { initFormInputs } from './components/formInput';
import { initThemeSwitcher } from './components/themeSwitcher';
import './utils/themeInit';
import './utils/customScripts';

// DOM Ready Event
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initLanguageSwitcher();
  initButtons();
  initFormInputs();
  initThemeSwitcher();

  // Additional component initializations will go here
});
