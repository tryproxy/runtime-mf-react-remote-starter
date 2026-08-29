import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
} from '@/shared/ui/shadcn';
import { AlertCircleIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type RemoteErrorFallbackProps = {
  title?: string;
  message?: string | null;
  onRetry?: () => void;
};

export function RemoteErrorFallback({
  title,
  message,
  onRetry,
}: RemoteErrorFallbackProps) {
  const { t } = useTranslation();

  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>{title ?? t('error.title')}</AlertTitle>
      <AlertDescription>
        <p>{t('error.description')}</p>
        {message ? (
          <pre className="mt-3 max-h-40 overflow-auto text-xs whitespace-pre-wrap">
            {message}
          </pre>
        ) : null}
        {onRetry ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={onRetry}
          >
            {t('error.retry')}
          </Button>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}
