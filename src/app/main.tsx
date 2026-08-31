import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { StandaloneApp } from '@/app/entry/standalone-app';
import { RemoteErrorBoundary } from '@/app/ui/remote-error-boundary';
import { createAppI18n } from '@/shared/i18n';
import { readStoredLocale } from '@/shared/i18n/config/standalone-locale';
import { applyModuleTheme } from '@/shared/lib';
import { remoteConfig } from '../../remote.config';
// Preflight must establish the base layer before the standalone utility graph.
// The query marker keeps this graph separate from the federation entry.
import './styles/standalone.css';
import './styles/index.css?standalone';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Standalone root element #root was not found.');
}

const standaloneRootElement = rootElement;

document.title = remoteConfig.displayName;
rootElement.dataset.rmfRoot = '';
rootElement.classList.add('relative', 'isolate');
applyModuleTheme('light', document.documentElement);
applyModuleTheme('light', rootElement);
const standaloneLocale = readStoredLocale();
document.documentElement.lang = standaloneLocale;
const standaloneI18n = createAppI18n(standaloneLocale);

createRoot(standaloneRootElement).render(
  <StrictMode>
    <RemoteErrorBoundary>
      <StandaloneApp
        i18n={standaloneI18n}
        initialLocale={standaloneLocale}
        rootElement={standaloneRootElement}
      />
    </RemoteErrorBoundary>
  </StrictMode>
);
