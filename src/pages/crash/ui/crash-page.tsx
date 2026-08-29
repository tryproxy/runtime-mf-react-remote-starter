import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function CrashPage() {
  const { t } = useTranslation();
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    throw new Error('PoC crash: intentional module render error');
  }

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">
          {t('crash.title')}
        </h3>
        <p className="text-muted-foreground mt-1 text-sm">
          {t('crash.description')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('crash.title')}</CardTitle>
          <CardDescription>{t('crash.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="destructive"
            onClick={() => setShouldCrash(true)}
          >
            {t('crash.button')}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
