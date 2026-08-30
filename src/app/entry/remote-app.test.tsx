import { act, render, within } from '@testing-library/react';
import {
  createMockHostBridge,
  type AppLocale,
  type HostBridge,
  type ThemeMode,
} from '@platform/runtime-mf-contract';
import { describe, expect, it } from 'vitest';
import { RemoteApp } from './remote-app';

function createMutableBridge(initial: { locale: AppLocale; theme: ThemeMode }) {
  let locale = initial.locale;
  let theme = initial.theme;
  const localeListeners = new Set<() => void>();
  const themeListeners = new Set<() => void>();
  const bridge: HostBridge = {
    ...createMockHostBridge(initial),
    i18n: {
      getSnapshot: () => ({ locale }),
      subscribe: (listener) => {
        localeListeners.add(listener);
        return () => localeListeners.delete(listener);
      },
    },
    theme: {
      getSnapshot: () => ({ mode: theme }),
      subscribe: (listener) => {
        themeListeners.add(listener);
        return () => themeListeners.delete(listener);
      },
    },
  };

  return {
    bridge,
    setLocale(nextLocale: AppLocale) {
      locale = nextLocale;
      localeListeners.forEach((listener) => listener());
    },
    setTheme(nextTheme: ThemeMode) {
      theme = nextTheme;
      themeListeners.forEach((listener) => listener());
    },
  };
}

describe('RemoteApp mount isolation', () => {
  it('keeps locale and theme independent across simultaneous mounts', () => {
    const englishBridge = createMockHostBridge({
      locale: 'en',
      theme: 'light',
    });
    const russianBridge = createMockHostBridge({
      locale: 'ru',
      theme: 'dark',
    });
    const { container } = render(
      <>
        <div data-testid="english-mount">
          <RemoteApp bridge={englishBridge} basename="/" />
        </div>
        <div data-testid="russian-mount">
          <RemoteApp bridge={russianBridge} basename="/" />
        </div>
      </>
    );

    const englishMount = within(container).getByTestId('english-mount');
    const russianMount = within(container).getByTestId('russian-mount');
    const englishRoot = englishMount.querySelector('[data-rmf-root]');
    const russianRoot = russianMount.querySelector('[data-rmf-root]');

    expect(within(englishMount).getByText('Remote module')).toBeTruthy();
    expect(within(russianMount).getByText('Удалённый модуль')).toBeTruthy();
    expect(englishRoot?.getAttribute('data-rmf-theme')).toBe('light');
    expect(englishRoot?.getAttribute('lang')).toBe('en');
    expect(russianRoot?.getAttribute('data-rmf-theme')).toBe('dark');
    expect(russianRoot?.getAttribute('lang')).toBe('ru');
    expect(document.documentElement.dataset.rmfTheme).toBeUndefined();
  });

  it('applies host locale and theme updates without remounting', async () => {
    const session = createMutableBridge({ locale: 'en', theme: 'light' });
    const { container } = render(
      <RemoteApp bridge={session.bridge} basename="/" />
    );
    const rootBefore = container.querySelector('[data-rmf-root]');

    act(() => {
      session.setLocale('ru');
      session.setTheme('dark');
    });

    expect(await within(container).findByText('Удалённый модуль')).toBeTruthy();
    expect(container.querySelector('[data-rmf-root]')).toBe(rootBefore);
    expect(rootBefore?.getAttribute('data-rmf-theme')).toBe('dark');
    expect(rootBefore?.getAttribute('lang')).toBe('ru');
  });

  it('restores mount-container theme markers during cleanup', () => {
    const mountContainer = document.createElement('div');
    document.body.append(mountContainer);
    const bridge = createMockHostBridge({ locale: 'en', theme: 'dark' });
    const { unmount } = render(
      <RemoteApp bridge={bridge} basename="/" container={mountContainer} />,
      { container: mountContainer }
    );

    expect(mountContainer.dataset.rmfTheme).toBe('dark');
    expect(mountContainer.classList.contains('dark')).toBe(true);

    unmount();

    expect(mountContainer.dataset.rmfTheme).toBeUndefined();
    expect(mountContainer.classList.contains('dark')).toBe(false);
    mountContainer.remove();
  });
});
