import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { isAppLocale } from '../model/locale';

type LocaleHostBridge = {
  i18n: {
    getSnapshot(): { locale: string };
    subscribe(listener: () => void): () => void;
  };
};

/** Sync module i18n with shell locale when embedded. */
export function useBridgeLocale(bridge: LocaleHostBridge | null): void {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!bridge) {
      return;
    }

    const apply = () => {
      const { locale } = bridge.i18n.getSnapshot();
      if (isAppLocale(locale) && i18n.language !== locale) {
        void i18n.changeLanguage(locale);
      }
    };

    apply();
    return bridge.i18n.subscribe(apply);
  }, [bridge, i18n]);
}
