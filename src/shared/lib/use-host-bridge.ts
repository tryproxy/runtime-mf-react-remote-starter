import { useContext } from 'react';
import type { HostBridge } from '@platform/runtime-mf-contract';
import { HostBridgeContext } from './host-bridge-context';

export function useHostBridge(): HostBridge | null {
  return useContext(HostBridgeContext);
}
