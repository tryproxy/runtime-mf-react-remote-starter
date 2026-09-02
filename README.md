# Runtime MF React remote starter

Use this repository as a one-time starting point for a Vite + React product
that runs in two modes:

1. **Standalone** — a normal SPA started with `pnpm dev` or `pnpm preview`.
2. **Embedded** — a Runtime MF host loads the remote's `./mount` lifecycle
   entry and supplies theme, locale, session, navigation, and telemetry through
   `HostBridge`.

Copy the repository into a new product repository before adding product code.
The copy does not receive later starter changes automatically.

## Start here

| Goal                                                                           | Read                                                  |
| ------------------------------------------------------------------------------ | ----------------------------------------------------- |
| Run and rename the starter                                                     | This README                                           |
| Understand `./mount`, `HostBridge`, auth, navigation, and the platform handoff | [Runtime MF integration](./docs/integration.md)       |
| Build responsive and accessible product UI                                     | [Style guide](./docs/style-guide.md)                  |
| Publish the remote artifact                                                    | [Hosting](./docs/hosting.md)                          |
| Check supported dependency versions                                            | [Compatibility](./docs/compatibility.md)              |
| Inspect the neutral visual baseline                                            | [Visual reference](./docs/visual-reference/README.md) |

The complete documentation map is also available in
[`docs/README.md`](./docs/README.md).

## Prerequisites

- Node `22.13.0` or newer (`.node-version` records `22.13.0`)
- pnpm `11.25.0` through Corepack

## Run it

```bash
pnpm ci
pnpm dev
```

Open both standalone starter pages:

- `http://localhost:5004/#/` — the product page to replace first;
- `http://localhost:5004/#/patterns` — removable examples for forms, overlays, notifications,
  responsive layout, locale, and theme behavior.

The development server must also return JSON from:

```text
http://localhost:5004/mf-manifest.json
http://localhost:5004/nav.json
```

Run the complete local gate before handing the remote to the platform team:

```bash
pnpm test
pnpm lint
pnpm build
pnpm verify:artifacts
```

Then run `pnpm preview` and inspect the production build manually. Stop the
preview server when inspection is complete.

`pnpm ci` is the frozen-lockfile install for CI and fresh clones. Use
`pnpm install` during normal dependency work.

## 1. Rename the starter

Rename it before writing product pages. These identifiers are related, but
they are not interchangeable:

- **module id** — identity cross-check in `nav.json` and the host catalog;
- **federation name** — producer identity in `mf-manifest.json`;
- **basename** — host-owned URL prefix supplied to `mount()`;
- **federation alias** — host-owned name used to request `<alias>/mount`.

Remote-owned values live in [`remote.config.ts`](./remote.config.ts). Keep that
module serializable: no DOM access, `import.meta.env`, or host imports.

| Coordinate      | Starter value                     | Change in                                               |
| --------------- | --------------------------------- | ------------------------------------------------------- |
| Package name    | `runtime-mf-react-remote-starter` | `package.json` (`name`, repository metadata)            |
| Module id       | `starter`                         | `remote.config.ts`; `scripts/verify-artifacts.mjs`      |
| Federation name | `runtime_mf_react_remote_starter` | `remote.config.ts`; `scripts/verify-artifacts.mjs`      |
| Display name    | `Starter Remote`                  | `remote.config.ts`, `index.html`, locale files          |
| Local port      | `5004`                            | `remote.config.ts`, local examples in `docs/hosting.md` |

The platform team assigns or approves the basename, module id, and host-side
federation alias. Do not hardcode the basename in remote routes: the embedded
router receives it from `mount()`.

After renaming, search for the old starter values and update the artifact
verification expectations so CI checks the new identity.

## 2. Replace the example product surface

Pages have one source of truth:

[`src/app/model/nav-manifest.ts`](./src/app/model/nav-manifest.ts)

It drives React Router, standalone navigation, and emitted `nav.json`. Map each
`page.id` to its component in
[`src/app/model/page-element.ts`](./src/app/model/page-element.ts). Do not add a
second route table.

Page segments are relative to the supplied basename:

```text
""         -> the remote index
"orders"   -> /orders inside the remote
```

Segments never include a product basename such as `/starter`. English and
Russian labels are required; Spanish is optional and falls back to English.

When adding or removing a page, update:

1. `src/app/model/nav-manifest.ts`;
2. `src/app/model/page-element.ts`;
3. the focused nav test;
4. `expectedPages` in `scripts/verify-artifacts.mjs`.

When product UI is ready, remove the example Patterns page:

1. delete `src/pages/patterns/`;
2. remove it from the nav manifest and page mapping;
3. update the nav test and artifact expectations;
4. remove unused translations, primitives, and dependencies.

Keep the empty-segment Overview route until the first real product page
replaces it.

## 3. Use the host contract

Embedded mode is already wired. `RemoteApp` subscribes to the host theme and
locale, scopes them to the mount root, creates mount-owned portal and toast
providers, and exposes `HostBridge` to product components.

Product code normally uses:

```ts
import { createHostFetch, requestSignOut, useHostBridge } from '@/shared/lib';

const bridge = useHostBridge();

if (!bridge) {
  throw new Error('HostBridge is only available below the provider.');
}

const hostFetch = createHostFetch(bridge.auth.http);
await hostFetch('/api/orders');

bridge.navigation.navigate('/another-module');
bridge.telemetry.captureException(error);
await requestSignOut(bridge);
```

