import { Panel } from '@/shared/ui/panel';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/shadcn';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

type HomePageProps = {
  isEmbedded: boolean;
  basename: string;
};

export function HomePage({ isEmbedded, basename }: HomePageProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const activePath = `${location.pathname}${location.search}${location.hash}`;

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">
          {t('home.title')}
        </h3>
        <p className="text-muted-foreground mt-1 text-sm">
          {t('home.description')}
        </p>
      </div>

      <div className="wideMobile:grid-cols-2 grid gap-4">
        <Panel
          title={t('home.owner')}
          value={t('home.ownerValue')}
          description={t('home.ownerDesc')}
        />
        <Panel
          title={t('home.mode')}
          value={isEmbedded ? t('home.modeEmbedded') : t('home.modeStandalone')}
          description={
            isEmbedded
              ? t('home.modeEmbeddedDesc')
              : t('home.modeStandaloneDesc')
          }
        />
        <Panel
          title={t('home.activePath')}
          value={activePath}
          description={t('home.activePathDesc')}
        />
        <Panel
          title={t('home.basename')}
          value={basename || '(none)'}
          description={t('home.basenameDesc')}
        />
        <Panel
          title={t('home.entry')}
          value="./mount"
          description={t('home.entryDesc')}
        />
        <Panel
          title={t('home.proves')}
          value={t('home.provesValue')}
          description={t('home.provesDesc')}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('home.notesTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-muted-foreground list-inside list-disc space-y-2 text-sm">
            <li>{t('home.noteLayout')}</li>
            <li>{t('home.noteMount')}</li>
            <li>{t('home.noteBridge')}</li>
            <li>{t('home.noteI18n')}</li>
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
