import { describe, expect, it, vi } from 'vitest';

vi.mock('@platform/runtime-mf-adapters/react', () => ({
  createReactRemoteMount: (renderRemote: unknown) => renderRemote,
}));

vi.mock('@/shared/i18n/config/standalone-locale', () => {
  throw new Error('Embedded entry imported standalone locale ownership.');
});

describe('embedded federation entry', () => {
  it('does not touch standalone storage or document state on import', async () => {
    vi.resetModules();
    const getItem = vi.spyOn(Storage.prototype, 'getItem');
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const langBefore = document.documentElement.lang;
    const classBefore = document.documentElement.className;
    const themeBefore = document.documentElement.dataset.rmfTheme;

    await import('./index');

    expect(getItem).not.toHaveBeenCalled();
    expect(setItem).not.toHaveBeenCalled();
    expect(document.documentElement.lang).toBe(langBefore);
    expect(document.documentElement.className).toBe(classBefore);
    expect(document.documentElement.dataset.rmfTheme).toBe(themeBefore);
  }, 10_000);
});
