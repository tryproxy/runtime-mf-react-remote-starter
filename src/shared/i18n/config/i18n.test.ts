import { describe, expect, it, vi } from 'vitest';
import { createAppI18n } from './i18n';

describe('createAppI18n', () => {
  it('creates independent translation instances for separate mounts', async () => {
    const english = createAppI18n('en');
    const russian = createAppI18n('ru');

    expect(english.t('overview.title')).toBe('Starter remote');
    expect(russian.t('overview.title')).toBe('Стартовый remote-модуль');

    await english.changeLanguage('ru');

    expect(english.t('overview.title')).toBe('Стартовый remote-модуль');
    expect(russian.language).toBe('ru');
    expect(english).not.toBe(russian);
  });

  it('does not read storage or mutate the document while creating an instance', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem');
    const htmlBefore = document.documentElement.outerHTML;

    createAppI18n('en');

    expect(getItem).not.toHaveBeenCalled();
    expect(document.documentElement.outerHTML).toBe(htmlBefore);
  });
});
