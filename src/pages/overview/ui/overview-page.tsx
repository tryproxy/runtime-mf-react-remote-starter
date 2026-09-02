import {
  Alert,
  AlertDescription,
  AlertTitle,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn';
import { CircleCheckIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function OverviewPage() {
  const { t } = useTranslation();

  return (
    <section className="@container/page flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="text-muted-foreground text-sm font-medium">
          {t('overview.eyebrow')}
        </p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {t('overview.title')}
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm text-pretty">
          {t('overview.description')}
        </p>
      </header>

      <Alert>
        <CircleCheckIcon />
        <AlertTitle>{t('overview.readyTitle')}</AlertTitle>
        <AlertDescription>{t('overview.readyDescription')}</AlertDescription>
      </Alert>

      <div className="grid gap-4 @3xl/page:grid-cols-2 @5xl/page:grid-cols-3">
        {(['start', 'integrate', 'ship'] as const).map((item) => (
          <Card key={item} size="sm">
            <CardHeader>
              <CardTitle>{t(`overview.cards.${item}.title`)}</CardTitle>
              <CardDescription>
                {t(`overview.cards.${item}.description`)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                {t(`overview.cards.${item}.detail`)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
