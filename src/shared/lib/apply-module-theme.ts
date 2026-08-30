export type ModuleTheme = 'light' | 'dark';

/** Apply standalone theme ownership to an explicitly supplied element. */
export function applyModuleTheme(
  theme: ModuleTheme,
  target: HTMLElement
): void {
  target.dataset.rmfTheme = theme;
  target.classList.toggle('dark', theme === 'dark');
}

/** Apply mount-owned theme markers and return an exact restoration callback. */
export function applyTemporaryModuleTheme(
  theme: ModuleTheme,
  target: HTMLElement
): () => void {
  const previousTheme = target.getAttribute('data-rmf-theme');
  const previouslyDark = target.classList.contains('dark');
  applyModuleTheme(theme, target);

  return () => {
    if (previousTheme === null) {
      target.removeAttribute('data-rmf-theme');
    } else {
      target.setAttribute('data-rmf-theme', previousTheme);
    }
    target.classList.toggle('dark', previouslyDark);
  };
}
