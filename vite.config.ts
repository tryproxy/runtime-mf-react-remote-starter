import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import { federation } from '@module-federation/vite';
import { rmfNavJson } from './vite-plugin-rmf-nav-json';
import { rmfRemoteCssLayer } from './vite-plugin-rmf-remote-css-layer';
import { remoteConfig } from './remote.config';

// The client-only React build does not emit the plugin's default SSR entry.
function omitUnavailableSsrEntry(stats: Record<string, unknown>) {
  const metaData = stats.metaData;

  if (typeof metaData !== 'object' || metaData === null) {
    return stats;
  }

  const clientMetaData = Object.fromEntries(
    Object.entries(metaData).filter(([key]) => key !== 'ssrRemoteEntry')
  );

  return {
    ...stats,
    metaData: clientMetaData,
  };
}

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', { target: '19' }]],
      },
    }),
    tailwindcss(),
    viteTsconfigPaths(),
    svgr({
      include: '**/*.svg?react',
    }),
    federation({
      name: remoteConfig.federationName,
      filename: 'remoteEntry.js',
      manifest: {
        additionalData: ({ stats }) => omitUnavailableSsrEntry(stats),
      },
      dts: false,
      shared: {},
      bundleAllCSS: false,
      exposes: {
        './mount': './src/app/entry/index.ts',
      },
    }),
    rmfNavJson(),
    rmfRemoteCssLayer(),
  ],
  server: {
    origin: `http://localhost:${remoteConfig.localPort}`,
    port: remoteConfig.localPort,
    strictPort: true,
    cors: true,
    // The remote can be loaded by a built shell without Vite's React Refresh
    // preamble. Avoid host-owned $RefreshSig$/$RefreshReg$ globals in exposes.
    hmr: false,
  },
  preview: {
    port: remoteConfig.localPort,
    strictPort: true,
    cors: true,
  },
  build: {
    target: 'esnext',
  },
});
