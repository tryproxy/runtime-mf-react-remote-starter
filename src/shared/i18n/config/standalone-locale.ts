import { type AppLocale, isAppLocale } from '../model/locale';

const STORAGE_KEY = 'module-locale';

/** Standalone-only locale persistence; embedded mounts must not call this. */
export function readStoredLocale(): AppLocale {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isAppLocale(stored) ? stored : 'en';
}

/** Standalone-only document/storage ownership. */
export function persistLocale(locale: AppLocale): void {
  window.localStorage.setItem(STORAGE_KEY, locale);
  document.documentElement.lang = locale;
}
