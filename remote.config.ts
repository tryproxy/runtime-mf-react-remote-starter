/**
 * Remote-owned coordinates shared by Vite and browser application code.
 *
 * Keep this module serializable and environment-neutral. Shell-owned aliases,
 * routes, manifest environment variables, and deployment origins belong in
 * shell configuration and the README registration matrix.
 */
export const remoteConfig = {
  moduleId: 'starter',
  federationName: 'runtime_mf_react_remote_starter',
  displayName: 'Starter Remote',
  localPort: 5004,
} as const;
