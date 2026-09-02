# Remote implementation reference

This is the complete implementation reference for a product remote derived
from this repository. Give this file to a developer or an AI agent when the
short README and focused guides do not provide enough context.

The target is a React application that remains usable as a standalone SPA and
can also be mounted by a compatible Runtime MF host. Product developers do not
need host source code. Integration happens through published artifacts and the
versioned runtime contract.

## How to use this reference

For a human: read **Non-negotiable invariants**, collect the platform inputs,
then follow the implementation workflow in order.

For an AI agent: treat this document as the implementation brief, then inspect
the current repository before editing. Preserve existing integration seams
unless the requested product behavior explicitly requires changing them.

### Source-of-truth order

When sources disagree, use this order:

1. installed `@platform/runtime-mf-contract` TypeScript and design-token
   exports;
2. the focused normative document for the subject: `integration.md` for the
   runtime boundary, `style-guide.md` for UI behavior, `hosting.md` for
   deployment, and `compatibility.md` for supported versions;
3. the current repository implementation and artifact verifier for concrete
   implementation facts not specified by the sources above;
4. this self-contained implementation snapshot;
5. screenshots, examples, and comments.

Self-contained means this file carries enough context to perform the work. It
does not make a copied summary more authoritative than its contract or focused
normative source.

Do not infer a public capability from host internals, another remote, or an old
example. Ask the platform team before changing a federation coordinate,
basename expectation, credential policy, or contract version.

## Baseline

This reference describes the `v0.1.0` starter baseline:

| Component                       | Version                                      |
| ------------------------------- | -------------------------------------------- |
| Node.js                         | `>=22.13.0`                                  |
| pnpm                            | `11.25.0`                                    |
| React / ReactDOM                | `^19.1.1`                                    |
| Vite                            | `^7.1.2`                                     |
| Tailwind CSS                    | `^4.1.12`                                    |
| `@module-federation/vite`       | `^1.20.5`                                    |
| `@platform/runtime-mf-contract` | `github:tryproxy/runtime-mf-contract#v0.5.4` |
| `@platform/runtime-mf-adapters` | `github:tryproxy/runtime-mf-adapters#v0.1.3` |

Contract and adapter dependencies must use immutable tags or exact commits.
Do not replace them with floating branches.

The version matrix, `HostBridge` type block, and design-token table below are
synchronized snapshots included so this file can stand alone. When upgrading
the starter, update them in the same change as `package.json`, the installed
contract, `compatibility.md`, `integration.md`, and `style-guide.md`, then let
TypeScript and the artifact verifier check the executable boundary.

## Bootstrap and inspect the starter

Install the frozen dependency graph and start the standalone development
server:

```bash
pnpm ci
pnpm dev
```

Open:

```text
http://localhost:5004/#/
http://localhost:5004/#/patterns
http://localhost:5004/mf-manifest.json
http://localhost:5004/nav.json
```

The first two URLs are replaceable standalone product surfaces. The last two
must return JSON. `5004` is only the starter's local port; use the configured
port after renaming.

Use `pnpm ci` for fresh clones and CI. Use `pnpm install` when intentionally
changing dependencies so the lockfile is updated.

## Non-negotiable invariants

Every derived product remote must preserve these properties:

- It runs as a standalone SPA and as an embedded remote.
- Federation exposes exactly one application lifecycle at `./mount`.
- `mount({ container, basename, bridge })` returns `unmount()` and may return
  `ready`.
- Each mount creates isolated mutable state and can be cleanly unmounted.
- Embedded routes are relative to the supplied `basename`.
- `nav.json` and React routes come from one TypeScript page definition.
- Embedded behavior consumes theme, locale, auth, navigation, and telemetry
  only through `HostBridge`.
