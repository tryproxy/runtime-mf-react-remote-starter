import { navPagePath, remoteNavManifest } from '@/app/model/nav-manifest';
import { pageElement } from '@/app/model/page-element';
import { ModuleNav } from '@/app/ui/module-nav';
import { Toaster, TooltipProvider } from '@/shared/ui/shadcn';
import type { ModuleTheme } from '@/shared/lib';
import type { AppLocale } from '@/shared/i18n';
import type { ReactNode } from 'react';
import {
  BrowserRouter,
  HashRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

type AppProps =
  | {
      basename: string;
      isEmbedded: true;
      theme: ModuleTheme;
    }
  | {
      basename?: never;
      isEmbedded?: false;
      onStandaloneLocaleChange: (locale: AppLocale) => void;
      onStandaloneThemeChange: (theme: ModuleTheme) => void;
      theme: ModuleTheme;
    };

function AppRoutes({
  frame,
  theme,
}: {
  frame?: ReactNode;
  theme: ModuleTheme;
}) {
  return (
    <TooltipProvider>
      <section className="flex min-w-0 flex-col gap-6 overflow-x-auto p-px">
        {frame}

        <Routes>
          {remoteNavManifest.pages.map((page) => (
            <Route
              key={page.id}
              path={navPagePath(page.segment)}
              element={pageElement(page.id)}
            />
          ))}
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>

        <Toaster richColors closeButton theme={theme} position="top-right" />
      </section>
    </TooltipProvider>
  );
}

function App(props: AppProps) {
  if (props.isEmbedded) {
    return (
      <BrowserRouter basename={props.basename}>
        <AppRoutes theme={props.theme} />
      </BrowserRouter>
    );
  }

  return (
    <HashRouter>
      <AppRoutes
        frame={
          <ModuleNav
            theme={props.theme}
            onLocaleChange={props.onStandaloneLocaleChange}
            onThemeChange={props.onStandaloneThemeChange}
          />
        }
        theme={props.theme}
      />
    </HashRouter>
  );
}

export default App;
