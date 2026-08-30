import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn';
import { fireEvent, render, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RemotePortalProvider } from './remote-portal-provider';

describe('RemotePortalProvider', () => {
  afterEach(() => {
    document
      .querySelectorAll('[data-test-shell-sibling]')
      .forEach((element) => element.remove());
  });

  it('keeps dialog DOM below the remote-owned portal root', async () => {
    const shellSibling = document.createElement('aside');
    shellSibling.dataset.testShellSibling = '';
    document.body.prepend(shellSibling);
    const { container, unmount } = render(
      <div data-rmf-root="" className="dark">
        <RemotePortalProvider theme="dark">
          <Dialog open>
            <DialogContent>
              <DialogTitle>Scoped dialog</DialogTitle>
              <DialogDescription>Remote content</DialogDescription>
            </DialogContent>
          </Dialog>
        </RemotePortalProvider>
      </div>
    );

    const portalRoot = container.querySelector('[data-rmf-portal-root]');
    expect(portalRoot).toBeTruthy();
    expect(
      await within(portalRoot as HTMLElement).findByText('Scoped dialog')
    ).toBeTruthy();
    expect(
      document.body.querySelectorAll('[data-slot="dialog-content"]')
    ).toHaveLength(1);
    expect(portalRoot?.classList.contains('dark')).toBe(true);
    expect((portalRoot as HTMLElement).dataset.rmfTheme).toBe('dark');
    expect(shellSibling.getAttribute('aria-hidden')).toBeNull();
    expect(document.body.getAttribute('data-scroll-locked')).toBeNull();
    expect(document.body.style.overflow).toBe('');

    unmount();

    expect(
      document.body.querySelector('[data-slot="dialog-content"]')
    ).toBeNull();
    expect(document.body.querySelector('[data-rmf-portal-root]')).toBeNull();
    shellSibling.remove();
  });

  it('keeps Select non-modal and restores focus after normal close', async () => {
    const shellSibling = document.createElement('aside');
    shellSibling.dataset.testShellSibling = '';
    document.body.prepend(shellSibling);
    const { container } = render(
      <div data-rmf-root="">
        <RemotePortalProvider theme="light">
          <Select defaultOpen>
            <SelectTrigger aria-label="Team">
              <SelectValue placeholder="Choose a team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="platform">Platform</SelectItem>
              <SelectItem value="design">Design</SelectItem>
            </SelectContent>
          </Select>
        </RemotePortalProvider>
      </div>
    );

    const portalRoot = container.querySelector('[data-rmf-portal-root]');
    const listbox = await within(portalRoot as HTMLElement).findByRole(
      'listbox'
    );
    expect(listbox).toBeTruthy();
    expect(shellSibling.getAttribute('aria-hidden')).toBeNull();
    expect(document.body.getAttribute('data-scroll-locked')).toBeNull();
    expect(document.body.style.overflow).toBe('');

    fireEvent.click(within(listbox).getByRole('option', { name: 'Platform' }));

    await waitFor(() => {
      expect(
        container.querySelector('[data-slot="select-content"]')
      ).toBeNull();
    });
    expect(document.activeElement).toBe(
      container.querySelector('[data-slot="select-trigger"]')
    );
  });

  it('rejects a portal override outside the remote mount', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() =>
      render(
        <div data-rmf-root="">
          <RemotePortalProvider theme="light">
            <Dialog open>
              <DialogContent portalContainer={document.body}>
                <DialogTitle>Escaped dialog</DialogTitle>
                <DialogDescription>Invalid target</DialogDescription>
              </DialogContent>
            </Dialog>
          </RemotePortalProvider>
        </div>
      )
    ).toThrow(/must stay below/);

    consoleError.mockRestore();
  });
});
