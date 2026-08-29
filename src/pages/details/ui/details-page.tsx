import { Panel } from '@/shared/ui/panel';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

type DetailsPageProps = {
  basename: string;
};

export function DetailsPage({ basename }: DetailsPageProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const activePath = `${location.pathname}${location.search}${location.hash}`;

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">
          {t('details.title')}
        </h3>
        <p className="text-muted-foreground mt-1 text-sm">
          {t('details.description')}
        </p>
      </div>

      <div className="wideMobile:grid-cols-2 grid gap-4">
        <Panel
          title={t('details.route')}
          value="/details"
          description={t('details.routeDesc')}
        />
        <Panel
          title={t('details.activePath')}
          value={activePath}
          description={t('details.activePathDesc')}
        />
        <Panel
          title={t('details.basename')}
          value={basename || '(none)'}
          description={t('details.basenameDesc')}
        />
        <Panel
          title={t('details.history')}
          value={t('details.historyValue')}
          description={t('details.historyDesc')}
        />
      </div>
    </section>
  );
}
