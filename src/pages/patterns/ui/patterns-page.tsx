import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/ui/shadcn';
import { useRemoteToast } from '@/shared/ui/remote-toast';
import {
  CircleDashedIcon,
  LoaderCircleIcon,
  MoreHorizontalIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { type FormEvent, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';

const EXAMPLE_STATES = ['draft', 'ready'] as const;
type ExampleState = (typeof EXAMPLE_STATES)[number];

export function PatternsPage() {
  const { t } = useTranslation();
  const toast = useRemoteToast();
  const exampleNameId = useId();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [exampleName, setExampleName] = useState('');
  const [exampleState, setExampleState] = useState<ExampleState>('draft');
  const [savedSummary, setSavedSummary] = useState<string | null>(null);

  const submitExample = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = exampleName.trim();

    if (!name) {
      toast.error(t('patterns.form.required'));
      return;
    }

    const summary = t('patterns.form.saved', {
      name,
      state: t(`patterns.form.states.${exampleState}`),
    });
    setSavedSummary(summary);
    toast.success(t('patterns.form.toast'));
  };

  return (
    <section className="@container/page space-y-6">
      <header className="space-y-2">
        <p className="text-muted-foreground text-sm font-medium">
          {t('patterns.eyebrow')}
        </p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {t('patterns.title')}
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm text-pretty">
          {t('patterns.description')}
        </p>
      </header>

      <Alert>
        <CircleDashedIcon />
        <AlertTitle>{t('patterns.optionalTitle')}</AlertTitle>
        <AlertDescription>{t('patterns.optionalDescription')}</AlertDescription>
      </Alert>

      <div className="grid gap-4 @3xl/page:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('patterns.form.title')}</CardTitle>
            <CardDescription>{t('patterns.form.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={submitExample}>
              <div className="space-y-2">
                <Label htmlFor={exampleNameId}>{t('patterns.form.name')}</Label>
                <Input
                  required
                  id={exampleNameId}
                  value={exampleName}
                  placeholder={t('patterns.form.namePlaceholder')}
                  onChange={(event) => setExampleName(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('patterns.form.state')}</Label>
                <Select
                  value={exampleState}
                  onValueChange={(value) =>
                    setExampleState(value as ExampleState)
                  }
                >
                  <SelectTrigger
                    className="w-full"
                    aria-label={t('patterns.form.state')}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXAMPLE_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {t(`patterns.form.states.${state}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button type="submit">{t('patterns.form.submit')}</Button>
                <Button disabled type="button" variant="outline">
                  {t('patterns.actions.disabled')}
                </Button>
              </div>

              {savedSummary ? (
                <p className="text-muted-foreground text-sm" role="status">
                  {savedSummary}
                </p>
              ) : null}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('patterns.actions.title')}</CardTitle>
            <CardDescription>
              {t('patterns.actions.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => setDialogOpen(true)}>
              {t('patterns.actions.dialog')}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline">
                  <MoreHorizontalIcon />
                  {t('patterns.actions.menu')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {t('patterns.actions.menuLabel')}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => toast.success(t('patterns.actions.success'))}
                >
                  {t('patterns.actions.success')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => toast.info(t('patterns.actions.info'))}
                >
                  {t('patterns.actions.info')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" variant="secondary">
                  {t('patterns.actions.hintToggle')}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('patterns.actions.hint')}</TooltipContent>
            </Tooltip>

            <Button
              type="button"
              variant="outline"
              onClick={() => toast.success(t('patterns.actions.success'))}
            >
              {t('patterns.actions.toast')}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('patterns.status.title')}</CardTitle>
          <CardDescription>{t('patterns.status.description')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 @2xl/page:grid-cols-2 @5xl/page:grid-cols-3">
          <Alert>
            <CircleDashedIcon />
            <AlertTitle>{t('patterns.status.emptyTitle')}</AlertTitle>
            <AlertDescription>
              {t('patterns.status.emptyDescription')}
            </AlertDescription>
          </Alert>
          <Alert>
            <LoaderCircleIcon className="animate-spin" />
            <AlertTitle>{t('patterns.status.loadingTitle')}</AlertTitle>
            <AlertDescription>
              {t('patterns.status.loadingDescription')}
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <TriangleAlertIcon />
            <AlertTitle>{t('patterns.status.errorTitle')}</AlertTitle>
            <AlertDescription>
              {t('patterns.status.errorDescription')}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('patterns.dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('patterns.dialog.description')}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
}
