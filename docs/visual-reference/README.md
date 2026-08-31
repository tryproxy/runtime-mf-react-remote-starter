# Visual reference

Captured on 2026-08-31 from the starter production build. These images close
the initial visual-snapshot gate for the neutral `overview` and optional
`patterns` surfaces.

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

## Environment note

The disposable Shell worktree served dependencies through symlinks and warned
that its font files were outside the temporary Vite allowlist. The standalone
production captures are therefore the typography reference; the embedded
captures prove composition, containment, theme propagation, and narrow-slot
behavior.
