import type { NavManifest } from '@platform/runtime-mf-contract';
import { remoteConfig } from '../../../remote.config';

/** Single source for React remote pages (routes + standalone nav + nav.json emit). */
export const remoteNavManifest = {
  contractVersion: 1,
  moduleId: remoteConfig.moduleId,
  pages: [
    {
      id: 'overview',
      segment: '',
      label: { en: 'Overview', ru: 'Обзор', es: 'Resumen' },
    },
    {
      id: 'details',
      segment: 'details',
      label: { en: 'Details', ru: 'Детали', es: 'Detalles' },
    },
    {
      id: 'about',
      segment: 'about',
      label: { en: 'About', ru: 'О модуле', es: 'Acerca de' },
    },
    {
      id: 'form',
      segment: 'form',
      label: { en: 'Form', ru: 'Форма', es: 'Formulario' },
    },
    {
      id: 'crash',
      segment: 'crash',
      label: { en: 'Crash test', ru: 'Тест падения', es: 'Prueba de fallo' },
    },
  ],
} as const satisfies NavManifest;

export type RemoteNavPageId = (typeof remoteNavManifest.pages)[number]['id'];

/** React Router path for a manifest segment (`""` → `/`). */
export function navPagePath(segment: string): string {
  return segment ? `/${segment}` : '/';
}

/** Exact payload served in dev and emitted as dist/nav.json. */
export function serializeRemoteNavManifest(): string {
  return `${JSON.stringify(remoteNavManifest, null, 2)}\n`;
}