The important rules are:

- never read or write host credentials in remote storage;
- request a bearer token immediately before each HTTP request, or use
  `credentials: 'include'` when the host selects cookie mode;
- keep API base URLs and API-specific protocols in the product remote;
- request sign-out through `bridge.auth.signOut()`;
- follow host theme and locale while embedded;
- use the supplied basename for product routes;
- use `bridge.navigation` only for host-level destinations;
- report errors and events through `bridge.telemetry`.

Read the complete local contract and examples in
[Runtime MF integration](./docs/integration.md).

## 4. Keep each mount isolated

Create mutable session state inside the mount tree (`RemoteApp` or its
providers): i18n, router, QueryClient, API client, portals, and notifications.
Do not keep mutable session state at module scope. Two simultaneous mounts may
receive different theme, locale, auth, and navigation snapshots.

`@platform/runtime-mf-adapters/react` owns React unmount; product providers
must clean up subscriptions, requests, timers, portals, and global listeners.

Standalone boot belongs to `src/app/main.tsx`. Do not import it from the
federated `./mount` graph. Standalone storage, PWA registration, analytics, and
`html`/`body` ownership must remain on the standalone path.

## 5. Keep CSS and overlays inside the remote

- Embedded CSS comes from `src/app/styles/index.css` and is placed in the
  low-priority `@layer rmf-remote`. Tailwind runtime defaults are scoped to
  `[data-rmf-root]` and `[data-rmf-portal-root]`; generated utility selectors
  remain global inside that layer, so product CSS must not target host markup.
- Standalone document CSS comes from `src/app/styles/standalone.css` and may
  own `html`, `body`, and `#root` only in standalone mode.
- Host `--rmf-*` values are inputs. Do not redefine them in embedded CSS.
- Dialog, Select, Dropdown Menu, Tooltip, and Toast use the mount-owned portal
  root. Do not portal to `document.body`.
- Do not lock document scroll or hide DOM outside the mount.
- Keep `shared: {}` in federation config: this remote owns React and ReactDOM.

The normative UI rules are in the [style guide](./docs/style-guide.md).

## 6. Publish and hand off

Build and publish `dist/` on the remote's own origin. The host references the
published federation artifact; it does not compile this source repository.

Before implementation, get the approved module id, basename, host origins, and
credential-policy expectations from the platform team. Before handoff, verify
that the deployed origin serves:

```text
https://<remote-origin>/mf-manifest.json
https://<remote-origin>/remoteEntry.js
https://<remote-origin>/nav.json
https://<remote-origin>/assets/...
```

The platform team owns host catalog registration and acceptance tests. The
product team owns the remote source, API URLs, deployment, and `nav.json`.

See [Hosting](./docs/hosting.md) for CORS, cache, SPA fallback, and provider
examples. Use the canonical input and output checklists in
[Runtime MF integration](./docs/integration.md#integration-handoff).

## Do not

- Import host source code or another remote's source code.
- Read or write host tokens in `localStorage`, cookies, or remote-managed
  persistent storage.
- Hardcode the host basename inside the embedded router.
- Add React or ReactDOM to the federation shared scope.
- Portal overlays to `document.body`.
- Let embedded CSS own `html`, `body`, `#root`, or host chrome.
- Ship a manifest or `nav.json` path that returns SPA HTML instead of JSON.
- Point a deployed host at a localhost remote URL.

## Compatibility and maintenance

The pinned baseline is recorded in
[`docs/compatibility.md`](./docs/compatibility.md). Contract and adapter
dependencies use immutable git tags or exact commits, never floating branches.

A product repository is a one-time copy:

- the platform team maintains this starter and publishes new baselines;
- a product team owns its copied repository, lockfile, dependencies, and
  deployment;
- later starter fixes are adopted deliberately by copying or cherry-picking;
- a product is not required to follow every starter commit.

Use an immutable starter tag or exact commit in handoff records so both teams
can identify the baseline that was copied.

## Source map

| Surface                         | Role                                         |
| ------------------------------- | -------------------------------------------- |
| `./mount`                       | Runtime MF lifecycle entry                   |
| `src/app/main.tsx`              | Standalone entry                             |
| `src/app/entry/mount.tsx`       | Embedded React adapter entry                 |
| `src/app/entry/remote-app.tsx`  | Embedded providers and bridge subscriptions  |
| `src/shared/lib/host-auth.ts`   | Bearer/cookie HTTP and host sign-out helpers |
| `src/app/model/nav-manifest.ts` | Route and `nav.json` source                  |
| `src/app/model/page-element.ts` | Page id to React element mapping             |
| `src/shared/ui/remote-portal/`  | Mount-owned overlay destination              |
| `src/app/styles/index.css`      | Embedded-safe CSS                            |
| `src/app/styles/standalone.css` | Standalone document CSS                      |
| `scripts/verify-artifacts.mjs`  | Federation, CSS, identity, and route gate    |
| `docs/integration.md`           | Host contract and handoff guide              |
| `docs/hosting.md`               | Independent deployment rules                 |
