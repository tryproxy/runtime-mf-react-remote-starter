import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn';

type PanelProps = {
  title: string;
  value: string;
  description: string;
};

export function Panel({ title, value, description }: PanelProps) {
  return (
    <Card size="sm" className="min-w-0">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl break-words">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}
