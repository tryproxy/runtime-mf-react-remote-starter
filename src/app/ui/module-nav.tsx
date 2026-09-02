import { navPagePath, remoteNavManifest } from '@/app/model/nav-manifest';
import { APP_LOCALES, type AppLocale, isAppLocale } from '@/shared/i18n';
import { cn, type ModuleTheme } from '@/shared/lib';
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn';
import { MoonIcon, SunIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type ModuleNavProps = {
  /** Standalone only — when embedded, shell owns the language switch. */
  onLocaleChange: (locale: AppLocale) => void;
  theme: ModuleTheme;
  onThemeChange: (theme: ModuleTheme) => void;
};

export function ModuleNav({
  onLocaleChange,
  onThemeChange,
  theme,
}: ModuleNavProps) {
  const { t, i18n } = useTranslation();
  const locale: AppLocale = isAppLocale(i18n.language) ? i18n.language : 'en';

  return (
    <header className="border-border bg-card flex flex-col gap-3 rounded-xl border p-3 shadow-sm">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <p className="font-heading font-semibold">{t('nav.moduleTitle')}</p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            aria-label={t('nav.theme')}
            onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? <SunIcon /> : <MoonIcon />}
            {t(`nav.${theme}`)}
          </Button>

          <Select
            value={locale}
            onValueChange={(value) => {
              const next = value as AppLocale;
              onLocaleChange(next);
              void i18n.changeLanguage(next);
            }}
          >
            <SelectTrigger size="sm" aria-label={t('nav.language')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {APP_LOCALES.map((code) => (
                <SelectItem key={code} value={code}>
                  {code.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <nav className="flex min-w-0 flex-wrap gap-2" aria-label="Module routes">
        {remoteNavManifest.pages.map((page) => {
          const to = navPagePath(page.segment);

          return (
            <NavLink
              key={page.id}
              to={to}
              end={page.segment === ''}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium',
                  isActive
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )
              }
            >
              {page.label[locale]}
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
}
