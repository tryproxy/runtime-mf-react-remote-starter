# Runtime MF React remote starter

Standalone Vite + React application and Runtime MF remote baseline for
`runtime-mf-shell`.

> The repository has passed its early standalone/embedded integration gate and
> runtime-isolation cut. Federation identity, CSS ownership, per-mount state,
> auth policy, telemetry, and portals are neutral, but the copied
> demo/conformance pages are intentionally still present. Do not publish this
> revision as the finished GitHub template.

## Template lineage

- source repository: `tryproxy/runtime-mf-module`;
- source branch: `dev`;
- source commit: `7de1c9cb3c4c2d092f332410cba42e14277a28ea`;
- copied from source-controlled files only on 2026-08-29;
- target repository identity, `.git`, origin, branch, and `.codegraph` were
  preserved;
- source `.git`, `.codegraph`, `node_modules`, `dist`, caches, and local `.env*`
  files were not copied.

The tracked `env.example` is intentionally retained as public documentation. It
must never contain credentials, tokens, or product secrets.

## Coordinates

Runtime coordinates live in [`remote.config.ts`](./remote.config.ts); repository
package identity remains in `package.json`:

| Coordinate          | Baseline value                    |
| ------------------- | --------------------------------- |
| Package             | `runtime-mf-react-remote-starter` |
| Module id           | `starter`                         |
| Federation producer | `runtime_mf_react_remote_starter` |
| Display name        | `Starter Remote`                  |
| Local port          | `5004`                            |

Shell-owned registration examples are documented here but must not be imported
by the remote:

| Coordinate                    | Example value                        |
| ----------------------------- | ------------------------------------ |
| Route/basename                | `/starter`                           |
| Federation alias              | `starter_remote`                     |
| Load request                  | `starter_remote/mount`               |
| Manifest environment variable | `VITE_STARTER_REMOTE_MANIFEST_URL`   |
| Example remote origin         | `https://starter-remote.example.com` |
| Example shell origin          | `https://shell.example.com`          |

The embedded router always uses the `basename` supplied to `mount()`. It does
not use `/starter` as an application fallback.

## Preflight decisions

### Visual snapshot

The candidate visual source is `runtime-mf-shell` commit
`1cdf0f83ce3fe20c49d6c173a97f18584b9a3055`. The approved initial allowlist is
the following reviewed subset, not the complete shell stylesheet:

- Geist Variable as `--font-sans` and `--font-heading`;
- Tailwind v4 default spacing and standard `sm`/`md`/`lg`/`xl` breakpoints;
- custom breakpoints `compact: 500px`, `comfortable: 560px`, and
  `wideMobile: 740px`;
- radius `0.625rem`, with the current shadcn derived radius scale;
- focus treatment `outline-ring/50` and the semantic ring values below;
- `--rmf-color-page`, `surface`, `fg`, `muted`, `subtle`, `border`,
  `--rmf-radius-md`, and `--rmf-shadow-sm` mapped to the corresponding local
  shadcn semantics without redefining host-owned `--rmf-*` values;
- light shadow `0 1px 2px rgb(15 23 42 / 0.06)` and dark shadow
  `0 1px 2px rgb(0 0 0 / 0.35)`.

