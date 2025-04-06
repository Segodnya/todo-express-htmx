export type SupportedLanguage = 'en' | 'es' | 'pt' | 'fr';
export type SupportedNamespace = 'common' | 'todos' | 'auth';

export interface I18nConfig {
  backend: {
    loadPath: string;
  };
  fallbackLng: SupportedLanguage;
  preload: SupportedLanguage[];
  supportedLngs: SupportedLanguage[];
  ns: SupportedNamespace[];
  defaultNS: SupportedNamespace;
  detection: {
    order: string[];
    lookupQuerystring: string;
    lookupCookie: string;
    lookupSession: string;
    lookupHeader: string;
    caches: string[];
    cookieExpirationDate: Date;
  };
  load: 'all';
  debug: boolean;
}

export interface I18nHelper {
  t: (key: string, options?: Record<string, unknown>) => string;
}

// Express type extension for request object
export interface I18nRequest {
  language?: SupportedLanguage;
  session?: {
    user?: {
      settings?: {
        language?: SupportedLanguage;
      };
    };
  };
}

// Express type extension for response object
export interface I18nResponse {
  locals: {
    language: SupportedLanguage;
    [key: string]: any;
  };
}
