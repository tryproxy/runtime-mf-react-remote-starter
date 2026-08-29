import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  MoreHorizontal,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { cn } from '@/shared/lib';
import {
  Button,
  Calendar,
  Checkbox,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/ui/shadcn';

const TEAMS = ['platform', 'design', 'growth'] as const;
const FRAMEWORKS = [
  { value: 'react', labelKey: 'form.frameworkReact' },
  { value: 'vue', labelKey: 'form.frameworkVue' },
  { value: 'svelte', labelKey: 'form.frameworkSvelte' },
  { value: 'solid', labelKey: 'form.frameworkSolid' },
] as const;

function buildSchema(t: (key: string) => string) {
  return z.object({
    title: z.string().min(3, { message: t('form.validationTitle') }),
    team: z.enum(TEAMS, {
      required_error: t('form.validationTeam'),
      invalid_type_error: t('form.validationTeam'),
    }),
    framework: z.string().min(1, { message: t('form.validationFramework') }),
    dueDate: z.date({
      required_error: t('form.validationDueDate'),
      invalid_type_error: t('form.validationDueDate'),
    }),
    notify: z.boolean(),
    terms: z.boolean().refine((value) => value, {
      message: t('form.validationTerms'),
    }),
  });
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

type FormPageProps = {
  basename: string;
};

export function FormPage({ basename }: FormPageProps) {
  const { t } = useTranslation();
  const schema = useMemo(() => buildSchema(t), [t]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<FormValues | null>(null);
  const [frameworkOpen, setFrameworkOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      team: undefined,
      framework: '',
      dueDate: undefined,
      notify: true,
      terms: false,
    },
    mode: 'onSubmit',
  });

  const watched = form.watch();

  const onValid = (values: FormValues) => {
    setPendingPayload(values);
    setDialogOpen(true);
    toast.success(t('form.toastSubmitReady'), {
      description: t('form.toastSubmitReadyDesc'),
    });
  };

  const onInvalid = () => {
    toast.error(t('form.toastValidation'), {
      description: t('form.toastValidationDesc'),
    });
  };

  const confirmSubmit = () => {
    setDialogOpen(false);
    toast.success(t('form.toastSuccess'), {
      description: pendingPayload?.title,
    });
  };

  const fireToastStack = () => {
    toast.success(t('form.toastVariantSuccess'));
    toast.error(t('form.toastVariantError'));
    toast.info(t('form.toastVariantInfo'));
    toast.warning(t('form.toastVariantWarning'));
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            {t('form.title')}
          </h3>
          <p className="text-muted-foreground mt-2 font-mono text-xs">
            {basename || '(none)'}
            /form
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fireToastStack}
              >
                {t('form.toastStack')}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('form.toastStackHint')}</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                <MoreHorizontal className="size-4" />
                {t('form.actions')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[100]">
              <DropdownMenuLabel>{t('form.actionsLabel')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => toast.info(t('form.toastMenuInfo'))}
              >
                {t('form.actionInfo')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => toast.success(t('form.toastMenuSuccess'))}
              >
                {t('form.actionSuccess')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => toast.error(t('form.toastMenuError'))}
              >
                {t('form.actionError')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onValid, onInvalid)}
          className="bg-card ring-foreground/10 wideMobile:p-6 space-y-6 rounded-xl p-4 ring-1"
          noValidate
        >
          <div className="wideMobile:grid-cols-2 grid gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="wideMobile:col-span-2">
                  <FormLabel>{t('form.fieldTitle')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('form.fieldTitlePlaceholder')}
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t('form.fieldTitleHint')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="team"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.fieldTeam')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t('form.fieldTeamPlaceholder')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="z-[100]">
                      {TEAMS.map((team) => (
                        <SelectItem key={team} value={team}>
                          {t(`form.team.${team}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="framework"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.fieldFramework')}</FormLabel>
                  <Popover open={frameworkOpen} onOpenChange={setFrameworkOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          aria-expanded={frameworkOpen}
                          className={cn(
                            'w-full justify-between font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? t(
                                FRAMEWORKS.find(
                                  (item) => item.value === field.value
                                )?.labelKey ?? 'form.fieldFrameworkPlaceholder'
                              )
                            : t('form.fieldFrameworkPlaceholder')}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="z-[100] w-[var(--radix-popover-trigger-width)] p-0">
                      <Command>
                        <CommandInput
                          placeholder={t('form.fieldFrameworkSearch')}
                        />
                        <CommandList>
                          <CommandEmpty>
                            {t('form.fieldFrameworkEmpty')}
                          </CommandEmpty>
                          <CommandGroup>
                            {FRAMEWORKS.map((item) => (
                              <CommandItem
                                key={item.value}
                                value={item.value}
                                data-checked={field.value === item.value}
                                onSelect={(value) => {
                                  field.onChange(value);
                                  setFrameworkOpen(false);
                                }}
                              >
                                {t(item.labelKey)}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    field.value === item.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.fieldDueDate')}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="size-4" />
                          {field.value
                            ? format(field.value, 'PPP')
                            : t('form.fieldDueDatePlaceholder')}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="z-[100] w-auto p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notify"
              render={({ field }) => (
                <FormItem className="wideMobile:col-span-2 flex flex-row items-center justify-between gap-4 rounded-lg border p-4">
                  <FormLabel>{t('form.fieldNotify')}</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="wideMobile:col-span-2 flex flex-row items-start gap-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t('form.fieldTerms')}</FormLabel>
                    <FormDescription>
                      {t('form.fieldTermsHint')}
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="submit">{t('form.submit')}</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setSheetOpen(true)}
            >
              {t('form.previewSheet')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                form.reset();
                toast.info(t('form.toastReset'));
              }}
            >
              {t('form.reset')}
            </Button>
          </div>
        </form>
      </Form>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="z-[100] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('form.dialogTitle')}</DialogTitle>
            <DialogDescription>{t('form.dialogDescription')}</DialogDescription>
          </DialogHeader>
          <pre className="bg-muted max-h-64 overflow-auto rounded-lg p-3 text-xs">
            {JSON.stringify(
              pendingPayload
                ? {
                    ...pendingPayload,
                    dueDate: pendingPayload.dueDate
                      ? format(pendingPayload.dueDate, 'yyyy-MM-dd')
                      : null,
                  }
                : null,
              null,
              2
            )}
          </pre>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              {t('form.dialogCancel')}
            </Button>
            <Button type="button" onClick={confirmSubmit}>
              {t('form.dialogConfirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="z-[100] sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{t('form.sheetTitle')}</SheetTitle>
            <SheetDescription>{t('form.sheetDescription')}</SheetDescription>
          </SheetHeader>
          <div className="space-y-3 px-4 pb-4 text-sm">
            <PreviewRow label={t('form.fieldTitle')} value={watched.title} />
            <PreviewRow
              label={t('form.fieldTeam')}
              value={watched.team ? t(`form.team.${watched.team}`) : '—'}
            />
            <PreviewRow
              label={t('form.fieldFramework')}
              value={
                watched.framework
                  ? t(
                      FRAMEWORKS.find(
                        (item) => item.value === watched.framework
                      )?.labelKey ?? 'form.fieldFrameworkPlaceholder'
                    )
                  : '—'
              }
            />
            <PreviewRow
              label={t('form.fieldDueDate')}
              value={watched.dueDate ? format(watched.dueDate, 'PPP') : '—'}
            />
            <PreviewRow
              label={t('form.fieldNotify')}
              value={watched.notify ? t('form.yes') : t('form.no')}
            />
            <PreviewRow
              label={t('form.fieldTerms')}
              value={watched.terms ? t('form.yes') : t('form.no')}
            />
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}

function PreviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="border-border/60 flex flex-col gap-0.5 border-b pb-2 last:border-0">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="font-medium break-words">{value || '—'}</span>
    </div>
  );
}
