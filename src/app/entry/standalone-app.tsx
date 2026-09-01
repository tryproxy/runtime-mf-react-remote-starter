import App from '@/app/app';
import type { AppLocale } from '@/shared/i18n';
import { persistLocale } from '@/shared/i18n/config/standalone-locale';
import { applyModuleTheme, HostBridgeProvider } from '@/shared/lib';
import { RemotePortalProvider } from '@/shared/ui/remote-portal';
import { RemoteToastProvider } from '@/shared/ui/remote-toast';
import { createMockHostBridge } from '@platform/runtime-mf-contract';
import { useLayoutEffect, useMemo, useState } from 'react';
import type { i18n as I18nInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';

type StandaloneAppProps = {
  i18n: I18nInstance;
  initialLocale: AppLocale;
  rootElement: HTMLElement;
};

/** Standalone-only providers and document ownership. */
export function StandaloneApp({
  i18n,
  initialLocale,
  rootElement,
}: StandaloneAppProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [locale, setLocale] = useState(initialLocale);
  const bridge = useMemo(
    () => createMockHostBridge({ theme, locale }),
    [locale, theme]
  );

  useLayoutEffect(() => {
    applyModuleTheme(theme, document.documentElement);
    applyModuleTheme(theme, rootElement);
  }, [rootElement, theme]);

  return (
    <I18nextProvider i18n={i18n}>
      <HostBridgeProvider value={bridge}>
        <RemotePortalProvider theme={theme}>
          <RemoteToastProvider>
            <App
              theme={theme}
              onStandaloneLocaleChange={(nextLocale) => {
                setLocale(nextLocale);
                persistLocale(nextLocale);
              }}
              onStandaloneThemeChange={setTheme}
            />
          </RemoteToastProvider>
        </RemotePortalProvider>
      </HostBridgeProvider>
    </I18nextProvider>
  );
}
