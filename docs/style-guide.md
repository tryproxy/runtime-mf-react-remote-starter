# React remote style guide

This guide defines the visual, responsive, interaction, and accessibility rules
for product remotes derived from this starter. It is the normative UI guide;
screenshots are appearance references only.

## Sources of truth

Use these sources in order:

1. this guide for behavior and ownership rules;
2. `@platform/runtime-mf-contract/design-tokens` for shared token names;
3. `src/app/styles/tokens.css` for Tailwind/shadcn mappings;
4. `src/app/styles/standalone.css` and `src/app/styles/index.css` for standalone
   and embedded CSS ownership;
5. `src/shared/ui/shadcn/` for retained primitive implementations;
6. [`visual-reference/`](./visual-reference/README.md) for neutral appearance.

Product teams may replace the starter's visual language, but must preserve the
integration, containment, responsiveness, and accessibility rules below.

## Visual foundation

- Use semantic colors such as `background`, `foreground`, `card`, `muted`,
  `border`, `input`, `ring`, and state tokens instead of hard-coded component
  colors.
- The neutral baseline uses Geist Variable and a `0.625rem` base radius. A
  product may replace them consistently.
- In embedded mode, consume host `--rmf-color-*`, `--rmf-radius-md`, and
  `--rmf-shadow-sm` values as inputs. Provide remote-owned fallbacks for
  standalone mode.
- Keep focus visible. Hover must never be the only indication of focus.
- Product branding and business-state semantics belong to the product remote.

### Design Tokens v1

The host publishes these CSS custom properties. Embedded styles read them; they
must never redefine them. Standalone styles keep local fallback values.

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
| `--rmf-color-destructive`  | Error and destructive action       |
| `--rmf-color-border`       | Dividers and structural borders    |
| `--rmf-color-input`        | Form-control chrome                |
| `--rmf-color-ring`         | Keyboard focus ring                |
| `--rmf-radius-md`          | Base control radius                |
| `--rmf-shadow-sm`          | Light elevation                    |
| `--rmf-font-sans`          | Shared sans-serif font stack       |

Import the Tailwind v4 aliases once through `src/app/styles/tokens.css`:

```css
@import '@platform/runtime-mf-contract/design-tokens/tailwind-v4.css';
```

Application code normally uses shadcn semantic utilities (`bg-primary`,
`border-input`, `ring-ring`). The starter maps those roles to `--rmf-*` below
`[data-rmf-root]`. The imported adapter additionally exposes explicit utilities
such as `bg-rmf-page`, `text-rmf-muted-fg`, and `rounded-rmf-md` when needed.

Do not add shell sidebar/chart roles, spacing, or breakpoints to this interface.
Derive smaller/larger radii from the single base radius. Add product status and
brand colors locally instead of extending the platform token namespace.

## Responsive layout

### Viewport scale

The starter uses Tailwind's default viewport scale:

| Name  | Minimum | Source           |
| ----- | ------: | ---------------- |
| `sm`  |   40rem | Tailwind default |
| `md`  |   48rem | Tailwind default |
| `lg`  |   64rem | Tailwind default |
| `xl`  |   80rem | Tailwind default |
| `2xl` |   96rem | Tailwind default |

Viewport policy is not part of the Runtime MF contract. A product may define
its own viewport scale, but it must not assume host chrome dimensions or copy
host-only breakpoint names.

### Embedded composition

Prefer container queries for page composition because the available mount slot
can be narrow while the browser viewport is wide. The neutral pages use:

| Variant     | Container minimum | Role                         |
| ----------- | ----------------: | ---------------------------- |
| `@2xl/page` |     42rem (672px) | compact form/content columns |
| `@3xl/page` |     48rem (768px) | two-column page grids        |
| `@5xl/page` |    64rem (1024px) | three-column page grids      |

Use viewport variants only for behavior that truly depends on the browser
viewport. Give product layouts their own named containers rather than relying
on a host sidebar or page width.

## Theme behavior

- Embedded mode follows `HostBridge.theme` without remounting.
- Embedded code never writes theme state to `html` or `body`.
- Standalone mode may own document theme markers.
- A theme switch must be visually atomic across page, cards, controls,
  overlays, and notifications.
- Do not animate semantic color-token changes during a global theme switch.
- Interaction motion must honor `prefers-reduced-motion`.

When changing theme implementation, test representative page, card, input,
Select, and portal colors at the switch boundary—not only the final state.

## Controls and overlays

### Select

- Align the listbox to its trigger on the first open.
- Recompute position when trigger/content size changes and on relevant
  scroll/resize events.
- Make width policy explicit; the listbox should normally be at least as wide
  as its trigger.
- Support keyboard open, selection, Escape/outside close, and focus return.
- Forced route or remote unmount must leave no portal residue or detached
  focus target.

### Tooltip and persistent help

A Tooltip is supplementary hover/focus content. It must not contain information
required to complete a task and must not shift surrounding layout.

If help must remain available after tap or click, use a disclosure, Popover, or
inline expandable region with explicit open state. Do not make a Tooltip
imitate persistent help.

### Portals

- Dialog, Select, Dropdown Menu, Tooltip, and Toast render below
  `[data-rmf-portal-root]` when embedded.
- Embedded overlays remain inside the remote slot and never lock or hide
  unrelated host DOM.
- Normal close returns focus to a surviving local trigger.
- Unmount removes portal nodes, listeners, focus guards, scroll effects, and
  notifications created by that mount.

## Component and Fast Refresh convention

Files that export React components should export components only. Move hooks,
contexts, variant definitions, constants, and helpers to adjacent `.ts` files
and re-export through a barrel when helpful.

Do not disable `react-refresh/only-export-components` to hide a mixed-export
warning. The existing bridge, portal, toast, and Button modules demonstrate the
expected split.

## Accessibility baseline

- Every control has an accessible name independent of placeholder text.
- Keyboard navigation and visible focus are required for every retained
  primitive.
- Color is not the sole carrier of validation or status.
- Required help and touch interactions do not depend on hover.
- Motion reduction is respected.
- Locale changes do not cause horizontal overflow on supported surfaces.
- Dialogs and menus expose correct roles, names, focus movement, and Escape
  behavior.

## Review checklist

Before accepting a UI change:

1. Run `pnpm test` and `pnpm lint` with zero errors and warnings.
2. Run `pnpm build` and `pnpm verify:artifacts`.
3. Exercise Select on first open, after scrolling, and after resize.
4. Check pointer, keyboard, and touch behavior for help and overlays.
5. Switch light/dark theme on a control-heavy page with normal and reduced
   motion.
6. Inspect standalone and embedded light/dark surfaces at narrow and wide
   container sizes.
7. Confirm all portals disappear after close, route change, and unmount.
8. Update the visual reference only when an intentional baseline change is
   approved.

## External references

- [Tailwind responsive design](https://tailwindcss.com/docs/responsive-design)
- [Radix Tooltip](https://www.radix-ui.com/primitives/docs/components/tooltip)
- [`eslint-plugin-react-refresh` export rules](https://github.com/ArnaudBarre/eslint-plugin-react-refresh)
