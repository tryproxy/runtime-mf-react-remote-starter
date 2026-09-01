import { useCallback, useSyncExternalStore } from 'react';
import type { ModuleTheme } from './apply-module-theme';

type ThemeHostBridge = {
  theme: {
    getSnapshot(): { mode: ModuleTheme };
    subscribe(listener: () => void): () => void;
  };
};

/** Subscribe to the shell theme without mutating the shell document. */
export function useBridgeTheme(bridge: ThemeHostBridge): ModuleTheme {
  const getSnapshot = useCallback(
    () => bridge.theme.getSnapshot().mode,
    [bridge]
  );
  const subscribe = useCallback(
    (listener: () => void) => bridge.theme.subscribe(listener),
    [bridge]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
