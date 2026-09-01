import App from '@/app/app';
import { createAppI18n, useBridgeLocale } from '@/shared/i18n';
import {
  applyTemporaryModuleTheme,
  HostBridgeProvider,
  useBridgeTheme,
} from '@/shared/lib';
import type { HostBridge } from '@platform/runtime-mf-contract';
import { useLayoutEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { RemotePortalProvider } from '@/shared/ui/remote-portal';
import { RemoteToastProvider } from '@/shared/ui/remote-toast';

type RemoteAppProps = {
  bridge: HostBridge;
  basename: string;
  container?: HTMLElement;
};

export function RemoteApp({ bridge, basename, container }: RemoteAppProps) {
  const [i18n] = useState(() =>
    createAppI18n(bridge.i18n.getSnapshot().locale)
  );
  const locale = useBridgeLocale(bridge, i18n);
  const theme = useBridgeTheme(bridge);

  useLayoutEffect(() => {
    if (!container) {
      return;
    }

    return applyTemporaryModuleTheme(theme, container);
  }, [container, theme]);

  return (
    <div
      className={
        theme === 'dark' ? 'dark relative isolate' : 'relative isolate'
      }
      data-rmf-root=""
      data-rmf-theme={theme}
      lang={locale}
    >
      <I18nextProvider i18n={i18n}>
        <HostBridgeProvider value={bridge}>
          <RemotePortalProvider theme={theme}>
            <RemoteToastProvider>
              <App isEmbedded basename={basename} theme={theme} />
            </RemoteToastProvider>
          </RemotePortalProvider>
        </HostBridgeProvider>
      </I18nextProvider>
    </div>
  );
}
