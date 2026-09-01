import { useEffect, useId, useMemo, useRef, type ReactNode } from 'react';
import { toast, type ExternalToast } from 'sonner';
import {
  RemoteToastContext,
  type RemoteToast,
  type ToastId,
} from './remote-toast-context';

type RemoteToastProviderProps = {
  children: ReactNode;
};

/** Scopes emitted Sonner notifications and cleanup to one mount session. */
export function RemoteToastProvider({ children }: RemoteToastProviderProps) {
  const reactId = useId();
  const toasterId = `rmf-toaster-${reactId.replaceAll(':', '')}`;
  const toastIds = useRef(new Set<ToastId>());

  const api = useMemo<RemoteToast>(() => {
    const track = (id: ToastId) => {
      toastIds.current.add(id);
      return id;
    };
    const withToaster = (options?: ExternalToast): ExternalToast => ({
      ...options,
      toasterId,
    });

    return {
      success: (message, options) =>
        track(toast.success(message, withToaster(options))),
      info: (message, options) =>
        track(toast.info(message, withToaster(options))),
      warning: (message, options) =>
        track(toast.warning(message, withToaster(options))),
      error: (message, options) =>
        track(toast.error(message, withToaster(options))),
      dismiss: (id) => {
        if (id !== undefined) {
          toastIds.current.delete(id);
          toast.dismiss(id);
          return;
        }

        toastIds.current.forEach((toastId) => toast.dismiss(toastId));
        toastIds.current.clear();
      },
    };
  }, [toasterId]);

  useEffect(
    () => () => {
      api.dismiss();
    },
    [api]
  );

  const session = useMemo(() => ({ toasterId, api }), [api, toasterId]);

  return (
    <RemoteToastContext.Provider value={session}>
      {children}
    </RemoteToastContext.Provider>
  );
}
