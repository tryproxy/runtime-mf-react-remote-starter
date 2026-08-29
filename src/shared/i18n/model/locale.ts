export type AppLocale = 'en' | 'ru' | 'es';

export const APP_LOCALES: AppLocale[] = ['en', 'ru', 'es'];

export function isAppLocale(
  value: string | null | undefined
): value is AppLocale {
  return value === 'en' || value === 'ru' || value === 'es';
}
