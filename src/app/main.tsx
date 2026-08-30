import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RemoteErrorBoundary } from '@/app/ui/remote-error-boundary';
import { createAppI18n } from '@/shared/i18n';
import {
  persistLocale,
  readStoredLocale,
} from '@/shared/i18n/config/standalone-locale';
import { applyModuleTheme, HostBridgeProvider } from '@/shared/lib';
import { createMockHostBridge } from '@platform/runtime-mf-contract';
import { I18nextProvider } from 'react-i18next';
import { RemotePortalProvider } from '@/shared/ui/remote-portal';
import { RemoteToastProvider } from '@/shared/ui/remote-toast';
import { remoteConfig } from '../../remote.config';
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
rootElement.classList.add('relative', 'isolate');
applyModuleTheme('light', document.documentElement);
applyModuleTheme('light', rootElement);
const standaloneLocale = readStoredLocale();
document.documentElement.lang = standaloneLocale;
const standaloneI18n = createAppI18n(standaloneLocale);
const standaloneBridge = createMockHostBridge({
  theme: 'light',
  locale: standaloneLocale,
});

createRoot(rootElement).render(
  <StrictMode>
    <RemoteErrorBoundary>
      <I18nextProvider i18n={standaloneI18n}>
        <HostBridgeProvider value={standaloneBridge}>
          <RemotePortalProvider theme="light">
            <RemoteToastProvider>
              <App theme="light" onStandaloneLocaleChange={persistLocale} />
            </RemoteToastProvider>
          </RemotePortalProvider>
        </HostBridgeProvider>
      </I18nextProvider>
    </RemoteErrorBoundary>
  </StrictMode>
);
