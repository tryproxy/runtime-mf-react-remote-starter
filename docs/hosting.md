# Host the federation artifact

This remote is independently deployable. The shell only needs a public
`mf-manifest.json` URL plus CORS on that origin. Hosting is not tied to Vercel,
Firebase, or any product coordinate.

Local proof that `dist/` is enough:

```bash
pnpm build
pnpm verify:artifacts
pnpm preview
```

Then open `http://localhost:5004/mf-manifest.json` and
`http://localhost:5004/nav.json`. Both must be JSON, not the SPA HTML.

Platform-side shell env and redeploy:
[Deploy and host](https://github.com/tryproxy/runtime-mf-shell/blob/dev/docs/guide/deploy-hosting.md).

## What the origin must serve

Real files (never HTML fallbacks):

```text
mf-manifest.json
remoteEntry.js
nav.json
exposed mount JS/CSS named by the manifest
hashed chunks, fonts, and other assets
```

`index.html` is only for **standalone** routes (`/`, `/patterns`, …).

The current shell derives navigation as `{origin}/nav.json` from the
federation manifest URL (`navManifestUrlFromFederationEntry`). Host
`mf-manifest.json`, `remoteEntry.js`, and `nav.json` at the **origin root**,
not under a subdirectory.

Before pointing a shell at the origin, open:

```text
https://<remote-origin>/mf-manifest.json
https://<remote-origin>/nav.json
```

Checks:

- both responses are JSON;
- manifest `name` / `id` is `runtime_mf_react_remote_starter` until you rename;
- expose list includes `./mount`;
- `nav.json` `moduleId` is `starter` until you rename;
- every path named by the manifest exists on the same origin.

## SPA fallback

Many hosts rewrite unknown paths to `index.html`. That breaks the shell if
`mf-manifest.json`, `remoteEntry.js`, or `nav.json` return HTML.

Serve those three paths (and hashed `/assets/*`) as static files **before**
the SPA rewrite. Application routes such as `/patterns` still fall back to
`index.html`.

## CORS

The **browser** loads this origin from the **shell** page. Allow that shell
origin to GET:

- `mf-manifest.json`, `remoteEntry.js`, `nav.json`;
- hashed JS/CSS chunks;
- fonts and other assets named by the manifest.

Use **one** exact origin (no trailing slash) in
`Access-Control-Allow-Origin`. Do not put a comma-separated list in that
header. `*` is acceptable only for a public GET-only artifact with no
credentialed cross-origin requests.

## Caching

| File                                             | Policy                   |
| ------------------------------------------------ | ------------------------ |
| `mf-manifest.json`, `remoteEntry.js`, `nav.json` | Revalidate or `no-cache` |
| Hashed `/assets/*`                               | Long-lived `immutable`   |

Stable names must change in place when you ship a new remote. Hashed chunks
can stay cached forever.

## Independence

Deploy this remote on its own host and URL. Do not bundle it into the shell
build. After the URL exists, set the shell env
(`VITE_STARTER_REMOTE_MANIFEST_URL` in the example matrix) and redeploy the
**shell** — Vite bakes `VITE_*` at shell build time.

A deployed shell cannot load `http://localhost:5004`.

## Optional provider snippets

Copy and replace origins. None of these is the template default.

### nginx

```nginx
# Replace with the deployed shell origin (no trailing slash).
map $http_origin $rmf_cors {
  default "";
  "https://shell.example.com" $http_origin;
}

server {
  listen 443 ssl;
  server_name starter-remote.example.com;
  root /var/www/starter-remote/dist;

  add_header Access-Control-Allow-Origin $rmf_cors always;
  add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
  add_header Vary Origin always;

  location = /mf-manifest.json {
    add_header Cache-Control "no-cache";
    add_header Access-Control-Allow-Origin $rmf_cors always;
  }

  location = /remoteEntry.js {
    add_header Cache-Control "no-cache";
    add_header Access-Control-Allow-Origin $rmf_cors always;
  }

  location = /nav.json {
    add_header Cache-Control "no-cache";
    add_header Access-Control-Allow-Origin $rmf_cors always;
  }

  location /assets/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
    add_header Access-Control-Allow-Origin $rmf_cors always;
  }

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### Vercel

Copy [`vercel.json.example`](../vercel.json.example) to `vercel.json` in the
project that publishes `dist/`. Replace `https://shell.example.com` with the
real shell origin (one origin, no trailing slash). Do not commit a live
`vercel.json` in this template: Vercel applies that filename automatically.

Vercel serves files that exist on disk before rewrites. The exclusions in the
example still matter on hosts that rewrite first. Do not ship ASO, Firebase, or
a real product origin in this repository.
