import { ReactNode } from "react";

interface SummaryCardProps {
  title: string;
  value: number;
  icon: ReactNode;
}

const SummaryCard = ({ title, value, icon }: SummaryCardProps) => (
  <div className="rounded-xl border border-border bg-card p-5">
    <div className="mb-3 flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{title}</span>
      {icon}
    </div>
    <p className="text-2xl font-bold text-card-foreground">
      ${value.toFixed(2)}
    </p>
  </div>
);

export default SummaryCard;
