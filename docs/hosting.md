# Host the federation artifact

Build and publish this remote independently. Publish its `dist/` directory on
the product's remote origin and give the platform team the resulting
`mf-manifest.json` URL. The host references that URL; it does not compile this
source repository.

Prove locally that `dist/` is complete:

```bash
pnpm build
pnpm verify:artifacts
```

Run `pnpm preview` separately for manual production-build inspection, then stop
the server when finished.

Then open `http://localhost:5004/mf-manifest.json` and
`http://localhost:5004/nav.json`. Both must be JSON rather than SPA HTML.

## Required files

The deployed origin must serve real files for:

```text
mf-manifest.json
remoteEntry.js
nav.json
exposed mount JS/CSS named by the manifest
hashed chunks, fonts, and other named assets
```

`index.html` is the standalone entry. The current standalone router uses hash
URLs such as `/#/` and `/#/patterns`.

Keep `mf-manifest.json`, `remoteEntry.js`, and `nav.json` at the origin root.
The host derives `{origin}/nav.json` from the federation manifest URL.

Before handoff, open:

```text
https://<remote-origin>/mf-manifest.json
https://<remote-origin>/nav.json
```

Confirm:

- both responses are JSON;
- manifest `name` and `id` match the renamed federation name;
- the expose list includes `./mount`;
- `nav.json.moduleId` matches the agreed module id;
- every JS, CSS, font, and asset path named by the manifest exists;
- browser requests from every approved host origin receive valid CORS headers.

## SPA fallback

Many providers rewrite unknown paths to `index.html`. The current HashRouter
does not require server fallback for its page routes, but a fallback is still
common provider configuration and may be required if a product later chooses
history-based standalone routes. It breaks federation if an artifact request
returns HTML.

Serve `mf-manifest.json`, `remoteEntry.js`, `nav.json`, and `/assets/*` as
static files before applying the SPA fallback. Only application routes should
fall back to `index.html`.

## CORS

The browser loads the remote origin from the host page. Allow approved host
origins to GET:

- `mf-manifest.json`, `remoteEntry.js`, and `nav.json`;
- hashed JavaScript and CSS chunks;
- fonts and other assets named by the manifest.

Return one exact allowed origin, without a trailing slash, in each
`Access-Control-Allow-Origin` response. If development, staging, and production
hosts are allowed, validate the request origin against an allowlist and echo
the single matching value. Do not emit a comma-separated origin list.

`*` is acceptable only when the federation artifact is intentionally public
and its cross-origin GET requests carry no credentials.

## Caching

| File                                             | Policy                   |
| ------------------------------------------------ | ------------------------ |
| `mf-manifest.json`, `remoteEntry.js`, `nav.json` | Revalidate or `no-cache` |
| Hashed `/assets/*`                               | Long-lived `immutable`   |

Stable entry files must be revalidated when a release changes. Content-hashed
chunks may remain cached indefinitely.

## Release handoff

Use the canonical platform-input and product-output checklists in
[Runtime MF integration](./integration.md#integration-handoff). A deployed
host cannot load a remote from `localhost`.

## Optional provider examples

Replace every example hostname before using these snippets in a product.

### nginx

```nginx
# Replace with an approved host origin (no trailing slash).
map $http_origin $rmf_cors {
  default "";
  "https://host.example.com" $http_origin;
}

server {
  listen 443 ssl;
  server_name remote.example.com;
  root /var/www/remote/dist;

  add_header Access-Control-Allow-Origin $rmf_cors always;
  add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
  add_header Vary Origin always;

  location = /mf-manifest.json {
    add_header Cache-Control "no-cache";
    add_header Access-Control-Allow-Origin $rmf_cors always;
    add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
    add_header Vary Origin always;
  }

  location = /remoteEntry.js {
    add_header Cache-Control "no-cache";
    add_header Access-Control-Allow-Origin $rmf_cors always;
    add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
    add_header Vary Origin always;
  }

  location = /nav.json {
    add_header Cache-Control "no-cache";
    add_header Access-Control-Allow-Origin $rmf_cors always;
    add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
    add_header Vary Origin always;
  }

  location /assets/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
    add_header Access-Control-Allow-Origin $rmf_cors always;
    add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
    add_header Vary Origin always;
  }

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### Vercel

Copy [`vercel.json.example`](../vercel.json.example) to `vercel.json` in the
product repository that publishes `dist/`. Replace the example host origin
with the real allowed origin.

Vercel serves existing static files before applying SPA rewrites. Ensure
`mf-manifest.json`, `remoteEntry.js`, `nav.json`, and `/assets/*` are always
served as files rather than rewritten to `index.html`.
