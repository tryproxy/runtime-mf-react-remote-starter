import { createContext } from 'react';
import type { HostBridge } from '@platform/runtime-mf-contract';

export const HostBridgeContext = createContext<HostBridge | null>(null);
