import type { Plugin } from 'vite';

const LAYER = 'rmf-remote';
const NON_EMBEDDED_QUERY_RE = /[?&](?:inline|raw|standalone|url)\b/;
const EMBEDDED_STYLE_SUFFIX = '/src/app/styles/index.css';
const REMOTE_ROOT_SCOPE = ':where([data-rmf-root],[data-rmf-portal-root])';

/**
 * Demote the remote's compiled stylesheets into `@layer rmf-remote` so the
 * shell (which declares `rmf-remote` before its own theme/base/utilities) keeps
 * winning on colliding utilities like `.hidden` vs `.md:flex`.
 *
 * Keep this plugin after `tailwindcss()` in Vite config. Both transforms run
 * with `enforce: 'pre'`, so registration order lets this wrap Tailwind's output
 * before Vite converts development CSS into a JavaScript style module.
 *
 * Class names stay global inside the low-priority layer. Document defaults and
 * Tailwind's generated custom-property initializers are scoped to roots owned
 * by the remote.
 */
export function rmfRemoteCssLayer(): Plugin {
  return {
    name: 'rmf-remote-css-layer',
    enforce: 'pre',
    transform(css, id) {
      const path = id.split('?', 1)[0];
      const normalizedPath = path.replaceAll('\\', '/');

      if (
        !normalizedPath.endsWith(EMBEDDED_STYLE_SUFFIX) ||
        NON_EMBEDDED_QUERY_RE.test(id)
      ) {
        return null;
      }

      if (
        css.includes(`@layer ${LAYER}{`) ||
        css.includes(`@layer ${LAYER} {`)
      ) {
        return null;
      }

      return demoteCssToLayer(scopeTailwindRuntimeDefaults(css), LAYER);
    },
  };
}

function scopeTailwindRuntimeDefaults(css: string): string {
  const scopedUniversalProperties = [
    REMOTE_ROOT_SCOPE,
    `${REMOTE_ROOT_SCOPE} *`,
    `${REMOTE_ROOT_SCOPE} *::before`,
    `${REMOTE_ROOT_SCOPE} *::after`,
    `${REMOTE_ROOT_SCOPE}::backdrop`,
  ].join(',');

  return css
    .replaceAll(':root, :host', REMOTE_ROOT_SCOPE)
    .replaceAll(':root,:host', REMOTE_ROOT_SCOPE)
    .replace(
      /\*\s*,\s*::?before\s*,\s*::?after\s*,\s*::backdrop/g,
      scopedUniversalProperties
    );
}

function demoteCssToLayer(css: string, layer: string): string {
  // `@property` must stay at the stylesheet top level.
  const properties: string[] = [];
  const withoutProperties = css.replace(
    /@property\s+[^{]+\{[^}]*\}/g,
    (match) => {
      properties.push(match);
      return '';
    }
  );

  return `${properties.join('')}\n@layer ${layer}{\n${withoutProperties}\n}`;
}
