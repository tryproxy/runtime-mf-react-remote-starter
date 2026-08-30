import type { RemoteNavPageId } from '@/app/model/nav-manifest';
import { AboutPage } from '@/pages/about';
import { CrashPage } from '@/pages/crash';
import { DetailsPage } from '@/pages/details';
import { FormPage } from '@/pages/form';
import { HomePage } from '@/pages/home';
import { createElement, type ReactElement } from 'react';

/** Exhaustive route component projection for every nav-manifest page id. */
export function pageElement(
  pageId: RemoteNavPageId,
  isEmbedded: boolean,
  basename: string
): ReactElement {
  switch (pageId) {
    case 'overview':
      return createElement(HomePage, { basename, isEmbedded });
    case 'details':
      return createElement(DetailsPage, { basename });
    case 'about':
      return createElement(AboutPage, { basename });
    case 'form':
      return createElement(FormPage, { basename });
    case 'crash':
      return createElement(CrashPage);
  }
}
