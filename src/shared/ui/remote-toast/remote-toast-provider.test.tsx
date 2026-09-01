import { fireEvent, render, screen } from '@testing-library/react';
import { toast } from 'sonner';
import { describe, expect, it, vi } from 'vitest';
import { RemoteToastProvider, useRemoteToast } from '.';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(() => 'toast-1'),
    info: vi.fn(() => 'toast-2'),
    warning: vi.fn(() => 'toast-3'),
    error: vi.fn(() => 'toast-4'),
    dismiss: vi.fn(),
  },
}));

function ToastTrigger() {
  const remoteToast = useRemoteToast();
  return <button onClick={() => remoteToast.success('Saved')}>Notify</button>;
}

describe('RemoteToastProvider', () => {
  it('targets one toaster and dismisses its notifications on unmount', () => {
    const { unmount } = render(
      <RemoteToastProvider>
        <ToastTrigger />
      </RemoteToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Notify' }));

    expect(toast.success).toHaveBeenCalledWith(
      'Saved',
      expect.objectContaining({ toasterId: expect.any(String) })
    );

    unmount();

    expect(toast.dismiss).toHaveBeenCalledWith('toast-1');
  });
});
