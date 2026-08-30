export type ModuleTheme = 'light' | 'dark';

/** Apply standalone theme ownership to an explicitly supplied element. */
export function applyModuleTheme(
  theme: ModuleTheme,
  target: HTMLElement
): void {
  target.dataset.rmfTheme = theme;
  target.classList.toggle('dark', theme === 'dark');
}