- The remote never reads or writes host credential storage.
- Embedded CSS and portals stay inside remote-owned roots.
- React and ReactDOM remain remote-owned; federation keeps `shared: {}`.
- The remote is built and hosted independently from the host.
- `mf-manifest.json`, `remoteEntry.js`, `nav.json`, and referenced assets are
  real deployable files, never SPA fallback responses.

Product branding, business routes, API clients, state, translations, and
backend protocols may change. The invariants above are the integration seam.

## Ownership boundary

### Product team owns

- product source, pages, state, translations, validation, and accessibility;
- standalone application behavior;
- product API base URLs and backend-specific protocols;
- module id, federation producer name, and `nav.json`, subject to platform
  approval;
- the remote build, origin, CORS configuration, caching, and release process;
- cleanup of product resources created by each mount.

### Platform team owns

- the host catalog entry and top-level navigation group;
- the URL basename and host-side federation alias;
- manifest URL configuration for each environment;
- loading, readiness timeouts, retries, and remote failure containment;
- platform login, credential storage, and remote credential policy;
- current host theme, locale, session, location, and telemetry adapters;
- host-level acceptance tests.

Neither side imports the other side's application source. The public boundary
is `./mount`, `nav.json`, static federation artifacts, and `HostBridge`.

## Coordinates: agree once, rename consistently

These names are related but are not interchangeable:

| Coordinate          | Starter value                     | Owner / purpose                                      |
| ------------------- | --------------------------------- | ---------------------------------------------------- |
| Package name        | `runtime-mf-react-remote-starter` | Product repository identity                          |
| Module id           | `starter`                         | Cross-check between `nav.json` and platform catalog  |
| Federation name     | `runtime_mf_react_remote_starter` | Producer identity inside `mf-manifest.json`          |
| Display name        | `Starter Remote`                  | Standalone/product label                             |
| Local port          | `5004`                            | Local development only                               |
| Basename            | assigned by platform              | Host-owned URL prefix, for example `/orders`         |
| Federation alias    | assigned by platform              | Host request prefix, for example `orders_remote`     |
| Load request        | derived by platform               | Alias plus expose, for example `orders_remote/mount` |
| Manifest URL/origin | deployed by product               | Environment-specific artifact location               |

Remote-owned coordinates live in `remote.config.ts`. Keep it serializable and
environment-neutral. Host aliases, basenames, catalog labels, and environment
manifest URLs do not belong in that file.

The local port has no production meaning. Pick any unused local port and keep
the development examples consistent.

### Rename checklist

Before adding product code:

1. change `package.json` name and repository metadata;
2. change module id, federation name, display name, and local port in
   `remote.config.ts`;
3. update title and product translations;
4. update identity expectations in `scripts/verify-artifacts.mjs`;
5. search for old starter identifiers and classify every remaining match;
6. run the complete verification gate.

Do not hardcode the chosen basename into product routes. Embedded code receives
the authoritative value on every mount.

## Repository map

| Path                                  | Responsibility                                            |
| ------------------------------------- | --------------------------------------------------------- |
| `remote.config.ts`                    | Remote-owned coordinates                                  |
| `vite.config.ts`                      | Standalone build and federation producer                  |
| `src/app/main.tsx`                    | Standalone-only browser entry                             |
| `src/app/entry/index.ts`              | Public `./mount` export                                   |
| `src/app/entry/mount.tsx`             | React lifecycle adapter and embedded stylesheet import    |
| `src/app/entry/remote-app.tsx`        | Per-mount providers, theme/locale subscriptions           |
| `src/app/entry/standalone-app.tsx`    | Standalone-only state and mock bridge                     |
| `src/app/model/nav-manifest.ts`       | Page metadata, routes, standalone nav, emitted `nav.json` |
| `src/app/model/page-element.ts`       | Exhaustive page-id to React element mapping               |
| `src/shared/lib/host-auth.ts`         | Bearer/cookie request and host sign-out helpers           |
| `src/shared/ui/remote-portal/`        | Per-mount overlay destination                             |
| `src/app/styles/index.css`            | Embedded-safe application CSS                             |
| `src/app/styles/standalone.css`       | Standalone document/preflight CSS                         |
| `src/app/styles/tokens.css`           | Design-token and Tailwind/shadcn mapping                  |
| `vite-plugin-rmf-nav-json.ts`         | Dev serving and build emission of `nav.json`              |
| `vite-plugin-rmf-remote-css-layer.ts` | Embedded CSS containment and layer demotion               |
| `scripts/verify-artifacts.mjs`        | Artifact, route, identity, CSS, and design-token gate     |

