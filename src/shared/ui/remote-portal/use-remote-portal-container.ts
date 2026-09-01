import { useContext } from 'react';
import { RemotePortalContext } from './remote-portal-context';

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
