import { useEffect, useState } from 'react';
import type { ModuleTheme } from './apply-module-theme';

type ThemeHostBridge = {
  theme: {
    getSnapshot(): { mode: ModuleTheme };
    subscribe(listener: () => void): () => void;
  };
};

/** Subscribe to the shell theme without mutating the shell document. */
export function useBridgeTheme(bridge: ThemeHostBridge): ModuleTheme {
  const [theme, setTheme] = useState(() => bridge.theme.getSnapshot().mode);

  useEffect(() => {
    const apply = () => {
      setTheme(bridge.theme.getSnapshot().mode);
    };

    apply();
    return bridge.theme.subscribe(apply);
  }, [bridge]);

  return theme;
}