## Dual-entry architecture

The standalone and embedded graphs intentionally start at different files.

### Standalone entry

`src/app/main.tsx` owns the standalone browser document. It may:

- create the `#root` React root;
- use `HashRouter`;
- set document title, `html` language, and theme markers;
- persist standalone locale or other standalone-only preferences;
- install standalone-only analytics, authentication, or PWA behavior when a
  product actually requires them.

The starter creates a mock `HostBridge` in standalone mode so product UI can
exercise the same component boundary. The mock is for local UI development;
it is not a production identity provider.

### Embedded entry

`src/app/entry/index.ts` exports `mount`. `src/app/entry/mount.tsx` imports only
embedded-safe CSS and delegates React lifecycle management to
`createReactRemoteMount`.

The embedded graph must not import `main.tsx`, standalone document CSS,
standalone storage bootstrap, service-worker registration, or product chrome
that duplicates the host.

Federation configuration must keep:

```ts
federation({
  name: remoteConfig.federationName,
  filename: 'remoteEntry.js',
  dts: false,
  shared: {},
  bundleAllCSS: false,
  exposes: {
    './mount': './src/app/entry/index.ts',
  },
});
```

The browser-only build removes a nonexistent SSR entry from manifest metadata.
Do not advertise an artifact the build does not emit.

## Lifecycle contract

The compatible host calls:

```ts
type MountRemoteApp = (params: {
  container: HTMLElement;
  basename: string;
  bridge: HostBridge;
}) => {
  ready?: Promise<void>;
  unmount(): void;
};
```

`container` is the only DOM region assigned to the application. `basename` is
the route namespace for this mount. `bridge` is the runtime service boundary.

The host may:

- mount the remote more than once during one browser session;
- unmount it when the user leaves, then mount it again later;
- mount two instances simultaneously with different inputs;
- abandon a mount after a timeout or render error;
- retry after the remote origin recovers.

Therefore create mutable resources per mount: React root, i18n instance,
router, API/query client, stores tied to the session, subscriptions, portals,
notifications, timers, requests, and event listeners. Module-scope immutable
configuration is fine; module-scope mutable session state is not.

`unmount()` must be safe and complete. It must remove or dispose everything
owned by that mount without touching host DOM or another mount.

If product initialization is asynchronous, expose a `ready` promise that
resolves only when the first usable surface is ready and rejects on terminal
startup failure. Do not use `ready` for background data that the page can load
after rendering.

## Routes and navigation

`src/app/model/nav-manifest.ts` is the single page metadata source. It drives:

- React Router routes;
- standalone module navigation;
- emitted and development `nav.json`.

Example:

```ts
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
      id: 'orders',
      segment: 'orders',
      label: { en: 'Orders', ru: 'Заказы', es: 'Pedidos' },
    },
  ],
} as const satisfies NavManifest;
```

Rules:

- `moduleId` matches the approved platform module id;
- page ids are unique and stable;
- `segment: ''` is the module index;
- other segments are relative, without a leading slash or basename;
- English and Russian labels are required by this starter; Spanish is
  optional and falls back to English;
- `page-element.ts` exhaustively maps every page id to a React element;
- `vite-plugin-rmf-nav-json.ts` serves and emits the same object.

