# Runtime MF integration

This guide defines the boundary between this React remote and a compatible
Runtime MF host. It is self-contained: product developers do not need host
source code to implement the remote.

## Ownership boundary

The product team owns:

- product pages, routes, translations, state, and API clients;
- the remote's module id, federation producer name, and `nav.json` content;
- standalone behavior;
- the production build and remote origin;
- backend URLs and backend-specific protocols.

The platform team owns:

- the host catalog entry, URL basename, and federation alias;
- loading the remote and enforcing lifecycle timeouts;
- the current theme, locale, platform session, and host navigation;
- credential storage and the credential policy assigned to the remote;
- host-level telemetry and integration acceptance tests.

Neither side imports the other side's source code. Their public boundary is the
federation `./mount` export, `nav.json`, and `HostBridge`.

## Lifecycle export

The host loads `./mount` and calls it with a DOM container, the assigned
basename, and a bridge:

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

The starter already implements this in `src/app/entry/mount.tsx` through
`@platform/runtime-mf-adapters/react`. Product code should not replace the
adapter unless the lifecycle contract changes.

The host may mount, unmount, and later mount the remote again. Every mount must
create a clean React root and mount-scoped providers. Cleanup must remove
subscriptions, requests, timers, event listeners, portals, and notifications.

`basename` is authoritative for embedded routing. Do not derive it from the
module id and do not provide a fallback product path.

## HostBridge

`HostBridge` is the runtime service boundary. Values owned by the host use the
external-store shape `getSnapshot()` plus `subscribe()` so the remote can react
without being remounted.

| Facet        | What the host provides                                           | Remote rule                                                                    |
| ------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `theme`      | `light` or `dark`, plus subscription                             | Apply it below the mount root; do not write embedded state to `html` or `body` |
| `i18n`       | `en`, `ru`, or `es`, plus subscription                           | Update remote i18n; do not show a competing embedded locale switch             |
| `auth`       | session snapshot, subscription, HTTP credential policy, sign-out | Never inspect host storage or implement a second platform login                |
| `navigation` | host location, subscription, `navigate`, and `replace`           | Use React Router below `basename`; use the bridge for host-level paths         |
| `telemetry`  | events, messages, and exception capture                          | Report operational signals without assuming a telemetry vendor                 |

The current public surface is:

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

The installed `@platform/runtime-mf-contract` package is the TypeScript source
of truth. This local copy documents the pinned starter baseline and must change
with a contract upgrade.

The starter's `RemoteApp` already subscribes to theme and locale and provides
the bridge to product components:

```ts
import { useHostBridge } from '@/shared/lib';

const bridge = useHostBridge();

if (!bridge) {
  // Decide whether this component is valid in standalone mode.
  throw new Error('This action requires an embedded host.');
}

const session = bridge.auth.getSnapshot();
```

When product behavior depends on later session changes, wrap
`bridge.auth.subscribe` and `getSnapshot` in a focused hook based on
`useSyncExternalStore`.

## Authentication and product API calls

The host decides which credential transport is available to this remote. The
product owns its API base URL and endpoint semantics.

Use the provided helper:

```ts
import { createHostFetch, requestSignOut, useHostBridge } from '@/shared/lib';

const bridge = useHostBridge();

if (!bridge) {
  throw new Error('A platform session is required.');
}

const productApiBaseUrl = import.meta.env.VITE_PRODUCT_API_BASE_URL;
const apiFetch = createHostFetch(bridge.auth.http);
const response = await apiFetch(`${productApiBaseUrl}/orders`);

if (response.status === 401) {
  await requestSignOut(bridge);
}
```

`createHostFetch` enforces both supported modes:

- **bearer** — calls `getAccessToken()` immediately before every request and
  adds `Authorization: Bearer ...`;
- **cookie** — adds `credentials: 'include'` and exposes no token to JavaScript.

Rules:

- never read a host token from `localStorage`, cookies, URL parameters, or
  another remote;
- never persist a value returned by `getAccessToken()`;
- do not add product API URLs or third-party OAuth credentials to HostBridge;
- do not render a competing platform login inside the embedded remote;
- request platform sign-out through `bridge.auth.signOut()`;
- treat backend authorization as authoritative even when the host session has
  roles.

