export type ModuleTheme = 'light' | 'dark';

/** Keep shadcn `.dark` and MF `data-rmf-theme` in sync (document + optional mount root). */
export function applyModuleTheme(
  theme: ModuleTheme,
  mountRoot?: HTMLElement | null
): void {
  document.documentElement.dataset.rmfTheme = theme;
  document.documentElement.classList.toggle('dark', theme === 'dark');

  if (mountRoot) {
    mountRoot.dataset.rmfTheme = theme;
    mountRoot.classList.toggle('dark', theme === 'dark');
  }
}
