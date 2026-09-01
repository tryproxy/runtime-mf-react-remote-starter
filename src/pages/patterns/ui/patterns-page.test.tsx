import { createAppI18n } from '@/shared/i18n';
import { RemotePortalProvider } from '@/shared/ui/remote-portal';
import { RemoteToastProvider } from '@/shared/ui/remote-toast';
import { Toaster, TooltipProvider } from '@/shared/ui/shadcn';
import { fireEvent, render, within } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it } from 'vitest';
import { PatternsPage } from '..';

function renderPatternsPage() {
  const i18n = createAppI18n('en');

  return render(
    <div data-rmf-root="">
      <I18nextProvider i18n={i18n}>
        <RemotePortalProvider theme="light">
          <RemoteToastProvider>
            <TooltipProvider>
              <PatternsPage />
              <Toaster theme="light" />
            </TooltipProvider>
          </RemoteToastProvider>
        </RemotePortalProvider>
      </I18nextProvider>
    </div>
  );
}

describe('PatternsPage', () => {
  it('shows action help as a hover tooltip without shifting layout', () => {
    const { container } = renderPatternsPage();
    const page = within(container);
    const hintButton = page.getByRole('button', { name: 'Show hint' });
    const actions = hintButton.closest('[data-slot="card-content"]');

    expect(actions).toBeTruthy();
    expect(hintButton.closest('[data-slot="tooltip-trigger"]')).toBeTruthy();
    expect(hintButton.getAttribute('aria-expanded')).toBeNull();
    expect(
      actions?.textContent?.includes(
        'Helpful context belongs close to the action.'
      )
    ).toBe(false);

    fireEvent.click(hintButton);

    expect(hintButton.getAttribute('aria-expanded')).toBeNull();
    expect(
      actions?.textContent?.includes(
        'Helpful context belongs close to the action.'
      )
    ).toBe(false);
  });

  it('submits the neutral example form and opens the local dialog', async () => {
    const { container } = renderPatternsPage();

    expect(
      within(container).getByRole('heading', { name: 'Patterns' })
    ).toBeTruthy();

    fireEvent.change(within(container).getByLabelText('Example name'), {
      target: { value: 'Sample' },
    });
    fireEvent.click(within(container).getByLabelText('Example state'));
    fireEvent.click(
      await within(container).findByRole('option', { name: 'Ready' })
    );
    fireEvent.click(
      within(container).getByRole('button', { name: 'Submit example' })
    );

    expect(
      await within(container).findByText('Saved: Sample / Ready')
    ).toBeTruthy();

    fireEvent.click(
      within(container).getByRole('button', { name: 'Open dialog' })
    );
    expect(await within(container).findByText('Local dialog')).toBeTruthy();
  });
});