Embedded mode uses `BrowserRouter basename={basename}`. Standalone mode uses
`HashRouter`, producing URLs such as `/#/orders`. Product route changes do not
require a second route table.

Use the router for paths inside the remote. Use
`bridge.navigation.navigate()` or `replace()` only for host-level destinations
outside the remote namespace.

When adding or removing a page, update:

1. `nav-manifest.ts`;
2. `page-element.ts`;
3. focused route/nav tests;
4. `expectedPages` in `scripts/verify-artifacts.mjs`.

Remove the example Patterns page once real product UI replaces it:

1. delete `src/pages/patterns/`;
2. remove the page from `nav-manifest.ts` and `page-element.ts`;
3. update the focused nav test and `expectedPages` in the artifact verifier;
4. remove unused translations, retained primitives, and dependencies.

Keep the empty-segment index route until the first real product page replaces
it.

## HostBridge contract

Host-owned changing values use `getSnapshot()` plus `subscribe()`. The pinned
surface is:

```ts
type HostSession = {
  userId: string;
  displayName?: string;
  roles: string[];
};

type HostLocation = {
  pathname: string;
  search: string;
  hash: string;
};

type TelemetryProps = Record<
  string,
  string | number | boolean | null | undefined
>;

type HostBridge = {
  theme: {
    getSnapshot(): { mode: 'light' | 'dark' };
    subscribe(listener: () => void): () => void;
  };
  i18n: {
    getSnapshot(): { locale: 'en' | 'ru' | 'es' };
    subscribe(listener: () => void): () => void;
  };
  auth: {
    getSnapshot(): HostSession | null;
    subscribe(listener: () => void): () => void;
    http: {
      mode: 'bearer' | 'cookie';
      getAccessToken?(): Promise<string | null>;
    };
    signOut(): Promise<void>;
  };
  navigation: {
    getSnapshot(): HostLocation;
    subscribe(listener: () => void): () => void;
    navigate(path: string): void;
    replace(path: string): void;
  };
  telemetry: {
    track(event: string, props?: TelemetryProps): void;
    captureException(error: unknown, props?: TelemetryProps): void;
    captureMessage(
      message: string,
      level?: 'info' | 'warning' | 'error',
      props?: TelemetryProps
    ): void;
  };
};
```

The installed contract package, not this copied type block, remains the
compiler source of truth.

### Theme and locale

Embedded UI follows host theme and locale without remounting. The starter's
`RemoteApp` already creates mount-owned i18n, subscribes to both facets, and
applies values below remote-owned roots.

Do not write embedded theme or locale state to `html`, `body`, host storage, or
host chrome. Do not render a competing embedded theme/locale selector unless
the product control changes product-owned state rather than platform state.

### Session and authorization

`auth.getSnapshot()` answers who the platform considers signed in. Treat roles
as useful UI context, not proof of backend permission. Backend authorization
is authoritative.

The host chooses the HTTP transport:

- `bearer`: call `getAccessToken()` immediately before each protected request;
- `cookie`: send the request with `credentials: 'include'` and do not expect a
  JavaScript token.

The starter helper implements both:

```ts
const apiFetch = createHostFetch(bridge.auth.http);
const response = await apiFetch(`${productApiBaseUrl}/orders`);
```

The host may expose bearer mode while returning `null` for a remote that has
no assigned credential policy. There is no public `none` transport mode.
`createHostFetch` rejects before issuing a protected request when no bearer is
available. Use ordinary `fetch` for endpoints intentionally designed to be
public; never manufacture an empty or unrelated `Authorization` header.

Rules:

- never inspect host `localStorage`, cookies, URL token parameters, or another
  remote;
- never persist or decode a value returned by `getAccessToken()` as a source
  of truth;
- keep product API base URLs in product configuration;
- keep API payloads, refresh/exchange details, and third-party grants out of
  `HostBridge`;
- do not add a second platform login to the embedded UI;
- call `bridge.auth.signOut()` on platform-session failure instead of clearing
  storage yourself;
