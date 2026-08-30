import { navPagePath, remoteNavManifest } from '@/app/model/nav-manifest';
import { pageElement } from '@/app/model/page-element';
import { ModuleNav } from '@/app/ui/module-nav';
import { ProtectedMeButton } from '@/app/ui/protected-me-button';
import { Toaster, TooltipProvider } from '@/shared/ui/shadcn';
import type { ModuleTheme } from '@/shared/lib';
import type { AppLocale } from '@/shared/i18n';
import {
  BrowserRouter,
  HashRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

type AppProps = {
  basename?: string;
  isEmbedded?: boolean;
  onStandaloneLocaleChange?: (locale: AppLocale) => void;
  theme: ModuleTheme;
};

function AppRoutes({
  isEmbedded,
  basename,
  onStandaloneLocaleChange,
  theme,
}: {
  isEmbedded: boolean;
  basename: string;
  onStandaloneLocaleChange?: (locale: AppLocale) => void;
  theme: ModuleTheme;
}) {
  return (
    <TooltipProvider>
      <section className="min-w-0 space-y-6 overflow-x-auto">
        {!isEmbedded ? (
          <ModuleNav
            showLocaleSwitch
            onLocaleChange={onStandaloneLocaleChange}
          />
        ) : null}

        <ProtectedMeButton />

        <Routes>
          {remoteNavManifest.pages.map((page) => (
            <Route
              key={page.id}
              path={navPagePath(page.segment)}
              element={pageElement(page.id, isEmbedded, basename)}
            />
          ))}
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>

        <Toaster theme={theme} richColors closeButton position="top-right" />
      </section>
    </TooltipProvider>
  );
}

function App({
  basename = '',
  isEmbedded = false,
  onStandaloneLocaleChange,
  theme,
}: AppProps) {
  const effectiveBasename = isEmbedded ? basename : '';

  if (isEmbedded) {
    return (
      <BrowserRouter basename={effectiveBasename}>
        <AppRoutes isEmbedded basename={effectiveBasename} theme={theme} />
      </BrowserRouter>
    );
  }

  return (
    <HashRouter>
      <AppRoutes
        isEmbedded={false}
        basename={effectiveBasename}
        theme={theme}
        onStandaloneLocaleChange={onStandaloneLocaleChange}
      />
    </HashRouter>
  );
}

export default App;
