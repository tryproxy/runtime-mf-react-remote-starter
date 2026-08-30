import { RemoteErrorBoundary } from '@/app/ui/remote-error-boundary';
import '@/shared/i18n';
import '@/app/styles/index.css';
import { createReactRemoteMount } from '@platform/runtime-mf-adapters/react';
import { RemoteApp } from './remote-app';

export const mount = createReactRemoteMount(({ bridge, basename }) => (
  <RemoteErrorBoundary>
    <RemoteApp bridge={bridge} basename={basename} />
  </RemoteErrorBoundary>
));
