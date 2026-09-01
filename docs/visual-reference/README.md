# Visual reference

Captured on 2026-08-31 from the starter production build. These images close
the initial appearance snapshot for the neutral `overview` and optional
`patterns` surfaces. They are not interaction acceptance tests; the normative
rules and open defects live in the [starter style guide](../style-guide.md).

The standalone captures came from the production preview on `:5004`. Embedded
captures used a disposable local Shell registration on `:5000`; no permanent
starter registration was added to `runtime-mf-shell`.

## Approved captures

| Mode       | Surface         | Theme / width                      | Reference                                                                      |
| ---------- | --------------- | ---------------------------------- | ------------------------------------------------------------------------------ |
| Standalone | Overview        | light, 1280 × 800                  | [standalone-overview-light.jpg](./standalone-overview-light.jpg)               |
| Standalone | Overview        | dark, 1280 × 800                   | [standalone-overview-dark.jpg](./standalone-overview-dark.jpg)                 |
| Standalone | Patterns        | light, 1265 × 854                  | [standalone-patterns-light.jpg](./standalone-patterns-light.jpg)               |
| Standalone | Patterns        | dark, 1265 × 854                   | [standalone-patterns-dark.jpg](./standalone-patterns-dark.jpg)                 |
| Standalone | Patterns dialog | light, 1265 × 854                  | [standalone-patterns-dialog-light.jpg](./standalone-patterns-dialog-light.jpg) |
| Standalone | Patterns        | narrow, 390 × 681                  | [standalone-patterns-narrow.jpg](./standalone-patterns-narrow.jpg)             |
| Embedded   | Overview        | light, 821 × 754                   | [embedded-overview-light.jpg](./embedded-overview-light.jpg)                   |
| Embedded   | Overview        | dark, 821 × 754                    | [embedded-overview-dark.jpg](./embedded-overview-dark.jpg)                     |
| Embedded   | Patterns        | dark, narrow Shell slot, 710 × 744 | [embedded-patterns-narrow-dark.jpg](./embedded-patterns-narrow-dark.jpg)       |

## Inspection result

- light and dark themes match the semantic palette recorded in the root README;
- standalone content keeps a responsive page gutter and does not overflow;
- `en`, `ru`, and `es` copy fits the narrow standalone viewport without
  horizontal overflow;
- page and status grids respond to the remote container width, so a narrow
  Shell slot remains single-column even when the browser viewport is wide;
- Shell theme updates reach the embedded remote without route changes;
- dialog, dropdown, select, tooltip, and toast layers remain inside
  `[data-rmf-portal-root]` and do not change document-body overflow;
- normal overlay close returns focus to the trigger, and keyboard focus uses
  the approved semantic ring.

## Interaction limitations found after capture

- The local Select can be misaligned on its first open because it is positioned
  before its final minimum width is reflected in measurement. A second open is
  not acceptable evidence for this behavior.
- The “Show hint” example is a hover/focus Tooltip in the mount-owned portal.
  It must not expand the actions row with an inline help block.
- A light/dark switch can briefly mix the new page/card theme with old input and
  Select colors because component transition durations are inconsistent.
- The current lint run has zero errors but five Fast Refresh warnings caused by
  component files that also export hooks or variants.

These items are tracked as `UI-001` through `UI-003` and `DX-001` in the style
guide. Refresh the affected captures only after the fixes are verified; do not
replace the current images merely to hide a behavioral defect.

## Environment note

The disposable Shell worktree served dependencies through symlinks and warned
that its font files were outside the temporary Vite allowlist. The standalone
production captures are therefore the typography reference; the embedded
captures prove composition, containment, theme propagation, and narrow-slot
behavior.
