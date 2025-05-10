import { Request, Response } from 'express';
import { UserService } from '../services';
import { SupportedLanguage } from '../types/i18n';
import { ThemeType } from '../utils/theme';

export class LanguageController {
  constructor(private userService: UserService) {}

  /**
   * Change the user's language preference
   */
  async changeLanguage(req: Request, res: Response): Promise<void> {
    const lang = req.params.lang as SupportedLanguage;
    const returnTo = (req.query.returnTo as string) || '/';

    if (!['en', 'es', 'pt', 'fr'].includes(lang)) {
      res.status(400).send('Invalid language code');
      return;
    }

    // If user is logged in, update their preferences in the database
    if (req.session && req.session.user) {
      // Update session first for immediate effect
      req.session.user.settings = {
        ...req.session.user.settings,
        language: lang,
        theme: req.session.user.settings.theme || {
          type: 'system' as ThemeType,
        },
      };

      // Then update the database (but don't wait for it to complete)
      try {
        // Only try to update if we have a userId
        if (req.session.user.userId) {
          const updatePromise = this.userService.update(
            req.session.user.userId,
            {
              settings: {
                language: lang,
                theme: req.session.user.settings.theme || {
                  type: 'system' as ThemeType,
                },
              },
            }
          );

          // Handle the promise without blocking
          updatePromise.catch((error) => {
            console.error('Error updating user language preference:', error);
          });
        }
      } catch (error) {
        console.error('Error updating user language preference:', error);
      }
    }

    // Set cookie for non-logged-in users
    res.cookie('i18next', lang);

    // Redirect back to the original page
    res.redirect(returnTo);
  }
}
