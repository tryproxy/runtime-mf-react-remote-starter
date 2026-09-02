# Compatibility

Baseline for this repository at git tag `v0.1.0` (`package.json` version
`0.1.0`). `main` can move after that tag.

| Component                       | This baseline                                      |
| ------------------------------- | -------------------------------------------------- |
| Starter                         | `runtime-mf-react-remote-starter@0.1.0` (`v0.1.0`) |
| `@platform/runtime-mf-contract` | `github:tryproxy/runtime-mf-contract#v0.5.4`       |
| `@platform/runtime-mf-adapters` | `github:tryproxy/runtime-mf-adapters#v0.1.3`       |
| `@module-federation/vite`       | `^1.20.5`                                          |
| React / ReactDOM                | `^19.1.1`                                          |
| Vite                            | `^7.1.2`                                           |
| Tailwind CSS                    | `^4.1.12`                                          |
| Node.js                         | `>=22.13.0` (`.node-version` `22.13.0`)            |
| pnpm                            | `11.25.0`                                          |

## Pin policy

- Contract and adapters are **git tags** (`#vX.Y.Z`) or exact commits. Do not
  use `latest`, `main`, or `dev`.
- `pnpm-workspace.yaml` `allowBuilds` lists the GitHub **repository** URLs,
  not a tarball+SHA, so a tag bump does not require editing that file.
- React stays remote-owned (`shared: {}`). Do not add it to the federation
  shared scope to “match” the shell.

## After you copy the template

This matrix describes **this** repository. Your copy’s lockfile is yours.

When the platform ships a new contract or adapters tag:

1. Read the contract/adapters release notes.
2. Bump the `#v…` suffix in your `package.json` if you want that version.
3. Run `pnpm install` (or `pnpm ci` in CI) and the starter verification
   commands.
4. Copy any documented source changes (mount, CSS, portal, auth helpers) by
   hand. There is no upgrade CLI.

## Ownership and cadence

The platform team owns this starter, its CI, and dependency/security bumps
here. There is no calendar SLA in this cut: tags are cut when a publication
or compatibility change needs a frozen baseline.

Product remotes own their own release process and are not required to track
every starter commit.
