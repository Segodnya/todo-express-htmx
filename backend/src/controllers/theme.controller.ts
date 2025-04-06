import { Request, Response } from 'express';
import { UserService } from '../services';

type ThemeType = 'system' | 'light' | 'dark' | 'special';
type ThemeColor =
  | 'red'
  | 'orange'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'grey'
  | 'black';

export class ThemeController {
  constructor(private userService: UserService) {}

  /**
   * Change the user's theme preference
   */
  async changeTheme(req: Request, res: Response): Promise<void> {
    const theme = req.params.theme as ThemeType;
    const color = req.query.color as ThemeColor | undefined;
    const returnTo = (req.query.returnTo as string) || '/';

    if (!['system', 'light', 'dark', 'special'].includes(theme)) {
      res.status(400).send('Invalid theme type');
      return;
    }

    // Generate a random color for special theme if none provided
    let themeColor = color;
    if (theme === 'special' && !themeColor) {
      const validColors = [
        'red',
        'orange',
        'green',
        'blue',
        'purple',
        'pink',
        'grey',
        'black',
      ];
      themeColor = validColors[
        Math.floor(Math.random() * validColors.length)
      ] as ThemeColor;
    }

    // Validate color if theme is 'special'
    if (theme === 'special' && themeColor) {
      const validColors = [
        'red',
        'orange',
        'green',
        'blue',
        'purple',
        'pink',
        'grey',
        'black',
      ];
      if (!validColors.includes(themeColor)) {
        res.status(400).send('Invalid theme color');
        return;
      }
    }

    // If user is logged in, update their preferences in the database
    if (req.session && req.session.user) {
      // Update session first for immediate effect
      req.session.user.settings = {
        ...req.session.user.settings,
        theme: {
          type: theme,
          ...(theme === 'special' && themeColor ? { color: themeColor } : {}),
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
                language: req.session.user.settings.language, // Preserve existing language setting
                theme: {
                  type: theme,
                  ...(theme === 'special' && themeColor
                    ? { color: themeColor }
                    : {}),
                },
              },
            }
          );

          // Handle the promise without blocking
          updatePromise.catch((error) => {
            console.error('Error updating user theme preference:', error);
          });
        }
      } catch (error) {
        console.error('Error updating user theme preference:', error);
      }
    }

    // Set cookie for non-logged-in users (and as backup for logged-in users)
    res.cookie('theme_type', theme, { maxAge: 365 * 24 * 60 * 60 * 1000 }); // 1 year
    if (theme === 'special' && themeColor) {
      res.cookie('theme_color', themeColor, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
      }); // 1 year
    }

    // Redirect back to the original page
    res.redirect(returnTo);
  }
}
