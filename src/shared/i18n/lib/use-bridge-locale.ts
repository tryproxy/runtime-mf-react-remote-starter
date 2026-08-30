import type { i18n as I18nInstance } from 'i18next';
import { useEffect, useState } from 'react';
import { isAppLocale } from '../model/locale';
import type { AppLocale } from '../model/locale';

type LocaleHostBridge = {
  i18n: {
    getSnapshot(): { locale: string };
    subscribe(listener: () => void): () => void;
  };
};

/** Sync module i18n with shell locale when embedded. */
export function useBridgeLocale(
  bridge: LocaleHostBridge,
  i18n: I18nInstance
): AppLocale {
  const [locale, setLocale] = useState<AppLocale>(() => {
    const initialLocale = bridge.i18n.getSnapshot().locale;
    return isAppLocale(initialLocale) ? initialLocale : 'en';
  });

  useEffect(() => {
    const apply = () => {
      const nextLocale = bridge.i18n.getSnapshot().locale;
      if (isAppLocale(nextLocale)) {
        setLocale(nextLocale);
        if (i18n.language !== nextLocale) {
          void i18n.changeLanguage(nextLocale);
        }
      }
    };

    apply();
    return bridge.i18n.subscribe(apply);
  }, [bridge, i18n]);

  return locale;
}
