import { Panel } from '@/shared/ui/panel';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

type AboutPageProps = {
  basename: string;
};

export function AboutPage({ basename }: AboutPageProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const activePath = `${location.pathname}${location.search}${location.hash}`;

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">
          {t('about.title')}
        </h3>
        <p className="text-muted-foreground mt-1 text-sm">
          {t('about.description')}
        </p>
      </div>

      <div className="wideMobile:grid-cols-2 grid gap-4">
        <Panel
          title={t('about.route')}
          value="/about"
          description={t('about.routeDesc')}
        />
        <Panel
          title={t('about.activePath')}
          value={activePath}
          description={t('about.activePathDesc')}
        />
        <Panel
          title={t('about.basename')}
          value={basename || '(none)'}
          description={t('about.basenameDesc')}
        />
        <Panel
          title={t('about.ownership')}
          value={t('about.ownershipValue')}
          description={t('about.ownershipDesc')}
        />
      </div>
    </section>
  );
}