- agree credential audience or backend exchange requirements before handoff.

Standalone-only login may be added behind the standalone entry when the
product needs it. It must not enter the federated graph or compete with the
host login when embedded.

### Navigation

Subscribe when product UI depends on later host location changes. Do not own
top-level browser history or infer the host layout. Internal product links stay
under the supplied basename.

### Telemetry

Use `track` for meaningful product events, `captureMessage` for operational
messages, and `captureException` for errors. Pass small primitive properties;
do not assume the host's telemetry vendor and do not send credentials or
sensitive request bodies.

## Design system boundary

The host publishes a small semantic token contract. It supplies appearance,
not product layout or host chrome.

| Token                      | Purpose                            |
| -------------------------- | ---------------------------------- |
| `--rmf-color-page`         | Page/canvas background             |
| `--rmf-color-fg`           | Default page text                  |
| `--rmf-color-surface`      | Card, panel, popover background    |
| `--rmf-color-surface-fg`   | Text on a surface                  |
| `--rmf-color-muted`        | Muted/secondary background         |
| `--rmf-color-muted-fg`     | Secondary text and labels          |
| `--rmf-color-primary`      | Primary action                     |
| `--rmf-color-primary-fg`   | Text/icon on primary               |
| `--rmf-color-secondary`    | Secondary action                   |
| `--rmf-color-secondary-fg` | Text/icon on secondary             |
| `--rmf-color-accent`       | Ghost/interactive hover background |
| `--rmf-color-accent-fg`    | Text/icon on accent                |
| `--rmf-color-destructive`  | Error/destructive action           |
| `--rmf-color-border`       | Dividers and structural borders    |
| `--rmf-color-input`        | Form-control chrome                |
| `--rmf-color-ring`         | Keyboard focus ring                |
| `--rmf-radius-md`          | Base control radius                |
| `--rmf-shadow-sm`          | Light elevation                    |
| `--rmf-font-sans`          | Shared sans-serif font stack       |

Tailwind v4 projects import the packaged aliases:

```css
@import '@platform/runtime-mf-contract/design-tokens/tailwind-v4.css';
```

Tailwind is not required to consume the contract. Plain CSS reads the same
custom properties directly:

```css
.product-card {
  color: var(--rmf-color-surface-fg, #18181b);
  background: var(--rmf-color-surface, #fff);
  border: 1px solid var(--rmf-color-border, #e4e4e7);
  border-radius: var(--rmf-radius-md, 0.625rem);
  box-shadow: var(--rmf-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.08));
}
```

The host supplies values in embedded mode. Standalone styles provide local
fallbacks. Embedded styles consume but never redefine `--rmf-*` properties.

Do not add spacing, breakpoints, sidebar, chart, business-status, or brand
tokens to the platform contract. Layout rhythm and business semantics belong
to the product. Derive smaller/larger radii from the base radius.

Shared colors alone do not guarantee UI parity. Use consistent component
recipes for control height, padding, typography, focus, disabled, error,
hover, and loading behavior. The normative product rules are in
[`style-guide.md`](./style-guide.md).

## CSS and portal containment

Embedded CSS comes from `src/app/styles/index.css`. The Vite containment plugin
places it in the low-priority `@layer rmf-remote` and scopes Tailwind runtime
defaults to:

```text
[data-rmf-root]
[data-rmf-portal-root]
```

Generated utility class names remain global inside that low-priority layer.
Product selectors must still target product markup, never host elements.

Standalone document CSS comes from `src/app/styles/standalone.css` and may own
`html`, `body`, and `#root` only because it is excluded from the federated
entry graph.

Embedded code must not:

- apply resets to `html`, `body`, `#root`, `:root`, or unscoped elements;
- redefine host `--rmf-*` inputs;
- assume a host sidebar width or page padding;
- create a second full-viewport page scroller;
- lock document scroll or set `aria-hidden` outside the mount;
- mutate host classes or styles;
- load standalone-only global CSS.

