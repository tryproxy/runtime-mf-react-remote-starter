import { useContext } from 'react';
import {
  RemoteToastContext,
  type RemoteToast,
  type RemoteToastSession,
} from './remote-toast-context';

function useRemoteToastSession(): RemoteToastSession {
  const session = useContext(RemoteToastContext);

  if (!session) {
    throw new Error(
      'Remote toast components must be rendered inside RemoteToastProvider.'
    );
  }

  return session;
}

export function useRemoteToast(): RemoteToast {
  return useRemoteToastSession().api;
}

export function useRemoteToasterId(): string {
  return useRemoteToastSession().toasterId;
}
