import type { RemoteNavPageId } from '@/app/model/nav-manifest';
import { OverviewPage } from '@/pages/overview';
import { PatternsPage } from '@/pages/patterns';
import { createElement, type ReactElement } from 'react';

/** Exhaustive route component projection for every nav-manifest page id. */
export function pageElement(pageId: RemoteNavPageId): ReactElement {
  switch (pageId) {
    case 'overview':
      return createElement(OverviewPage);
    case 'patterns':
      return createElement(PatternsPage);
  }
}
