import { useEffect } from 'react';
import { applyModuleTheme, type ModuleTheme } from './apply-module-theme';

type ThemeHostBridge = {
  theme: {
    getSnapshot(): { mode: ModuleTheme };
    subscribe(listener: () => void): () => void;
  };
};

/** Sync module/shadcn dark mode with shell theme when embedded. */
export function useBridgeTheme(
  bridge: ThemeHostBridge | null,
  mountRoot?: HTMLElement | null
): void {
  useEffect(() => {
    if (!bridge) {
      return;
    }

    const apply = () => {
      applyModuleTheme(bridge.theme.getSnapshot().mode, mountRoot);
    };

    apply();
    return bridge.theme.subscribe(apply);
  }, [bridge, mountRoot]);
}
