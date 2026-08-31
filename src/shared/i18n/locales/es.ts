export const es = {
  nav: {
    moduleTitle: 'Remoto inicial',
    language: 'Idioma',
    theme: 'Tema',
    light: 'Claro',
    dark: 'Oscuro',
  },
  overview: {
    eyebrow: 'Starter remoto de React',
    title: 'Remoto inicial',
    description:
      'Una superficie de aplicación pequeña y neutral, lista para adaptarse a un dominio de producto.',
    readyTitle: 'Listo para desarrollar',
    readyDescription:
      'El enrutamiento, la localización, el tema, la integración con el host y el aislamiento de errores ya están conectados.',
    cards: {
      start: {
        title: 'Empieza por el dominio',
        description:
          'Sustituye este contenido neutral por el primer flujo real.',
        detail:
          'Mantén el lenguaje y el comportamiento del producto dentro del remoto.',
      },
      integrate: {
        title: 'Integra mediante el bridge',
        description: 'Usa las capacidades del host mediante el contrato común.',
        detail:
          'El shell conserva la navegación global y la política de sesión.',
      },
      ship: {
        title: 'Publica de forma independiente',
        description: 'Compila y publica el remoto como una unidad versionada.',
        detail: 'El shell consume el manifiesto de federación generado.',
      },
    },
  },
  patterns: {
    eyebrow: 'Página de referencia opcional',
    title: 'Patrones',
    description:
      'Una referencia compacta y accesible de los componentes conservados en el starter.',
    optionalTitle: 'Se puede eliminar',
    optionalDescription:
      'Elimina esta ruta cuando el producto tenga sus propios patrones de interfaz.',
    form: {
      title: 'Formulario pequeño',
      description: 'Campos controlados, etiquetas, foco y respuesta en línea.',
      name: 'Nombre del ejemplo',
      namePlaceholder: 'Introduce un nombre',
      state: 'Estado del ejemplo',
      states: { draft: 'Borrador', ready: 'Listo' },
      submit: 'Guardar ejemplo',
      required: 'Introduce un nombre para el ejemplo.',
      saved: 'Guardado: {{name}} / {{state}}',
      toast: 'Ejemplo guardado',
    },
    actions: {
      title: 'Acciones y capas',
      description: 'Diálogo, menú, ayuda, aviso y estados deshabilitados.',
      disabled: 'Deshabilitado',
      dialog: 'Abrir diálogo',
      menu: 'Abrir menú',
      menuLabel: 'Acciones de ejemplo',
      success: 'Correcto',
      info: 'Información',
      tooltip: 'Mostrar ayuda',
      hint: 'El contexto útil debe estar cerca de la acción.',
      toast: 'Mostrar aviso',
    },
    status: {
      title: 'Estados',
      description: 'Ejemplos neutrales de estados asíncronos comunes.',
      emptyTitle: 'Todavía no hay nada',
      emptyDescription: 'Explica cómo crear el primer elemento.',
      loadingTitle: 'Cargando',
      loadingDescription: 'Mantén estable el diseño circundante.',
      errorTitle: 'No se pudo cargar',
      errorDescription: 'Describe la recuperación con palabras sencillas.',
    },
    dialog: {
      title: 'Diálogo local',
      description: 'Esta capa está contenida en el montaje remoto actual.',
    },
  },
  error: {
    title: 'Algo salió mal en este módulo',
    description:
      'El módulo encontró un error de renderizado. El shell debe seguir disponible.',
    label: 'Error',
    retry: 'Reintentar',
  },
} as const;
