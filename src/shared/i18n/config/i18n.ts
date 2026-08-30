import { createInstance, type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from '../locales/en';
import { ru } from '../locales/ru';
import type { AppLocale } from '../model/locale';

/** Create translation state owned by one mount session. */
export function createAppI18n(locale: AppLocale): I18nInstance {
  const instance = createInstance();

  void instance.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      es: { translation: en },
    },
    lng: locale,
    fallbackLng: 'en',
    initAsync: false,
    interpolation: { escapeValue: false },
  });

  return instance;
}
