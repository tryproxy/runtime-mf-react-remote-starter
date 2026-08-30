import type { HostAuthHttp, HostBridge } from '@platform/runtime-mf-contract';

export type HostFetch = (
  input: RequestInfo | URL,
  init?: RequestInit
) => Promise<Response>;

/**
 * Creates a fetch function that follows the credential transport selected by
 * the host. Bearer tokens are requested immediately before every call and are
 * never cached by the remote.
 */
export function createHostFetch(
  auth: HostAuthHttp,
  fetchImpl: typeof fetch = globalThis.fetch
): HostFetch {
  return async (input, init = {}) => {
    const requestHeaders = input instanceof Request ? input.headers : undefined;
    const headers = new Headers(requestHeaders);
    new Headers(init.headers).forEach((value, key) => {
      headers.set(key, value);
    });

    if (auth.mode === 'cookie') {
      return fetchImpl(input, {
        ...init,
        credentials: 'include',
        headers,
      });
    }

    const accessToken = await auth.getAccessToken?.();
    if (!accessToken) {
      throw new Error('The host did not provide an access token.');
    }

    headers.set('Authorization', `Bearer ${accessToken}`);
    return fetchImpl(input, { ...init, headers });
  };
}

/** Request host-owned sign-out without touching credential storage. */
export function requestSignOut(bridge: {
  auth: Pick<HostBridge['auth'], 'signOut'>;
}): Promise<void> {
  return bridge.auth.signOut();
}
