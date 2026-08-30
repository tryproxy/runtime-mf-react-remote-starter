import * as React from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/shared/lib';
import { useRemotePortalContainer } from '@/shared/ui/remote-portal';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';

type SelectProps = {
  children?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  name?: string;
  required?: boolean;
};

type SelectContextValue = {
  contentId: string;
  disabled: boolean;
  open: boolean;
  selectedLabel?: React.ReactNode;
  trigger: HTMLButtonElement | null;
  triggerId: string;
  value?: string;
  chooseValue: (value: string) => void;
  setOpen: (open: boolean) => void;
  setTrigger: (trigger: HTMLButtonElement | null) => void;
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext(): SelectContextValue {
  const context = React.useContext(SelectContext);

  if (!context) {
    throw new Error('Select components must be rendered inside Select.');
  }

  return context;
}

function collectItemLabels(
  children: React.ReactNode,
  labels: Map<string, React.ReactNode>
): void {
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    const childProps = child.props as {
      children?: React.ReactNode;
      value?: unknown;
    };

    if (child.type === SelectItem && typeof childProps.value === 'string') {
      labels.set(childProps.value, childProps.children);
    }

    collectItemLabels(childProps.children, labels);
  });
}

function Select(props: SelectProps) {
  const {
    children,
    defaultOpen = false,
    defaultValue,
    disabled = false,
    name,
    onOpenChange,
    onValueChange,
    open,
    required,
    value,
  } = props;
  const valueIsControlled = Object.prototype.hasOwnProperty.call(
    props,
    'value'
  );
  const openIsControlled = Object.prototype.hasOwnProperty.call(props, 'open');
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const triggerId = React.useId();
  const contentId = React.useId();
  const [trigger, setTrigger] = React.useState<HTMLButtonElement | null>(null);
  const currentValue = valueIsControlled ? value : internalValue;
  const currentOpen = openIsControlled ? Boolean(open) : internalOpen;
  const labels = new Map<string, React.ReactNode>();
  collectItemLabels(children, labels);

  const setOpen = (nextOpen: boolean) => {
    if (!openIsControlled) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const chooseValue = (nextValue: string) => {
    if (!valueIsControlled) {
      setInternalValue(nextValue);
    }
    onValueChange?.(nextValue);
    setOpen(false);
    queueMicrotask(() => trigger?.focus());
  };

  const context: SelectContextValue = {
    chooseValue,
    contentId,
    disabled,
    open: currentOpen,
    selectedLabel:
      currentValue === undefined ? undefined : labels.get(currentValue),
    setOpen,
    setTrigger,
    trigger,
    triggerId,
    value: currentValue,
  };

  return (
    <SelectContext.Provider value={context}>
      {children}
      {name ? (
        <input
          type="hidden"
          name={name}
          value={currentValue ?? ''}
          required={required}
        />
      ) : null}
    </SelectContext.Provider>
  );
}

function SelectGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      role="group"
      data-slot="select-group"
      className={cn('scroll-my-1 p-1', className)}
      {...props}
    />
  );
}

function SelectValue({
  children,
  placeholder,
  ...props
}: React.ComponentProps<'span'> & { placeholder?: React.ReactNode }) {
  const { selectedLabel, value } = useSelectContext();

  return (
    <span data-slot="select-value" {...props}>
      {children ?? selectedLabel ?? (value === undefined ? placeholder : value)}
    </span>
  );
}

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

function SelectTrigger({
  className,
  size = 'default',
  children,
  disabled,
  onClick,
  onKeyDown,
  ref,
  ...props
}: React.ComponentProps<'button'> & { size?: 'sm' | 'default' }) {
  const context = useSelectContext();
  const setTrigger = context.setTrigger;
  const setTriggerRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      setTrigger(node);
      assignRef(ref, node);
    },
    [ref, setTrigger]
  );

  return (
    <button
      ref={setTriggerRef}
      id={context.triggerId}
      type="button"
      role="combobox"
      aria-controls={context.contentId}
      aria-expanded={context.open}
      aria-haspopup="listbox"
      data-slot="select-trigger"
      data-size={size}
      data-placeholder={context.value === undefined ? '' : undefined}
      disabled={context.disabled || disabled}
      className={cn(
        "border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 flex w-fit items-center justify-between gap-1.5 rounded-lg border bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          context.setOpen(!context.open);
        }
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (
          !event.defaultPrevented &&
          ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)
        ) {
          event.preventDefault();
          context.setOpen(true);
        }
      }}
      {...props}
    >
      {children}
      <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4" />
    </button>
  );
}

type SelectContentProps = React.ComponentProps<'div'> & {
  align?: 'start' | 'center' | 'end';
  portalContainer?: HTMLElement;
  position?: 'item-aligned' | 'popper';
  sideOffset?: number;
};

