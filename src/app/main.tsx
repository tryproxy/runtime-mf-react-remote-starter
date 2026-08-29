import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RemoteErrorBoundary } from '@/app/ui/remote-error-boundary';
import { applyModuleTheme } from '@/shared/lib';
import { remoteConfig } from '../../remote.config';
import '@/shared/i18n';
import './styles/index.css';
import App from './app';

document.title = remoteConfig.displayName;
applyModuleTheme('light');

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <RemoteErrorBoundary>
      <App />
    </RemoteErrorBoundary>
  </StrictMode>
);
