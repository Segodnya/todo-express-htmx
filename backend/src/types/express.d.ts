import { SupportedLanguage } from './i18n';

// Extending Express Request type to include session
declare namespace Express {
  interface Request {
    language?: SupportedLanguage;
  }

  interface Session {
    user?: {
      userId: string;
      email: string;
      name: string;
      settings: {
        language: SupportedLanguage;
      };
    };
  }
} 