| Semantic                   | Light                       | Dark                        |
| -------------------------- | --------------------------- | --------------------------- |
| background                 | `oklch(1 0 0)`              | `oklch(0.145 0 0)`          |
| foreground                 | `oklch(0.145 0 0)`          | `oklch(0.985 0 0)`          |
| card / popover             | `oklch(1 0 0)`              | `oklch(0.205 0 0)`          |
| primary                    | `oklch(0.205 0 0)`          | `oklch(0.922 0 0)`          |
| primary foreground         | `oklch(0.985 0 0)`          | `oklch(0.205 0 0)`          |
| secondary / muted / accent | `oklch(0.97 0 0)`           | `oklch(0.269 0 0)`          |
| muted foreground           | `oklch(0.556 0 0)`          | `oklch(0.708 0 0)`          |
| destructive                | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` |
| border                     | `oklch(0.922 0 0)`          | `oklch(1 0 0 / 22%)`        |
| input                      | `oklch(0.922 0 0)`          | `oklch(0.45 0 0)`           |
| ring                       | `oklch(0.708 0 0)`          | `oklch(0.556 0 0)`          |

The candidate primitive behavior is the shell's reviewed Button, Input/Label,
Card, Alert, Dialog, Select, Dropdown Menu, Tooltip, and Toast surface at that
commit. Portal placement and embedded document ownership are deliberately
overridden by the contract below. Shell chrome primitives are excluded.

Do not copy shell navigation/header/account chrome, ASO compatibility selectors,
or ASO-matching page-canvas values merely because they exist in shell CSS. The
visual phase must record light/dark reference captures before accepting the
snapshot.

Reference captures are not yet recorded. The shell Playwright suite exists
and targets the registered React demo; it does not close this visual gate.
The visual snapshot gate remains open even though its source values and
exclusions are fixed here.

### Portal behavior

- Portal DOM belongs below the remote mount container. The mount boundary owns
  `position: relative` and `isolation: isolate`; overlays use that containing
  block rather than the viewport or `document.body`.
- Embedded overlays cover only the remote slot. Remote dropdown/tooltip layers
  use local layer `40`; modal/notification layers use local layer `50`. The
  isolated stacking context prevents those numbers from competing with shell
  chrome z-indexes.
- Embedded primitives must not lock `html`/`body` scrolling or set `aria-hidden`
  on shell siblings. Any scroll containment or inert state is limited to the
  remote mount subtree.
- A remote must not leave body attributes/styles, focus guards, listeners,
  notifications, or orphaned nodes after close or unmount.
- Normal close returns focus to the trigger when it still exists. On route
  unmount the remote performs no cross-boundary focus request; it only guarantees
  that focus is not left on a detached remote node. Shell route focus remains a
  shell responsibility because HostBridge has no focus-management contract.
- An explicit component-level container override may narrow the boundary but may
  not silently escape to `document.body`.

### Verification boundary

The starter keeps focused checks for route/nav projection, per-mount state,
auth modes, mount/unmount cleanup, and emitted artifacts. Visual, responsive,
focus, and shell-containment behavior also receives a manual embedded proof.
Product-domain tests and a cross-framework conformance framework are outside the
starter repository.

## Early integration gate status

- PASS: source-controlled baseline copy and target repository identity.
- PASS: frozen install, TypeScript, lint without errors, and production build.
- PASS: federation identity, `./mount`, `nav.json`, assets, and empty shared list.
- PASS: standalone document CSS is isolated in `standalone.css`; the embedded
  graph omits Tailwind Preflight and scopes semantic/base rules to
  `[data-rmf-root]`; the descendant portal root inherits the same theme tokens.
- PASS: `bundleAllCSS: false` plus distinct standalone/embedded CSS module ids
  leaves the standalone asset out of the `./mount` manifest graph while keeping
  one embedded stylesheet declared and loadable.
- PASS: the CSS-layer plugin excludes `?standalone`; `main.tsx` imports
  standalone Preflight before utilities so `base` cannot override spacing and
  border utilities.
- PASS: the artifact verifier rejects missing assets, embedded
  `:root`/`:host`/`html`/`body`/`#root`, unscoped link/universal resets and
  theme selectors,
  definitions of host-owned `--rmf-*`, an embedded-only wrapper in standalone
  CSS, and standalone `base` appearing after `utilities`.
- PASS: a disposable Shell registration at `/starter` loaded the production
  preview on `:5004`; shell Playwright passed mount, navigation/deep links,
  reload, back/forward, leave/re-enter, theme/locale continuity, and chrome
  containment (8 passed, 3 intentionally skipped demo-only scenarios).
