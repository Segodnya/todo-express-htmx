import i18next from 'i18next';
import i18nextHttpMiddleware from 'i18next-http-middleware';
import i18nextFsBackend from 'i18next-fs-backend';
import path from 'path';
import { Express, Request, Response, NextFunction } from 'express';
import {
  I18nConfig,
  SupportedLanguage,
  I18nHelper,
  I18nRequest,
  I18nResponse,
} from '../types/i18n';

// Default i18n configuration
const defaultConfig: I18nConfig = {
  backend: {
    loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
  },
  fallbackLng: 'en',
  preload: ['en', 'es', 'pt', 'fr'],
  supportedLngs: ['en', 'es', 'pt', 'fr'],
  ns: ['common', 'todos', 'auth'],
  defaultNS: 'common',
  detection: {
    order: ['querystring', 'cookie', 'session', 'header'],
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupSession: 'lng',
    lookupHeader: 'accept-language',
    caches: ['cookie'],
    cookieExpirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
  },
  load: 'all',
  debug: process.env.NODE_ENV !== 'production',
};

// Initialize i18next with configuration
export const initI18n = async (
  config: Partial<I18nConfig> = {}
): Promise<typeof i18next> => {
  await i18next
    .use(i18nextHttpMiddleware.LanguageDetector)
    .use(i18nextFsBackend)
    .init({
      ...defaultConfig,
      ...config,
    });

  return i18next;
};

// Create the Express middleware
export const i18nMiddleware = i18nextHttpMiddleware.handle(i18next);

// Helper for getting translations in templates
export const setupI18nHelpers = (app: Express): void => {
  app.locals.t = (key: string, options = {}) => i18next.t(key, options);
};

// Helper to get user's preferred language
export const getUserLanguage = (user: {
  settings?: { language?: SupportedLanguage };
}): SupportedLanguage => {
  return user?.settings?.language || 'en';
};

// Change language middleware
export const changeLanguageMiddleware = (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  // Type assertion to help TypeScript understand our extended types
  const typedReq = req as Request & I18nRequest;
  const typedRes = res as Response & I18nResponse;

  if (typedReq.session?.user) {
    typedReq.language = getUserLanguage(typedReq.session.user);
  }

  typedRes.locals.language = typedReq.language || 'en';
  next();
};
