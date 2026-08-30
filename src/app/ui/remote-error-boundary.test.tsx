import { createAppI18n } from '@/shared/i18n';
import { render } from '@testing-library/react';
import type { HostTelemetry } from '@platform/runtime-mf-contract';
import { I18nextProvider } from 'react-i18next';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RemoteErrorBoundary } from './remote-error-boundary';

function BrokenView(): never {
  throw new Error('mount failed');
}

describe('RemoteErrorBoundary telemetry', () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    consoleError.mockClear();
  });

  afterEach(() => {
    consoleError.mockClear();
  });

  it('reports embedded render errors through host telemetry', () => {
    const telemetry: HostTelemetry = {
      track: vi.fn(),
      captureException: vi.fn(),
      captureMessage: vi.fn(),
    };

    render(
      <I18nextProvider i18n={createAppI18n('en')}>
        <RemoteErrorBoundary telemetry={telemetry}>
          <BrokenView />
        </RemoteErrorBoundary>
      </I18nextProvider>
    );

    expect(telemetry.captureException).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'mount failed' }),
      expect.objectContaining({ source: 'react-error-boundary' })
    );
  });

  it('falls back to the console outside a host', () => {
    render(
      <I18nextProvider i18n={createAppI18n('en')}>
        <RemoteErrorBoundary>
          <BrokenView />
        </RemoteErrorBoundary>
      </I18nextProvider>
    );

    expect(consoleError).toHaveBeenCalledWith(
      '[RemoteErrorBoundary]',
      expect.objectContaining({ message: 'mount failed' }),
      expect.any(String)
    );
  });
});
