import { RemoteErrorBoundary } from '@/app/ui/remote-error-boundary';
import '@/app/styles/index.css';
import { createReactRemoteMount } from '@platform/runtime-mf-adapters/react';
import { RemoteApp } from './remote-app';

export const mount = createReactRemoteMount(
  ({ bridge, basename, container }) => (
    <RemoteErrorBoundary telemetry={bridge.telemetry}>
      <RemoteApp bridge={bridge} basename={basename} container={container} />
    </RemoteErrorBoundary>
  )
);
