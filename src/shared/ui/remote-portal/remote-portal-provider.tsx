import { createContext, useContext, useState, type ReactNode } from 'react';
import type { ModuleTheme } from '@/shared/lib';

const RemotePortalContext = createContext<HTMLElement | null>(null);

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

/** Resolve a portal target without allowing content to escape the mount. */
export function useRemotePortalContainer(
  explicitContainer?: HTMLElement
): HTMLElement {
  const container = useContext(RemotePortalContext);

  if (!container) {
    throw new Error(
      'Remote portal components must be rendered inside RemotePortalProvider.'
    );
  }

  if (!explicitContainer) {
    return container;
  }

  const remoteRoot = container.closest<HTMLElement>('[data-rmf-root]');
  if (!remoteRoot?.contains(explicitContainer)) {
    throw new Error(
      'A remote portal container override must stay below [data-rmf-root].'
    );
  }

  return explicitContainer;
}