Dialog, Select, Dropdown Menu, Tooltip, and Toast must render below the
mount-owned `[data-rmf-portal-root]`. Do not portal to `document.body`.
Unmount must remove portal content, listeners, focus guards, timers, and
notifications.

## Responsive and interaction policy

The starter uses Tailwind's default viewport breakpoints:

| Name  | Minimum |
| ----- | ------: |
| `sm`  |   40rem |
| `md`  |   48rem |
| `lg`  |   64rem |
| `xl`  |   80rem |
| `2xl` |   96rem |

Viewport breakpoints are product-owned, not part of Runtime MF. Prefer
container queries for layouts whose available slot can be narrow inside a wide
browser. Do not copy host-only viewport names or derive layout from host chrome.

Required interaction behavior:

- controls have accessible names and visible keyboard focus;
- required help does not depend on hover;
- Select content aligns on first open and after relevant resize/scroll;
- dialogs and menus support keyboard navigation, Escape, and focus return;
- theme changes update page, controls, and overlays atomically;
- semantic color changes are not animated during global theme switching;
- motion honors `prefers-reduced-motion`;
- component files export components only, preserving Fast Refresh rules.

Use a Popover, disclosure, or inline region for persistent click/touch help.
Tooltip remains supplementary hover/focus help.

## Build artifacts

Development and production builds must provide:

```text
mf-manifest.json
remoteEntry.js
nav.json
index.html
exposed mount JavaScript and CSS
referenced chunks, fonts, images, and other assets
```

`vite-plugin-rmf-nav-json.ts` serves `/nav.json` during development and emits
it into `dist`. Federation emits the manifest, entry, expose, and chunks.

Before integration, verify:

- manifest `name` and `id` match the renamed federation name;
- exposes contain `./mount`;
- the manifest does not advertise a missing SSR entry;
- `nav.json.moduleId` matches the agreed module id;
- every manifest asset exists;
- embedded CSS contains remote roots and consumes every canonical token;
- embedded CSS contains no document-global ownership or host token
  definitions;
- standalone CSS retains its own base layer.

Do not remove or weaken `scripts/verify-artifacts.mjs` to make a failing build
pass. Update its identity and page expectations when intentionally renaming or
changing navigation.

## Hosting and release

Publish `dist/` on the product remote's own origin. The host references the
manifest URL; it does not compile or bundle this repository.

The origin must serve real files at the paths named by the manifest. The
current compatible host derives `/nav.json` from the `mf-manifest.json` origin,
so this starter keeps `mf-manifest.json`, `remoteEntry.js`, and `nav.json` at
that origin root. This is a current delivery convention, not a permanent
`NavManifest` contract capability. If a future platform registry supplies an
explicit navigation URL, use the agreed URL and include it in the handoff.

### CORS

Allow every approved host origin to GET manifests, entries, chunks, CSS,
fonts, and `nav.json`. Prefer an exact origin without a trailing slash. For
multiple environments, validate the request origin against an allowlist and
return one matching `Access-Control-Allow-Origin` value.

Wildcard CORS is acceptable only when artifacts are intentionally public and
cross-origin requests carry no credentials.

### Cache policy

| File                                             | Policy                   |
| ------------------------------------------------ | ------------------------ |
| `mf-manifest.json`, `remoteEntry.js`, `nav.json` | Revalidate or `no-cache` |
| Hashed chunks, CSS, fonts, images                | Long-lived `immutable`   |

### SPA fallback

Static federation files and `/assets/*` must resolve before any SPA rewrite.
If a manifest or `nav.json` request returns `index.html`, the deployment is
broken even when standalone navigation appears to work.

The starter's standalone HashRouter does not require server fallback for page
routes. A product that later adopts history-based standalone URLs must
configure fallback without shadowing federation artifacts.

