# Visual reference

These images record the neutral appearance of the starter's Overview and
optional Patterns pages. They help detect accidental visual drift; interaction
and accessibility requirements remain defined by the
[style guide](../style-guide.md) and automated tests.

Product teams are expected to replace the neutral content and may replace the
visual language deliberately.

## Reference captures

| Mode       | Surface         | Theme / width                     | Reference                                                                      |
| ---------- | --------------- | --------------------------------- | ------------------------------------------------------------------------------ |
| Standalone | Overview        | light, 1280 × 800                 | [standalone-overview-light.jpg](./standalone-overview-light.jpg)               |
| Standalone | Overview        | dark, 1280 × 800                  | [standalone-overview-dark.jpg](./standalone-overview-dark.jpg)                 |
| Standalone | Patterns        | light, 1265 × 854                 | [standalone-patterns-light.jpg](./standalone-patterns-light.jpg)               |
| Standalone | Patterns        | dark, 1265 × 854                  | [standalone-patterns-dark.jpg](./standalone-patterns-dark.jpg)                 |
| Standalone | Patterns dialog | light, 1265 × 854                 | [standalone-patterns-dialog-light.jpg](./standalone-patterns-dialog-light.jpg) |
| Standalone | Patterns        | narrow, 390 × 681                 | [standalone-patterns-narrow.jpg](./standalone-patterns-narrow.jpg)             |
| Embedded   | Overview        | light, 821 × 754                  | [embedded-overview-light.jpg](./embedded-overview-light.jpg)                   |
| Embedded   | Overview        | dark, 821 × 754                   | [embedded-overview-dark.jpg](./embedded-overview-dark.jpg)                     |
| Embedded   | Patterns        | dark, narrow host slot, 710 × 744 | [embedded-patterns-narrow-dark.jpg](./embedded-patterns-narrow-dark.jpg)       |

## What to inspect

- standalone content keeps a responsive gutter and does not overflow;
- supported translations fit narrow layouts;
- page and status grids respond to container width rather than host chrome;
- embedded theme changes restyle the remote without route changes or remount;
- Dialog, Dropdown Menu, Select, Tooltip, and Toast remain inside the remote's
  portal root;
- overlay close returns focus to the trigger;
- keyboard focus uses a visible semantic ring;
- light/dark changes remain coherent across page, controls, and overlays.

Do not approve an interaction change from screenshots alone. Run the local
tests and the platform's embedded acceptance suite.