Standalone mode uses `createMockHostBridge` for UI development. It is not a
production identity provider. A product may add standalone-only authentication
behind the standalone entry, but it must not leak into the embedded mount.

## Routes and `nav.json`

`src/app/model/nav-manifest.ts` is the one route metadata source. The build
serves and emits it as `nav.json`:

```json
{
  "contractVersion": 1,
  "moduleId": "starter",
  "pages": [
    {
      "id": "overview",
      "segment": "",
      "label": { "en": "Overview", "ru": "Обзор", "es": "Resumen" }
    },
    {
      "id": "patterns",
      "segment": "patterns",
      "label": { "en": "Patterns", "ru": "Паттерны", "es": "Patrones" }
    }
  ]
}
```

The host uses this file for child navigation before mounting the application.
Segments are relative and contain no leading slash or basename. Host
`mf-manifest.json`, `remoteEntry.js`, and `nav.json` at the same origin root.

Use React Router normally below the supplied basename. Use
`bridge.navigation.navigate()` or `.replace()` only when leaving the remote for
a host-owned destination.

## Theme, CSS, and portals

The host supplies semantic `--rmf-*` inputs and the theme mode. The remote maps
them to its component semantics below `[data-rmf-root]` and
`[data-rmf-portal-root]`.

The canonical names come from `@platform/runtime-mf-contract/design-tokens`.
Tailwind v4 projects can import the packaged adapter:

```css
@import '@platform/runtime-mf-contract/design-tokens/tailwind-v4.css';
```

The adapter exposes utilities; it does not set token values. See the
[style guide](./style-guide.md#design-tokens-v1) for the complete token table
and the starter mapping.

Embedded code must not:

- style `html`, `body`, or the standalone `#root`;
- redefine host-owned `--rmf-*` values;
- portal to `document.body`;
- lock document scrolling or set `aria-hidden` outside its mount;
- depend on the host sidebar width or viewport breakpoints.

Prefer container queries for layouts that depend on available slot width. See
the [style guide](./style-guide.md) for the complete UI policy.

## Integration handoff

### Inputs from the platform team

Before implementation or deployment, agree on:

- [ ] the module id and URL basename;
- [ ] the host-side federation alias and approved federation name;
- [ ] development, staging, and production host origins needed for CORS;
- [ ] whether the remote receives `bearer` or `cookie` transport, or instead
      calls only public endpoints without `createHostFetch`, plus any backend
      audience/exchange requirement (HostBridge has no `none` auth mode);
- [ ] the contract and adapter compatibility baseline;
- [ ] the environment in which embedded acceptance will run.

### Outputs from the product team

Before asking the platform team to register the remote:

- [ ] Rename package, module id, federation name, display name, and local port.
- [ ] Replace or remove starter example pages.
- [ ] Keep `./mount`, mount isolation, the embedded CSS layer, and portal
      containment intact.
- [ ] Use HostBridge for embedded auth, theme, locale, navigation, and
      telemetry.
- [ ] Run `pnpm test`, `pnpm lint`, `pnpm build`, and
      `pnpm verify:artifacts`.
- [ ] Deploy `dist/` and confirm manifest, entry, nav, chunks, CSS, and fonts
      are publicly readable with correct CORS.
- [ ] Send the platform team the manifest URL, final module id and federation
      name, deployed remote origin, agreed basename, verification results, and
      any discovered credential-policy blocker.

## Platform-team registration checklist

The product team does not edit the host. The platform team uses the handoff to:

- [ ] approve one stable remote id/module id and basename;
- [ ] add the manifest URL to environment-specific host configuration;
- [ ] map a host federation alias to the remote's `./mount` export;
- [ ] add the remote to the host catalog and navigation group;
- [ ] fetch `nav.json` from the federation artifact origin;
- [ ] assign the remote's credential policy;
- [ ] verify deep links, refresh, retry after origin recovery, theme, locale,
      sign-out, portal cleanup, and unmount/remount behavior.

Updating files at an already registered manifest URL normally ships a remote
release without changing the public integration contract. Changing identity,
origin, basename, exposes, or HostBridge compatibility requires coordination.
