export const ru = {
  nav: {
    moduleTitle: 'Стартовый remote-модуль',
    language: 'Язык',
    theme: 'Тема',
    light: 'Светлая',
    dark: 'Тёмная',
  },
  overview: {
    eyebrow: 'Стартер React remote',
    title: 'Стартовый remote-модуль',
    description:
      'Небольшая нейтральная поверхность приложения, готовая к адаптации под продуктовый домен.',
    readyTitle: 'Готов к развитию',
    readyDescription:
      'Маршрутизация, локализация, тема, интеграция с host и изоляция ошибок уже подключены.',
    cards: {
      start: {
        title: 'Начните с домена',
        description: 'Замените нейтральный контент первым реальным сценарием.',
        detail:
          'Продуктовые термины и поведение должны оставаться внутри remote.',
      },
      integrate: {
        title: 'Интегрируйтесь через bridge',
        description:
          'Используйте возможности host через общий runtime-контракт.',
        detail:
          'Shell сохраняет владение глобальной навигацией и политикой сессии.',
      },
      ship: {
        title: 'Поставляйте независимо',
        description:
          'Собирайте и публикуйте remote как отдельно версионируемый модуль.',
        detail: 'Shell использует сгенерированный federation manifest.',
      },
    },
  },
  patterns: {
    eyebrow: 'Необязательная справочная страница',
    title: 'Паттерны',
    description:
      'Компактный доступный пример UI-примитивов, сохранённых в стартере.',
    optionalTitle: 'Можно безопасно удалить',
    optionalDescription:
      'Удалите этот маршрут и страницу, когда в продукте появятся собственные интерфейсные паттерны.',
    form: {
      title: 'Небольшая форма',
      description:
        'Управляемые поля, подписи, состояния фокуса и обратная связь.',
      name: 'Название примера',
      namePlaceholder: 'Введите название',
      state: 'Состояние примера',
      states: { draft: 'Черновик', ready: 'Готово' },
      submit: 'Сохранить пример',
      required: 'Введите название примера.',
      saved: 'Сохранено: {{name}} / {{state}}',
      toast: 'Пример сохранён',
    },
    actions: {
      title: 'Действия и оверлеи',
      description: 'Dialog, dropdown, tooltip, toast и disabled-состояния.',
      disabled: 'Недоступно',
      dialog: 'Открыть dialog',
      menu: 'Открыть меню',
      menuLabel: 'Примеры действий',
      success: 'Успех',
      info: 'Информация',
      tooltip: 'Показать подсказку',
      hint: 'Полезный контекст должен быть рядом с действием.',
      toast: 'Показать toast',
    },
    status: {
      title: 'Состояния',
      description: 'Нейтральные примеры частых асинхронных состояний.',
      emptyTitle: 'Пока ничего нет',
      emptyDescription: 'Объясните, как создать первый элемент.',
      loadingTitle: 'Загрузка',
      loadingDescription: 'Сохраняйте окружающий layout стабильным.',
      errorTitle: 'Не удалось загрузить',
      errorDescription: 'Опишите способ восстановления простыми словами.',
    },
    dialog: {
      title: 'Локальный dialog',
      description: 'Этот оверлей ограничен текущим mount remote-модуля.',
    },
  },
  error: {
    title: 'В этом модуле что-то сломалось',
    description:
      'Модуль поймал ошибку рендера. Layout shell должен оставаться доступным.',
    label: 'Ошибка',
    retry: 'Повторить',
  },
} as const;
