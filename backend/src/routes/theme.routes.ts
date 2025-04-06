import express from 'express';
import { ThemeController } from '../controllers/theme.controller';

/**
 * Creates an Express router for theme-related routes
 */
export const createThemeRouter = (
  themeController: ThemeController
): express.Router => {
  const router = express.Router();

  // Route for changing theme - support both GET and POST
  router.get('/:theme', themeController.changeTheme.bind(themeController));
  router.post('/:theme', themeController.changeTheme.bind(themeController));

  return router;
};
