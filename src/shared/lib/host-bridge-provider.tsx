import type { HostBridge } from '@platform/runtime-mf-contract';
import type { ReactNode } from 'react';
import { HostBridgeContext } from './host-bridge-context';

type HostBridgeProviderProps = {
  children?: ReactNode;
  value: HostBridge | null;
};

export function HostBridgeProvider({
  children,
  value,
}: HostBridgeProviderProps) {
  return (
    <HostBridgeContext.Provider value={value}>
      {children}
    </HostBridgeContext.Provider>
  );
}
