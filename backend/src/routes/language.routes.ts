import express from 'express';
import { LanguageController } from '../controllers/language.controller';

/**
 * Creates an Express router for language-related routes
 */
export const createLanguageRouter = (
  languageController: LanguageController
): express.Router => {
  const router = express.Router();

  // Route for changing language
  router.get('/:lang', languageController.changeLanguage.bind(languageController));

  return router;
}; 