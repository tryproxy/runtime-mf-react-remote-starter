import type { Plugin } from 'vite';
import { serializeRemoteNavManifest } from './src/app/model/nav-manifest';

/**
 * Serve / emit `nav.json` from the same TS source as routes + ModuleNav.
 * PoC: shell fetches this before mounting the remote UI.
 */
export function rmfNavJson(): Plugin {
  const source = serializeRemoteNavManifest();

  return {
    name: 'rmf-nav-json',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split('?')[0];
        if (path !== '/nav.json') {
          next();
          return;
        }
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(source);
      });
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'nav.json',
        source,
      });
    },
  };
}
