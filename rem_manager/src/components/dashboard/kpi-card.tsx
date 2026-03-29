import { Card, CardContent, CardHeader } from "@/components/ui/card";

type KpiCardProps = {
  label: string;
  value: string | number;
  note: string;
};

export function KpiCard({ label, value, note }: KpiCardProps) {
  return (
    <Card className="border-slate-200/80">
      <CardHeader className="pb-3">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
      </CardHeader>
      <CardContent>
        <p className="font-heading text-3xl font-semibold">{value}</p>
        <p className="mt-2 text-sm text-muted-foreground">{note}</p>
      </CardContent>
    </Card>
  );
}
