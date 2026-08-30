import { createHostFetch, useHostBridge } from '@/shared/lib';
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

type AccountMe = {
  id: string;
  role: string;
  status: string;
  profile: {
    displayName: string | null;
    email: string | null;
    handle: string | null;
  } | null;
};

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') ||
  'http://localhost:3000';

/** Visible on every remote page — protected GET via bridge.auth.http. */
export function ProtectedMeButton() {
  const { t } = useTranslation();
  const bridge = useHostBridge();
  const [me, setMe] = useState<AccountMe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function requestProtectedMe() {
    setMe(null);
    setError(null);

    if (!bridge) {
      setError(t('home.meNoBridge'));
      return;
    }

    setLoading(true);
    try {
      const hostFetch = createHostFetch(bridge.auth.http);
      const response = await hostFetch(`${API_BASE}/v1/account/me`, {
        method: 'GET',
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}`);
      }

      setMe((await response.json()) as AccountMe);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('home.meFailed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('home.meTitle')}</CardTitle>
        <CardDescription>{t('home.meHint')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <Button
          type="button"
          disabled={loading}
          onClick={() => void requestProtectedMe()}
        >
          {loading ? t('home.meLoading') : t('home.meRequest')}
        </Button>
        {error ? <p className="text-destructive break-all">{error}</p> : null}
        {me ? (
          <pre className="bg-muted overflow-x-auto rounded-lg p-3 text-xs">
            {JSON.stringify(me, null, 2)}
          </pre>
        ) : null}
      </CardContent>
    </Card>
  );
}
