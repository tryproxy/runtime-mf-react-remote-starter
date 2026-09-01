# Runtime MF React remote starter

Use this template to start a Vite + React application that:

1. **Standalone** — `pnpm dev` / `pnpm preview` is a normal SPA (`src/app/main.tsx`).
2. **Embedded** — `runtime-mf-shell` loads `./mount` through Module Federation and
   the Runtime MF lifecycle contract.

GitHub's **Use this template** flag is a later publication step. Until it is
on, clone or copy this repository, then rename the coordinates below.

The template copy is one-shot. It does not subscribe you to later starter
commits. See [Maintenance](#maintenance).

[Hosting](./docs/hosting.md) ·
[Style guide](./docs/style-guide.md) ·
[Compatibility](./docs/compatibility.md) ·
[Shell guides](https://github.com/tryproxy/runtime-mf-shell/blob/dev/docs/guide/README.md)

## Prerequisites

- Node `22.12.0` or newer (`.node-version` records `22.12.0`; `engines` is
  `>=22.12.0`)
- pnpm `11.25.0` via Corepack (`packageManager` in `package.json`)

```bash
pnpm ci
pnpm dev
```

Everyday local install can be `pnpm install`. Use `pnpm ci` for a clean,
lockfile-frozen install (CI and a fresh clone).

Standalone: `http://localhost:5004`. Confirm
`http://localhost:5004/mf-manifest.json` and `http://localhost:5004/nav.json`
are JSON.

```bash
pnpm test
pnpm build
pnpm verify:artifacts
pnpm preview
```

Git-hosted `@platform/runtime-mf-contract` and `@platform/runtime-mf-adapters`
must run `prepare` so `dist` exists. Their repo URLs are listed in
`pnpm-workspace.yaml` `allowBuilds`. Those keys are the repository, not a
tarball+SHA, so bumping a tag does not require editing `allowBuilds`.

## Rename

Do this before writing product pages. `moduleId`, federation `name`, and the
shell alias are **different** identifiers.

Remote-owned values live in [`remote.config.ts`](./remote.config.ts). That
module must stay serializable: no DOM, `import.meta.env`, or shell imports.
Vite, `nav.json`, and standalone title read it. Shell alias, env name, route
approval, and deploy URL stay in the shell.

The embedded router uses the `basename` argument to `mount()`. It does not
fall back to `/starter`.

### Remote-owned

| Coordinate          | Baseline                          | Change in                                                                                                        |
| ------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Package name        | `runtime-mf-react-remote-starter` | `package.json` (`name`, `repository`, `bugs`, `homepage`)                                                        |
| Module id           | `starter`                         | `remote.config.ts` → `nav.json`; `scripts/verify-artifacts.mjs` (`nav.moduleId`)                                 |
| Federation producer | `runtime_mf_react_remote_starter` | `remote.config.ts` → `mf-manifest.json` `id`/`name`; `scripts/verify-artifacts.mjs`                              |
| Display name        | `Starter Remote`                  | `remote.config.ts` (`document.title`); `index.html`; `src/shared/i18n/locales/{en,ru,es}.ts` (`nav.moduleTitle`) |
| Local port          | `5004`                            | `remote.config.ts`; hosting examples in `docs/hosting.md`                                                        |

Pick an unused port. Locally `5000`–`5004` are taken by shell, React demo,
Angular, ASO, and this starter.

### Shell-owned (do not import from this repo)

| Coordinate                    | Baseline                             |
| ----------------------------- | ------------------------------------ |
| Route / basename              | `/starter`                           |
| Federation alias              | `starter_remote`                     |
| Load request                  | `starter_remote/mount`               |
| Manifest environment variable | `VITE_STARTER_REMOTE_MANIFEST_URL`   |
| Example remote origin         | `https://starter-remote.example.com` |
| Example shell origin          | `https://shell.example.com`          |

After rename, grep the old strings (`starter`, `runtime_mf_react_remote_starter`,
`5004`, `Starter Remote`) and update `verify-artifacts.mjs` so CI still matches
your identity.

## Routes and `nav.json`

One TypeScript source projects into React Router, standalone nav, and
`nav.json`:

[`src/app/model/nav-manifest.ts`](./src/app/model/nav-manifest.ts)

Then map `page.id` → component in
[`src/app/model/page-element.ts`](./src/app/model/page-element.ts).
`App` iterates `remoteNavManifest.pages`; do not add a parallel route table.

Segments are relative to the shell basename (`""` → `/`, `"patterns"` →
`/patterns`). They never include `/starter`.

Labels: `en` and `ru` are required; `es` is optional. This starter includes
all three.

`vite-plugin-rmf-nav-json.ts` serves `/nav.json` in dev and emits it in
`dist/`. The current shell resolves nav as `{origin}/nav.json` from the
federation manifest URL, so host those files at the **origin root**.

When you add or remove a page, also update `expectedPages` in
`scripts/verify-artifacts.mjs` and the focused nav test.

## HostBridge

Embedded `RemoteApp` already subscribes to theme and locale, scopes them to
the mount root, and wraps the tree in `HostBridgeProvider`. Product code:

```ts
import { createHostFetch, requestSignOut, useHostBridge } from '@/shared/lib';

const bridge = useHostBridge();
if (!bridge) {
  throw new Error('HostBridge is only available below the provider.');
}

const hostFetch = createHostFetch(bridge.auth.http);
await hostFetch('/api/orders');

bridge.navigation.navigate('/other-module');
bridge.telemetry.captureException(error);
await requestSignOut(bridge);
```

| Need       | Use                                                                                                                                                            |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Theme      | Already applied on `[data-rmf-root]`. `useBridgeTheme(bridge)` if you need the mode.                                                                           |
| Locale     | Already applied to i18n and `lang`. Follow `bridge.i18n`; do not override the shell locale while embedded.                                                     |
| HTTP       | `createHostFetch(bridge.auth.http)` — bearer: fresh `getAccessToken()` per request, never cached by the remote; cookie: `credentials: 'include'`, no JS token. |
| Sign-out   | `requestSignOut(bridge)` → `bridge.auth.signOut()`. Do not clear host storage.                                                                                 |
| Navigation | Stay under `basename` with React Router. `bridge.navigation.navigate` / `replace` for shell-level paths.                                                       |
| Telemetry  | `bridge.telemetry`. The embedded error boundary already reports through it. Standalone uses `console.error`.                                                   |

`createMockHostBridge` from the contract is standalone-only.

More:
[HostBridge](https://github.com/tryproxy/runtime-mf-shell/blob/dev/docs/guide/host-bridge.md).

## Per-mount session state

Create i18n, router, portal/toast providers, and any QueryClient / API client
**inside** the mount (`RemoteApp` / `mount.tsx`), not at module scope.

Module-level files may export contexts and types. They must not hold mutable
session data. Two simultaneous mounts can receive different theme and locale
snapshots. Unmount is owned by `@platform/runtime-mf-adapters/react` plus
React provider cleanup.

Do not import `src/app/main.tsx` from `./mount`. Standalone storage, document
`html`/`body` ownership, PWA, and analytics stay on the standalone boot path.

## CSS and portals

- Embedded CSS: `src/app/styles/index.css` imported from `mount.tsx`. Scoped to
  `[data-rmf-root]` / `[data-rmf-portal-root]`, wrapped in `@layer rmf-remote`.
  Do not redeclare host `--rmf-*` tokens.
- Standalone CSS: `src/app/styles/standalone.css` imported only from
  `main.tsx`. That graph may own `html` / `body` / `#root`.
- Portals: default container is the mount-owned `[data-rmf-portal-root]`. Do
  not portal to `document.body`. Overlays stay in the remote slot. Do not lock
  `html`/`body` scroll or set `aria-hidden` on shell siblings.
- `shared: {}` — this remote owns React and ReactDOM.

Normative rules and the visual allowlist:
[style guide](./docs/style-guide.md) and
[visual reference](./docs/visual-reference/README.md).

## Hosting

Publish `dist/` as its own origin. The shell only needs that origin’s
`mf-manifest.json` URL plus CORS. It does not build this repository.

Requirements (SPA fallback, CORS, cache, independence):
[docs/hosting.md](./docs/hosting.md).

There is no default `vercel.json` (Vercel would apply it automatically). Copy
[`vercel.json.example`](./vercel.json.example) if you deploy on Vercel.
Optional nginx is in the hosting doc. Examples use `https://shell.example.com`
only.

## Register in the shell

A **new** remote still needs a static shell change and a shell redeploy.
Updating the artifact at the same manifest URL does not.

Local shell env (after you rename, replace `STARTER` / `starter` / `5004`):

```dotenv
VITE_STARTER_REMOTE_MANIFEST_URL=http://localhost:5004/mf-manifest.json
```

Composition sketch (shell repo, not this repo):

```ts
const starterManifestUrl = import.meta.env.VITE_STARTER_REMOTE_MANIFEST_URL;

// remoteRequests
starter: 'starter_remote/mount',

// remotes[]
...(starterManifestUrl
  ? [
      {
        name: 'runtime_mf_react_remote_starter',
        alias: 'starter_remote',
        entry: starterManifestUrl,
      },
    ]
  : []),
```

```ts
{
  id: 'starter',
  path: 'starter',
  labelKey: 'nav.starter',
  descriptionKey: 'nav.starterDesc',
  pages: [], // filled from remote nav.json
}
```

```ts
// src/app/remote-navigation/remote-nav-sources.ts
starterManifestUrl
  ? [{ moduleId: 'starter', federationEntryUrl: starterManifestUrl }]
  : [];
```

```tsx
<RemoteSlot
  remoteId="starter"
  basename="/starter"
  theme={theme}
  locale={toRemoteLocale(locale)}
/>
```

File list and i18n keys:
[Shell registration](https://github.com/tryproxy/runtime-mf-shell/blob/dev/docs/guide/shell-registration.md).

This starter is **not** permanently registered in the shell. Do not add it
there only to verify a copy.

Playwright lives in the shell, not here.

## Do not

- Import `runtime-mf-shell` source, or any other remote’s source
- Read or write the host token in `localStorage` / cookies
- Hardcode `/starter` (or any product basename) inside the embedded router
- Share React / ReactDOM with the shell (`shared` must stay `{}`)
- Portal overlays to `document.body`
- Let embedded CSS own `html`, `body`, `#root`, or shell chrome
- Put a live `vercel.json` in this template with a product origin
- Point a **deployed** shell at `http://localhost:5004`

## Pins and lineage

| Pin                 | Value                                        |
| ------------------- | -------------------------------------------- |
| Contract            | `github:tryproxy/runtime-mf-contract#v0.5.3` |
| Adapters            | `github:tryproxy/runtime-mf-adapters#v0.1.3` |
| Federation producer | `@module-federation/vite ^1.20.5`            |
| React               | `^19.1.1`                                    |
| Vite                | `^7.1.2`                                     |
| Tailwind            | `^4.1.12`                                    |
| Node                | `>=22.12.0`                                  |
| pnpm                | `11.25.0`                                    |

Never pin those git packages to `latest` or a floating branch. Use a tag
(`#vX.Y.Z`) or an exact commit.

Copied from `tryproxy/runtime-mf-module` `dev` @
`7de1c9cb3c4c2d092f332410cba42e14277a28ea` on 2026-08-29 (tracked files only).
Target `.git`, origin, and `.codegraph` were preserved. Source `.git`,
`.codegraph`, `node_modules`, `dist`, caches, and local `.env*` were not
copied.

`env.example` is public documentation. It must not contain secrets.

## Remove the patterns page

When the product has its own UI:

1. Delete `src/pages/patterns/`.
2. Remove it from `src/app/model/nav-manifest.ts` and
   `src/app/model/page-element.ts`.
3. Remove `patterns` from `src/app/model/nav-manifest.test.tsx` and from
   `expectedPages` in `scripts/verify-artifacts.mjs`.
4. Remove unused `patterns` translations, primitives, and dependencies.

Keep `overview` as the empty-segment route until you replace it with the first
real product surface.

## Maintenance

Creating a repository from this template is a one-time copy. There is no
automatic upgrade channel.

- **Tags** — starter releases are git tags.
- **Compatibility** — [docs/compatibility.md](./docs/compatibility.md) records
  this baseline against contract, adapters, federation, React, Vite, and
  Tailwind.
- **Ownership** — the platform team owns this repository, dependency and
  security updates, and new tags. Product copies own their own lockfiles and
  deploy.
- **After you copy** — adopt fixes by copying files or cherry-picking; do not
  treat `main` as a library you `pnpm update`.
- **Platform packages** — bump `#vX.Y.Z` in `package.json` only to published
  tags. Keep `allowBuilds` as git repository URLs (no tarball SHA).

## CI

Pull requests run frozen install, format, lint, Vitest, production build, and
`verify:artifacts`. The workflow does not use the shell, Playwright, or
repository secrets.

## Current surfaces

| Surface                         | Role                                         |
| ------------------------------- | -------------------------------------------- |
| `./mount`                       | Runtime MF lifecycle entry                   |
| `nav.json`                      | Shell child navigation                       |
| `src/app/main.tsx`              | Standalone entry                             |
| `src/app/entry/mount.tsx`       | Embedded entry (React adapter)               |
| `src/shared/lib/host-auth.ts`   | Bearer/cookie fetch and host sign-out        |
| `src/shared/ui/remote-portal/`  | Mount-owned overlay destination              |
| `src/app/styles/index.css`      | Embedded-safe CSS                            |
| `src/app/styles/standalone.css` | Standalone document CSS                      |
| `src/app/model/nav-manifest.ts` | Route + nav.json source                      |
| `src/pages/overview/`           | Default product page to replace              |
| `src/pages/patterns/`           | Optional removable UI reference              |
| `scripts/verify-artifacts.mjs`  | Federation / CSS / identity gate             |
| `docs/hosting.md`               | Independent deploy rules                     |
| `vercel.json.example`           | Optional Vercel copy, not applied by default |
