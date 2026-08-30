import type { HostBridge } from '@platform/runtime-mf-contract';
import { describe, expect, it, vi } from 'vitest';
import { createHostFetch, requestSignOut } from './host-auth';

describe('createHostFetch', () => {
  it('reads a fresh bearer token immediately before every request', async () => {
    const getAccessToken = vi
      .fn<() => Promise<string | null>>()
      .mockResolvedValueOnce('first-token')
      .mockResolvedValueOnce('second-token');
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response());
    const hostFetch = createHostFetch(
      { mode: 'bearer', getAccessToken },
      fetchImpl
    );

    await hostFetch('/api/me');
    await hostFetch('/api/me');

    expect(getAccessToken).toHaveBeenCalledTimes(2);
    expect(
      new Headers(fetchImpl.mock.calls[0]?.[1]?.headers).get('Authorization')
    ).toBe('Bearer first-token');
    expect(
      new Headers(fetchImpl.mock.calls[1]?.[1]?.headers).get('Authorization')
    ).toBe('Bearer second-token');
  });

  it('uses cookie credentials without reading a JavaScript token', async () => {
    const getAccessToken = vi.fn<() => Promise<string | null>>();
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response());
    const hostFetch = createHostFetch(
      { mode: 'cookie', getAccessToken },
      fetchImpl
    );

    await hostFetch('/api/me', { credentials: 'omit' });

    expect(getAccessToken).not.toHaveBeenCalled();
    expect(fetchImpl).toHaveBeenCalledWith(
      '/api/me',
      expect.objectContaining({ credentials: 'include' })
    );
  });

  it('fails before fetch when bearer auth has no access token', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response());
    const hostFetch = createHostFetch(
      { mode: 'bearer', getAccessToken: async () => null },
      fetchImpl
    );

    await expect(hostFetch('/api/me')).rejects.toThrow('access token');
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});

describe('requestSignOut', () => {
  it('delegates sign-out to the host bridge', async () => {
    const signOut = vi.fn<HostBridge['auth']['signOut']>().mockResolvedValue();

    await requestSignOut({ auth: { signOut } });

    expect(signOut).toHaveBeenCalledOnce();
  });
});
