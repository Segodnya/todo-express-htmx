import { Request, Response, NextFunction } from 'express';

// Theme types
export type ThemeType = 'system' | 'light' | 'dark' | 'special';
export type ThemeColor =
  | 'red'
  | 'orange'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'grey'
  | 'black';

export interface ThemeSettings {
  type: ThemeType;
  color?: ThemeColor;
}

// Extend Express Request/Response to include theme properties
export interface ThemeRequest extends Request {
  theme?: {
    type: ThemeType;
    color?: ThemeColor;
  };
}

export interface ThemeResponse extends Response {
  locals: {
    theme?: {
      type: ThemeType;
      color?: ThemeColor;
    };
    [key: string]: any;
  };
}

// Helper to get user's theme preferences
export const getUserTheme = (user: {
  settings?: { theme?: ThemeSettings };
}): ThemeSettings => {
  // Default to system theme if not specified
  return user?.settings?.theme || { type: 'system' };
};

// Middleware to apply theme settings
export const themeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Type assertion to help TypeScript understand our extended types
  const typedReq = req as ThemeRequest;
  const typedRes = res as ThemeResponse;

  // Set theme from session if user is logged in
  if (typedReq.session?.user) {
    const userTheme = getUserTheme(typedReq.session.user);
    typedReq.theme = userTheme;
  } else {
    // Otherwise try to get from cookies
    const themeType = typedReq.cookies?.theme_type as ThemeType;
    const themeColor = typedReq.cookies?.theme_color as ThemeColor;

    if (
      themeType &&
      ['system', 'light', 'dark', 'special'].includes(themeType)
    ) {
      typedReq.theme = {
        type: themeType,
        ...(themeType === 'special' && themeColor ? { color: themeColor } : {}),
      };
    } else {
      // Default to system theme
      typedReq.theme = { type: 'system' };
    }
  }

  // Make theme available to views
  typedRes.locals.theme = typedReq.theme;

  next();
};
