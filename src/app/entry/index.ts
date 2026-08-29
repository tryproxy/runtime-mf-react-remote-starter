/**
 * Public federation entry for the remote mount contract.
 * Vite exposes `./mount` through this barrel.
 */
export { mount } from './mount';
export type {
  AppLocale,
  HostBridge,
  HostTelemetry,
  MountRemoteApp,
  RemoteAppInstance,
  TelemetryProps,
  ThemeMode,
} from '@platform/runtime-mf-contract';
