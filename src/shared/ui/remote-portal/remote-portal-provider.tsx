import { useState, type ReactNode } from 'react';
import type { ModuleTheme } from '@/shared/lib';
import { RemotePortalContext } from './remote-portal-context';

type RemotePortalProviderProps = {
  children: ReactNode;
  theme: ModuleTheme;
};

/** Owns the overlay destination for one remote mount session. */
export function RemotePortalProvider({
  children,
  theme,
}: RemotePortalProviderProps) {
  const [portalRoot, setPortalRoot] = useState<HTMLDivElement | null>(null);

  return (
    <RemotePortalContext.Provider value={portalRoot}>
      <div
        ref={setPortalRoot}
        data-rmf-portal-root=""
        data-rmf-theme={theme}
        className={
          theme === 'dark'
            ? 'dark pointer-events-none absolute inset-0 isolate z-40'
            : 'pointer-events-none absolute inset-0 isolate z-40'
        }
      />
      {portalRoot ? children : null}
    </RemotePortalContext.Provider>
  );
}