function SelectContent({
  align = 'center',
  children,
  className,
  onKeyDown,
  portalContainer,
  position = 'item-aligned',
  ref,
  sideOffset = 4,
  style,
  ...props
}: SelectContentProps) {
  const context = useSelectContext();
  const container = useRemotePortalContainer(portalContainer);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [positionStyle, setPositionStyle] = React.useState<React.CSSProperties>(
    {}
  );

  const updatePosition = React.useCallback(() => {
    const trigger = context.trigger;
    if (!trigger) {
      return;
    }

    const triggerRect = trigger.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const contentWidth = contentRef.current?.offsetWidth ?? triggerRect.width;
    const left =
      align === 'start'
        ? triggerRect.left
        : align === 'end'
          ? triggerRect.right - contentWidth
          : triggerRect.left + (triggerRect.width - contentWidth) / 2;

    setPositionStyle({
      left: left - containerRect.left,
      minWidth: triggerRect.width,
      top: triggerRect.bottom - containerRect.top + sideOffset,
    });
  }, [align, container, context.trigger, sideOffset]);

  React.useLayoutEffect(() => {
    if (!context.open) {
      return;
    }

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [context.open, updatePosition]);

  React.useEffect(() => {
    if (!context.open) {
      return;
    }

    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !contentRef.current?.contains(target) &&
        !context.trigger?.contains(target)
      ) {
        context.setOpen(false);
      }
    };

    document.addEventListener('pointerdown', closeOnOutsidePointer, true);
    return () =>
      document.removeEventListener('pointerdown', closeOnOutsidePointer, true);
  }, [context]);

  React.useEffect(() => {
    if (!context.open) {
      return;
    }

    const selected = contentRef.current?.querySelector<HTMLElement>(
      '[role="option"][aria-selected="true"]'
    );
    const first =
      selected ??
      contentRef.current?.querySelector<HTMLElement>(
        '[role="option"]:not(:disabled)'
      );
    first?.focus();
  }, [context.open]);

  const focusOption = (direction: 'first' | 'last' | 'next' | 'previous') => {
    const options = Array.from(
      contentRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="option"]:not(:disabled)'
      ) ?? []
    );
    if (options.length === 0) {
      return;
    }

    const activeIndex = options.indexOf(
      document.activeElement as HTMLButtonElement
    );
    const nextIndex =
      direction === 'last'
        ? options.length - 1
        : direction === 'next'
          ? activeIndex < 0
            ? 0
            : (activeIndex + 1) % options.length
          : direction === 'previous'
            ? activeIndex <= 0
              ? options.length - 1
              : activeIndex - 1
            : 0;
    options[nextIndex]?.focus();
  };

  if (!context.open) {
    return null;
  }

  return createPortal(
    <div
      ref={(node) => {
        contentRef.current = node;
        assignRef(ref, node);
      }}
      id={context.contentId}
      role="listbox"
      aria-labelledby={context.triggerId}
      data-slot="select-content"
      data-align-trigger={position === 'item-aligned'}
      className={cn(
        'bg-popover text-popover-foreground ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 pointer-events-auto absolute z-50 max-h-72 min-w-36 overflow-x-hidden overflow-y-auto rounded-lg p-1 shadow-md ring-1 duration-100',
        position === 'popper' && 'w-max',
        className
      )}
      style={{ ...positionStyle, ...style }}
      tabIndex={-1}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) {
          return;
        }

        const directions = {
          ArrowDown: 'next',
          ArrowUp: 'previous',
          End: 'last',
          Home: 'first',
        } as const;
        const direction = directions[event.key as keyof typeof directions];

        if (direction) {
          event.preventDefault();
          focusOption(direction);
        } else if (event.key === 'Escape') {
          event.preventDefault();
          context.setOpen(false);
          context.trigger?.focus();
        } else if (event.key === 'Tab') {
          context.setOpen(false);
        }
      }}
      {...props}
    >
      {children}
    </div>,
    container
  );
}

function SelectLabel({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="select-label"
      className={cn('text-muted-foreground px-1.5 py-1 text-xs', className)}
      {...props}
    />
  );
}

type SelectItemProps = Omit<
  React.ComponentProps<'button'>,
  'onSelect' | 'value'
> & {
  value: string;
  onSelect?: (value: string) => void;
};

function SelectItem({
  className,
  children,
  disabled,
  onClick,
  onSelect,
  value,
  ...props
}: SelectItemProps) {
  const context = useSelectContext();
  const selected = context.value === value;

  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      data-slot="select-item"
      data-state={selected ? 'checked' : 'unchecked'}
      data-disabled={disabled ? '' : undefined}
      data-value={value}
      disabled={disabled}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-left text-sm outline-hidden select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          onSelect?.(value);
          context.chooseValue(value);
        }
      }}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        {selected ? <CheckIcon className="pointer-events-none" /> : null}
      </span>
      <span>{children}</span>
    </button>
  );
}

function SelectSeparator({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      role="separator"
      data-slot="select-separator"
      className={cn('bg-border pointer-events-none -mx-1 my-1 h-px', className)}
      {...props}
    />
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
