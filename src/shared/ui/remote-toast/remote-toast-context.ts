import { createContext } from 'react';
import type { ExternalToast } from 'sonner';
import { toast } from 'sonner';

export type ToastMessage = Parameters<typeof toast.success>[0];
export type ToastId = string | number;
export type RemoteToastMethod = (
  message: ToastMessage,
  options?: ExternalToast
) => ToastId;

export type RemoteToast = {
  success: RemoteToastMethod;
  info: RemoteToastMethod;
  warning: RemoteToastMethod;
  error: RemoteToastMethod;
  dismiss(id?: ToastId): void;
};

export type RemoteToastSession = {
  toasterId: string;
  api: RemoteToast;
};

export const RemoteToastContext = createContext<RemoteToastSession | null>(
  null
);
