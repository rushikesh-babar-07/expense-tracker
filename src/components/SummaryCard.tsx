import { ReactNode } from "react";

interface SummaryCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  onClick?: () => void;
  clickable?: boolean;
}

const SummaryCard = ({ title, value, icon, onClick, clickable }: SummaryCardProps) => (
  <div
    onClick={onClick}
    className={`rounded-xl border border-border bg-card p-5 transition-colors ${
      clickable ? "cursor-pointer hover:border-primary/50 hover:bg-accent" : ""
    }`}
  >
    <div className="mb-3 flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{title}</span>
      {icon}
    </div>
    <p className="text-2xl font-bold text-card-foreground">
      ₹{value.toFixed(2)}
    </p>
    {clickable && (
      <p className="mt-1 text-xs text-muted-foreground">Click to manage</p>
    )}
  </div>
);

export default SummaryCard;
