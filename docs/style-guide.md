# React remote starter style guide

Status: initial reviewed baseline; known interaction defects remain open
Updated: 2026-08-31

This document is the implementation contract for the starter's neutral UI. It
records what a new remote should preserve, what it may replace, and which
quality gaps must be closed before this repository is published as a template.

The guide describes a reviewed snapshot owned by this repository. It is not a
released cross-repository design-system package. When embedded, the Shell owns
document-level theme state and `--rmf-*` values; the remote owns its component
markup, local semantic mapping, responsive composition, and portal subtree.

## Sources of truth

Use these sources in this order:

1. this guide for UI behavior and ownership rules;
2. `src/app/styles/tokens.css` for the starter's current compile-time mappings;
3. `src/app/styles/standalone.css` and `src/app/styles/index.css` for standalone
   and embedded ownership;
4. `src/shared/ui/shadcn/` for retained primitive implementations;
5. [`visual-reference/`](./visual-reference/README.md) for the approved initial
   appearance, not for interaction correctness.

The initial palette, typography, radius, focus treatment, shadow, and company
viewport values were reviewed from `runtime-mf-shell`. Do not copy Shell chrome
or product-specific ASO selectors into the starter.

## Visual foundation

- Use Geist Variable for body and heading text.
- Use semantic colors (`background`, `foreground`, `card`, `muted`, `border`,
  `input`, `ring`, and state tokens), not hard-coded light/dark component colors.
- Preserve the `0.625rem` base radius and the derived shadcn radius scale unless
  a product has an explicitly approved replacement.
- Use `--rmf-color-*`, `--rmf-radius-md`, and `--rmf-shadow-sm` as embedded
  inputs. Provide starter-owned fallbacks for standalone mode.
- Keep focus visible. The baseline is a semantic border plus a three-pixel
  `ring/50` treatment; hover must never be the only indication of focus.
- Product colors and business-state semantics belong to the derived remote,
  not to this neutral starter.

## Responsive layout

### Viewport scale

The starter currently uses the same numeric viewport scale as the Shell and
ASO, but the values are copied rather than supplied by a shared package.

| Name          | Minimum | Starter source                              |
| ------------- | ------: | ------------------------------------------- |
| `compact`     |   500px | custom value in `src/app/styles/tokens.css` |
| `comfortable` |   560px | custom value in `src/app/styles/tokens.css` |
| `sm`          |   640px | Tailwind default                            |
| `wideMobile`  |   740px | custom value in `src/app/styles/tokens.css` |
| `md`          |   768px | Tailwind default                            |
| `lg`          |  1024px | Tailwind default                            |
| `xl`          |  1280px | Tailwind default                            |
| `2xl`         |  1536px | Tailwind default                            |

The Shell mirrors the custom values in
`src/shared/styles/tokens.css` and keeps JavaScript constants in
`src/shared/config/breakpoints.ts`. ASO keeps its equivalent values in
`tailwind.config.js` and `src/shared/config/breakpoints.ts`. There is no shared
breakpoint package, so a change is not automatically propagated.

Tailwind's default breakpoint scale uses `rem`, while the three custom values
currently use `px`. Do not add new custom variants until the open breakpoint
ownership/unit decision is closed. If the current values are retained, use one
unit family and verify generated variant order.

### Embedded composition

Prefer container queries for page composition because the Shell slot can be
narrow while the browser viewport is wide. The neutral pages currently use:

| Variant     | Container minimum | Current role                 |
| ----------- | ----------------: | ---------------------------- |
| `@2xl/page` |     42rem (672px) | compact form/content columns |
| `@3xl/page` |     48rem (768px) | two-column page grids        |
| `@5xl/page` |    64rem (1024px) | three-column page grids      |

Use viewport variants only for behavior that genuinely depends on the browser
viewport. A derived product page should declare its own named container rather
than assuming Shell sidebar or page dimensions.

## Theme behavior

- Embedded mode follows the HostBridge theme without remounting and never
  writes theme state to `html` or `body`.
- Standalone mode may own document theme markers, but the visible switch must
  be atomic: page, cards, controls, overlays, and notifications must not show a
  mixed light/dark frame.
- Do not animate semantic color-token changes during a global theme switch.
  Interaction-specific hover/focus transitions may remain when they do not
  delay the theme itself.
- Theme transitions and decorative motion must honor
  `prefers-reduced-motion`.
- A theme test must sample representative page, card, input, select, and portal
  colors at the switch boundary; checking only the final state is insufficient.

The current implementation does not yet meet the atomic-switch rule. Input and
Select use `transition-colors`, Button uses `transition-all`, while surrounding
surfaces switch immediately. Standalone document markers are also applied from
an effect. See `UI-003` below.