### Release behavior

A new remote identity requires platform registration and usually a host
redeploy. A new remote version at the same registered manifest URL normally
requires only publishing the artifact, followed by integration verification.
Changing identity, origin, basename, exposes, or contract compatibility
requires coordination.

Never point a deployed host at a localhost origin.

## Platform handoff

### Inputs required before implementation

Get these decisions from the platform team:

- [ ] approved module id;
- [ ] assigned basename;
- [ ] approved federation producer name and host-side alias;
- [ ] development, staging, and production host origins for CORS;
- [ ] expected auth transport and whether the backend accepts the supplied
      credential, needs exchange, or exposes only public endpoints;
- [ ] contract and adapter compatibility baseline;
- [ ] environment and owner for embedded acceptance.

The product team does not need the platform's source tree, build tool, router
implementation, token storage keys, or catalog file paths.

### Outputs delivered by the product team

Provide:

- [ ] immutable starter baseline used to create the repository;
- [ ] final module id, federation name, display name, and local port;
- [ ] deployed remote origin and exact `mf-manifest.json` URL;
- [ ] agreed basename and host alias for cross-checking;
- [ ] `nav.json` URL and final page list;
- [ ] required host origins and confirmed CORS behavior;
- [ ] auth/API expectation without credentials or product secrets;
- [ ] commands and results for the local release gate;
- [ ] known integration limitations or credential-policy blockers;
- [ ] release owner and rollback/artifact replacement procedure.

The platform team then registers the manifest, alias, basename, catalog entry,
navigation source, and credential policy. These are platform-owned changes and
do not belong in the product remote.

## Implementation workflow

Use this order to reduce rework:

1. **Freeze the starting point.** Copy an immutable starter tag and record it.
2. **Collect platform inputs.** Do not invent identity or auth decisions.
3. **Rename consistently.** Update coordinates and verifier expectations.
4. **Replace product surface.** Keep the index route; replace/remove examples.
5. **Add product state and APIs.** Keep mutable clients per mount and APIs
   product-owned.
6. **Apply UI rules.** Consume semantic tokens and preserve containment.
7. **Verify standalone.** Exercise routes, theme, locale, forms, and overlays.
8. **Build and inspect artifacts.** Run the finite gate and open JSON files.
9. **Deploy independently.** Configure CORS, cache, and fallback order.
10. **Hand off coordinates.** Platform registers the already working artifact.
11. **Verify embedded behavior.** Mount, deep-link, refresh, retry, switch
    theme/locale, sign out, leave/re-enter, and check cleanup.

## Verification

Run after any integration-sensitive change:

```bash
pnpm test
pnpm lint
pnpm format:check
pnpm build
pnpm verify:artifacts
```

Then run `pnpm preview` separately and manually inspect the production build.
Stop the preview server afterward.

During development, confirm the local origin returns JSON from:

```text
http://localhost:5004/mf-manifest.json
http://localhost:5004/nav.json
```

Replace `5004` when the remote uses another local port.

### Standalone acceptance

- [ ] index and every declared page render and refresh correctly;
- [ ] theme and locale changes update controls and overlays;
- [ ] forms, Select, dialogs, tooltip/persistent help, and notifications are
      keyboard- and touch-usable;
- [ ] narrow and wide layouts do not rely on host chrome;
- [ ] no unexpected console errors or Fast Refresh lint warnings;
- [ ] production preview serves the same artifact set as development.

### Embedded acceptance

- [ ] host loads `./mount` and child navigation from `nav.json`;
- [ ] index, nested routes, deep links, back/forward, and refresh work below
      the assigned basename;
- [ ] host theme and locale updates do not remount the remote;
- [ ] bearer/cookie/public API behavior matches the assigned policy;
- [ ] platform sign-out returns control to the host;
- [ ] CSS does not alter host chrome;
- [ ] portals stay within the remote slot;
- [ ] leaving and returning creates a clean session;
- [ ] forced unmount leaves no overlays, listeners, or document mutations;
- [ ] retry works after the remote origin or navigation endpoint recovers;
- [ ] remote failure does not take down host chrome.

