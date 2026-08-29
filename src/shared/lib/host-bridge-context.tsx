import { createContext, useContext } from 'react';
import type { HostBridge } from '@platform/runtime-mf-contract';

const HostBridgeContext = createContext<HostBridge | null>(null);

export const HostBridgeProvider = HostBridgeContext.Provider;

export function useHostBridge(): HostBridge | null {
  return useContext(HostBridgeContext);
}
