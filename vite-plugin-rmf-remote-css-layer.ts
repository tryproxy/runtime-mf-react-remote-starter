import type { Plugin } from 'vite';

const LAYER = 'rmf-remote';
const SPECIAL_QUERY_RE = /[?&](?:inline|raw|url)\b/;

/**
 * Demote the remote's compiled stylesheets into `@layer rmf-remote` so the
 * shell (which declares `rmf-remote` before its own theme/base/utilities) keeps
 * winning on colliding utilities like `.hidden` vs `.md:flex`.
 *
 * Keep this plugin after `tailwindcss()` in Vite config. Both transforms run
 * with `enforce: 'pre'`, so registration order lets this wrap Tailwind's output
 * before Vite converts development CSS into a JavaScript style module.
 *
 * Class names stay global so body portals (Select/Dialog/Sonner) still work.
 */
export function rmfRemoteCssLayer(): Plugin {
  return {
    name: 'rmf-remote-css-layer',
    enforce: 'pre',
    transform(css, id) {
      const path = id.split('?', 1)[0];
      if (!path.endsWith('.css') || SPECIAL_QUERY_RE.test(id)) {
        return null;
      }

      if (
        css.includes(`@layer ${LAYER}{`) ||
        css.includes(`@layer ${LAYER} {`)
      ) {
        return null;
      }

      return demoteCssToLayer(css, LAYER);
    },
  };
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
