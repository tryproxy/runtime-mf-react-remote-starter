import App from '@/app/app';
import { useBridgeLocale } from '@/shared/i18n';
import { HostBridgeProvider, useBridgeTheme } from '@/shared/lib';
import type { HostBridge } from '@platform/runtime-mf-contract';

type RemoteAppProps = {
  bridge: HostBridge;
  basename: string;
};

export function RemoteApp({ bridge, basename }: RemoteAppProps) {
  useBridgeLocale(bridge);
  const theme = useBridgeTheme(bridge);

  return (
    <div
      className={theme === 'dark' ? 'dark' : undefined}
      data-rmf-root=""
      data-rmf-theme={theme}
    >
      <HostBridgeProvider value={bridge}>
        <App isEmbedded basename={basename} />
      </HostBridgeProvider>
    </div>
  );
}