## Controls and overlays

### Select

- The listbox must align to its trigger on the first open, not only after a
  close/reopen cycle.
- Positioning must be recomputed when trigger/content size changes and on
  relevant scroll/resize events.
- Width policy is explicit per use: at least trigger width, with alignment
  calculated from the final rendered width.
- Keyboard open, selection, Escape/outside close, focus return, and forced
  remote unmount must leave no portal residue.
- The listbox remains below the mount-owned portal root in embedded mode.

### Tooltip and persistent help

Tooltip is supplementary hover/focus content. It may close when its trigger is
activated and must not contain information required to complete a task.

For a control labelled “Show hint” or for help that must remain available after
tap/click, use a disclosure, Popover, or inline expandable region with explicit
open state. Do not make a Tooltip imitate persistent touch behavior.

### Portals

- Dialog, Select, Dropdown Menu, Tooltip, and Toast stay below
  `[data-rmf-portal-root]` when embedded.
- Embedded overlays are confined to the remote slot and must not lock or hide
  unrelated Shell DOM.
- Close returns focus to a surviving local trigger. Forced route unmount only
  guarantees that focus is not left on a detached node.
- All portal nodes, listeners, focus guards, scroll effects, and notifications
  are cleaned up with the mount session.

## Component and Fast Refresh convention

Files that export React components should export components only. Move hooks,
contexts, variant definitions, constants, and helpers to adjacent `.ts` files
and re-export them through a barrel when needed. Do not disable
`react-refresh/only-export-components` to hide a mixed-export warning.

The current known mixed exports are:

- `useHostBridge` from `host-bridge-context.tsx`;
- `useRemotePortalContainer` from `remote-portal-provider.tsx`;
- `useRemoteToast` and `useRemoteToasterId` from
  `remote-toast-provider.tsx`;
- `buttonVariants` from `button.tsx`.

These warnings do not break a production build, but development Fast Refresh
may fall back to a broader reload and lose local state.

## Accessibility baseline

- Every control has an accessible name independent of placeholder text.
- Keyboard navigation and visible focus are required for all retained
  primitives.
- Color is not the sole carrier of validation or status.
- Touch targets and persistent help do not depend on hover.
- Motion reduction is respected.
- Locale changes must not cause horizontal overflow in the supported `en`,
  `ru`, and `es` surfaces.

## Known issues and required closure

| ID        | Priority | Open issue                                                                                                   | Required evidence                                                                                                                     |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `UI-001`  | P1       | Select uses its initial CSS width to calculate alignment, then changes `minWidth`; first open can be offset. | Browser regression test proves first-open alignment for compact and full-width triggers, plus resize/scroll behavior.                 |
| `UI-002`  | P1       | The “Show hint” example uses Tooltip semantics, so click/tap activation closes it.                           | Replace the example with persistent disclosure/Popover semantics; verify keyboard and touch activation.                               |
| `UI-003`  | P1       | Theme changes are visually staggered across page and form controls.                                          | Atomic-switch test samples page/card/input/select/portal at the switch boundary; reduced-motion case passes.                          |
| `DX-001`  | P2       | ESLint reports five `react-refresh/only-export-components` warnings.                                         | Split non-component exports; `pnpm lint` completes with zero warnings and zero errors.                                                |
| `ARC-001` | P2       | Shell, starter, demo, and ASO duplicate breakpoint values; custom units differ from Tailwind defaults.       | Record one ownership policy, normalize units if kept in Tailwind, and add a drift check or intentionally declare remote independence. |

The initial screenshots remain approved as appearance references, but they do
not close these issues.

## Review checklist

Before publishing the starter or accepting a visual change:

1. Run the starter static checks, focused tests, production build, and artifact
   verification.
2. Run the Shell-owned Playwright suite through a disposable starter
   registration for mount, navigation, theme/locale, containment, and cleanup.
3. Exercise Select on its first open, persistent help with keyboard and touch,
   and theme switching on a control-heavy page.
4. Inspect standalone and embedded light/dark surfaces at narrow and wide
   container sizes.
5. Confirm lint has no warnings and no errors.
6. Update this guide and the visual reference when an approved baseline changes.

## External references

- [Tailwind responsive design and custom breakpoint units](https://tailwindcss.com/docs/responsive-design)
- [Radix Tooltip behavior and accessibility](https://www.radix-ui.com/primitives/docs/components/tooltip)
- [`eslint-plugin-react-refresh` export rules](https://github.com/ArnaudBarre/eslint-plugin-react-refresh)
