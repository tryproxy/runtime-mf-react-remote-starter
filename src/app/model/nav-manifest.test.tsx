import {
  navPagePath,
  remoteNavManifest,
  serializeRemoteNavManifest,
} from '@/app/model/nav-manifest';
import { pageElement } from '@/app/model/page-element';
import { isValidElement } from 'react';
import { describe, expect, it } from 'vitest';

describe('remote navigation projection', () => {
  it('publishes only the neutral overview and optional patterns routes', () => {
    expect(
      remoteNavManifest.pages.map(({ id, segment }) => ({ id, segment }))
    ).toEqual([
      { id: 'overview', segment: '' },
      { id: 'patterns', segment: 'patterns' },
    ]);
  });

  it('serializes the exact manifest emitted as nav.json', () => {
    expect(JSON.parse(serializeRemoteNavManifest())).toEqual(remoteNavManifest);
  });

  it('maps every manifest page to a unique route and React element', () => {
    const paths = remoteNavManifest.pages.map((page) =>
      navPagePath(page.segment)
    );

    expect(new Set(paths).size).toBe(paths.length);
    for (const page of remoteNavManifest.pages) {
      expect(isValidElement(pageElement(page.id))).toBe(true);
    }
  });
});
