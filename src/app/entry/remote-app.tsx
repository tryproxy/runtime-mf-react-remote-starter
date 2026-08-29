import App from '@/app/app';
import { useBridgeLocale } from '@/shared/i18n';
import { HostBridgeProvider, useBridgeTheme } from '@/shared/lib';
import type { HostBridge } from '@platform/runtime-mf-contract';

type RemoteAppProps = {
  bridge: HostBridge;
  basename: string;
  mountRoot?: HTMLElement | null;
};

export function RemoteApp({ bridge, basename, mountRoot }: RemoteAppProps) {
  useBridgeLocale(bridge);
  useBridgeTheme(bridge, mountRoot);

  return (
    <HostBridgeProvider value={bridge}>
      <App isEmbedded basename={basename} />
    </HostBridgeProvider>
  );
}