- PASS: focused Chromium inspection proved the Shell-loaded stylesheet matches
  the single CSS asset declared for `./mount`, theme changes reach the
  remote-owned root, unmount removes that root, and the standalone preview owns
  its document theme/canvas. A representative `p-4 border` surface computed to
  `padding: 16px` and `border: 1px solid` in the production preview.
- PASS: each embedded mount owns its i18next instance and follows independent
  HostBridge theme/locale updates without remounting or mutating the shell
  document root. Mount-container theme markers are restored on cleanup.
- PASS: `createHostFetch()` requests a fresh bearer token immediately before
  every request or uses `credentials: 'include'` for cookie mode.
  `requestSignOut()` delegates to the host without reading or clearing storage.
- PASS: embedded render failures use host telemetry; standalone rendering keeps
  an explicit console fallback.
- PASS: each mount renders one themed `[data-rmf-portal-root]`. Dialog and Sheet
  enforce non-modal document behavior with slot-local overlays; Dropdown Menu,
  Popover, and Tooltip use non-modal Radix portals; Select is a local accessible
  listbox. All default to the mount-owned container and retained wrappers allow
  a mount-local explicit override. The unused document-modal AlertDialog was removed.
  Sonner notifications are toaster-scoped and dismissed during provider cleanup.
- PASS: 18 focused Vitest checks cover auth modes, independent mount sessions,
  embedded-import ownership, route/nav projection, telemetry, portal
  containment, theme inheritance, focus return, and cleanup.
- PASS: the latest disposable Shell run against the updated starter passed all
  11 Playwright scenarios, including theme/locale propagation, normal Select
  close, forced route unmount with an open portal, and clean re-entry. The
  temporary registration did not modify the Shell working tree.
- OPEN: light/dark reference captures for the visual snapshot.

The repository is now an embedded-CSS-safe, mount-isolated baseline. It is not
yet the finished template: the demo surface, visual curation, dependency
reduction, and final publishing/maintenance work remain.

## Current surfaces

| Surface                               | Role                                                |
| ------------------------------------- | --------------------------------------------------- |
| `./mount`                             | Framework-neutral Runtime MF lifecycle entry        |
| `nav.json`                            | Shell-consumed child navigation artifact            |
| `src/app/main.tsx`                    | Standalone entry                                    |
| `src/app/entry/mount.tsx`             | Embedded entry using the React adapter              |
| `src/shared/lib/host-auth.ts`         | Bearer/cookie request and host sign-out helpers     |
| `src/shared/ui/remote-portal/`        | Mount-owned overlay/portal destination              |
| `src/shared/ui/remote-toast/`         | Mount-owned Sonner routing and cleanup              |
| `src/app/styles/index.css`            | Embedded-safe CSS entry                             |
| `src/app/styles/standalone.css`       | Standalone-only document ownership                  |
| `vite-plugin-rmf-remote-css-layer.ts` | Embedded-only cascade-layer transform               |
| `src/app/model/nav-manifest.ts`       | Current route/navigation source                     |
| `scripts/verify-artifacts.mjs`        | Federation, embedded CSS, and standalone layer gate |

The copied crash, protected request, technical cards, and demo form are temporary
baseline material. The neutral-application phase removes them and replaces the
surface with overview and optional patterns routes.

## Local development

Requirements:

- Node `22.12.0` is recorded in `.node-version`;
- `package.json` also accepts the Vite-supported Node 20 line;
- pnpm is pinned through the `packageManager` field.

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm build
pnpm verify:artifacts
pnpm preview
```

Standalone development and preview use `http://localhost:5004`. The shell-side
local registration points `VITE_STARTER_REMOTE_MANIFEST_URL` to
`http://localhost:5004/mf-manifest.json`.

The remote owns React and ReactDOM (`shared: {}`). Shell chrome, top-level
history, credentials, theme, locale, and the supplied basename remain shell
owned through `HostBridge` and the lifecycle contract.