Host-level browser automation belongs to the platform integration suite. Do
not install or copy the host's Playwright suite into this starter merely to
duplicate host-owned checks.

## Common changes

### Add a page

Add one manifest entry, one exhaustive page mapping, translations, tests, and
the corresponding artifact expectation. Keep segments relative.

### Add a protected product API

Keep its base URL in product environment configuration. Use
`createHostFetch(bridge.auth.http)` inside embedded product composition. Handle
missing credentials deliberately and route platform sign-out through the
bridge. Do not place the API URL or endpoint DTOs on `HostBridge`.

### Add a public product API

Use a product-owned fetch client that intentionally sends no host credential.
Do not call the protected helper and do not synthesize a bearer header.

### Add a data/query client

Construct it per mount below `RemoteApp`, cancel active work during cleanup,
and avoid a mutable module singleton. A large client may be expensive, but
correct isolation comes before caching; optimize immutable caches only after
measuring and defining their cross-session safety.

### Add an overlay primitive

Use `useRemotePortalContainer()` (or the retained primitive wrapper) and
verify normal close, route change, and unmount. Never default embedded portals
to `document.body`.

### Upgrade contract or adapters

Read the target release, update both immutable pins together when required,
install, typecheck, run all tests, build, verify artifacts, and re-run embedded
acceptance. Update the baseline and copied public type/token tables in the same
change.

## Anti-patterns

Reject changes that:

- import host or demo-remote application source;
- duplicate route metadata outside `nav-manifest.ts`;
- derive basename from module id;
- store a host bearer in remote storage;
- request one bearer at mount and cache it indefinitely;
- add API URLs, product permissions, OAuth providers, or backend DTOs to the
  public bridge;
- add a public `none` auth mode that the contract does not define;
- add React or ReactDOM to federation shared dependencies;
- keep a mutable router, i18n, API client, or store singleton across mounts;
- import standalone bootstrap into `./mount`;
- portal or style outside remote-owned roots;
- copy host breakpoints, sidebar tokens, spacing, or chrome selectors;
- make required behavior hover-only;
- weaken artifact checks instead of correcting the artifact;
- rely on a local port or SPA fallback in production;
- require the product team to edit platform source during ordinary remote
  implementation.

## Definition of Done

The remote is ready for platform registration when:

- [ ] identity is renamed and approved;
- [ ] product routes and `nav.json` share one source;
- [ ] standalone and embedded entries remain separated;
- [ ] every mount owns and cleans up its mutable resources;
- [ ] HostBridge is the only embedded platform boundary;
- [ ] auth behavior matches the assigned credential policy;
- [ ] theme, locale, design tokens, CSS, and portals obey containment rules;
- [ ] accessibility and responsive checks pass;
- [ ] the full local gate passes without warnings or errors;
- [ ] production artifacts, CORS, caching, and fallback behavior are verified;
- [ ] the platform handoff contains every required coordinate and URL;
- [ ] embedded acceptance passes in the agreed environment;
- [ ] the copied starter baseline and product release are recorded immutably.

## Focused companion documents

This file is intentionally complete. Use the focused documents when working on
one area:

- [`integration.md`](./integration.md) — public lifecycle, HostBridge, and
  handoff boundary;
- [`style-guide.md`](./style-guide.md) — normative UI, responsive,
  interaction, and accessibility rules;
- [`hosting.md`](./hosting.md) — provider configuration, CORS, cache, and SPA
  fallback examples;
- [`compatibility.md`](./compatibility.md) — pinned versions and upgrade
  policy;
- [`visual-reference/`](./visual-reference/README.md) — neutral appearance
  examples, not normative behavior.
