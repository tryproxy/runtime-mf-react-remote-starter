export const en = {
  nav: {
    moduleTitle: 'Starter Remote',
    language: 'Language',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
  },
  overview: {
    eyebrow: 'React remote starter',
    title: 'Starter remote',
    description:
      'A small, neutral application surface ready to adapt to a product domain.',
    readyTitle: 'Ready to build on',
    readyDescription:
      'Routing, localization, theming, host integration, and error isolation are already connected.',
    cards: {
      start: {
        title: 'Start with the domain',
        description:
          'Replace this neutral content with the first real workflow.',
        detail: 'Keep product language and behavior inside the remote.',
      },
      integrate: {
        title: 'Integrate through the bridge',
        description:
          'Use host capabilities through the shared runtime contract.',
        detail:
          'The shell keeps ownership of global navigation and session policy.',
      },
      ship: {
        title: 'Ship independently',
        description:
          'Build and publish the remote as an independently versioned unit.',
        detail: 'The shell consumes the generated federation manifest.',
      },
    },
  },
  patterns: {
    eyebrow: 'Optional reference page',
    title: 'Patterns',
    description:
      'A compact, accessible reference for the UI primitives retained by the starter.',
    optionalTitle: 'Safe to remove',
    optionalDescription:
      'Delete this route and page when the product has its own interface patterns.',
    form: {
      title: 'Small form',
      description:
        'Controlled fields, labels, focus states, and inline feedback.',
      name: 'Example name',
      namePlaceholder: 'Enter a name',
      state: 'Example state',
      states: { draft: 'Draft', ready: 'Ready' },
      submit: 'Submit example',
      required: 'Enter an example name.',
      saved: 'Saved: {{name}} / {{state}}',
      toast: 'Example saved',
    },
    actions: {
      title: 'Actions and overlays',
      description: 'Dialog, dropdown, tooltip, toast, and disabled states.',
      disabled: 'Disabled',
      dialog: 'Open dialog',
      menu: 'Open menu',
      menuLabel: 'Example actions',
      success: 'Success',
      info: 'Information',
      hintToggle: 'Show hint',
      hint: 'Helpful context belongs close to the action.',
      toast: 'Show toast',
    },
    status: {
      title: 'Status patterns',
      description: 'Neutral examples for common asynchronous states.',
      emptyTitle: 'Nothing here yet',
      emptyDescription: 'Explain what can create the first item.',
      loadingTitle: 'Loading',
      loadingDescription: 'Keep the surrounding layout stable.',
      errorTitle: 'Could not load',
      errorDescription: 'Describe the recovery action in plain language.',
    },
    dialog: {
      title: 'Local dialog',
      description: 'This overlay is contained by the current remote mount.',
    },
  },
  error: {
    title: 'Something went wrong in this module',
    description:
      'The module hit a render error. The shell layout should still be usable.',
    label: 'Error',
    retry: 'Retry',
  },
} as const;
