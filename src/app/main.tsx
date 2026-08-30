import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RemoteErrorBoundary } from '@/app/ui/remote-error-boundary';
import { applyModuleTheme } from '@/shared/lib';
import { remoteConfig } from '../../remote.config';
import '@/shared/i18n';
// Preflight must establish the base layer before the standalone utility graph.
// The query marker keeps this graph separate from the federation entry.
import './styles/standalone.css';
import './styles/index.css?standalone';
import App from './app';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Standalone root element #root was not found.');
}

document.title = remoteConfig.displayName;
rootElement.dataset.rmfRoot = '';
applyModuleTheme('light', document.documentElement);
applyModuleTheme('light', rootElement);

createRoot(rootElement).render(
  <StrictMode>
    <RemoteErrorBoundary>
      <App />
    </RemoteErrorBoundary>
  </StrictMode>
);
