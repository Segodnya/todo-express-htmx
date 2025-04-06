import { SupportedLanguage } from './i18n';

// Extending Express Request type to include session
declare namespace Express {
  interface Request {
    language?: SupportedLanguage;
    theme: {
      type: 'system' | 'light' | 'dark' | 'special';
      color?:
        | 'red'
        | 'orange'
        | 'green'
        | 'blue'
        | 'purple'
        | 'pink'
        | 'grey'
        | 'black';
    };
  }

  interface Session {
    user?: {
      userId: string;
      email: string;
      name: string;
      settings: {
        language: SupportedLanguage;
        theme: {
          type: 'system' | 'light' | 'dark' | 'special';
          color?:
            | 'red'
            | 'orange'
            | 'green'
            | 'blue'
            | 'purple'
            | 'pink'
            | 'grey'
            | 'black';
        };
      };
    };
  }
}
