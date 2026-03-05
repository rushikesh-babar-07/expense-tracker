import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { MonthRecord } from "@/hooks/useExpenseStore";

interface MonthlyHistoryPageProps {
  history: MonthRecord[];
}

const categoryColors: Record<string, string> = {
  Food: "bg-success/20 text-success",
  Travel: "bg-info/20 text-info",
  Shops: "bg-warning/20 text-warning",
  Health: "bg-destructive/20 text-destructive",
  Others: "bg-muted text-muted-foreground",
};

const MonthlyHistoryPage = ({ history }: MonthlyHistoryPageProps) => {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const selected = history.find((h) => h.month === selectedMonth);

  const formatMonth = (m: string) => {
    const [year, month] = m.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  };

  if (selected) {
    const sorted = [...selected.expenses].sort((a, b) => b.date.localeCompare(a.date));
    const totalSpent = sorted.reduce((s, e) => s + e.amount, 0);

    return (
      <div>
        <button onClick={() => setSelectedMonth(null)} className="mb-4 text-sm text-primary transition-colors hover:underline">
          ← Back to months
        </button>
        <div className="mb-4 rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-bold text-card-foreground">{formatMonth(selected.month)}</h2>
          <div className="mt-2 flex gap-6 text-sm text-muted-foreground">
            <span>Deposit: <span className="text-foreground font-medium">₹{selected.deposit.toFixed(2)}</span></span>
            <span>Spent: <span className="text-destructive font-medium">₹{totalSpent.toFixed(2)}</span></span>
            <span>Saved: <span className="text-success font-medium">₹{selected.savings.toFixed(2)}</span></span>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-base font-semibold text-card-foreground mb-4">Transactions</h3>
          {sorted.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No transactions.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((e) => (
                  <tr key={e.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 text-card-foreground">{e.name}</td>
                    <td className="py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[e.category] || categoryColors.Others}`}>
                        {e.category}
                      </span>
                    </td>
                    <td className="py-3 text-card-foreground">₹{e.amount.toFixed(2)}</td>
                    <td className="py-3 text-muted-foreground">{e.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-4">Monthly History</h2>
      {history.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          No monthly history yet. History is saved when you reset your data.
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((record) => {
            const spent = record.expenses.reduce((s, e) => s + e.amount, 0);
            return (
              <button
                key={record.month}
                onClick={() => setSelectedMonth(record.month)}
                className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/50 hover:bg-accent"
              >
                <div>
                  <p className="font-semibold text-card-foreground">{formatMonth(record.month)}</p>
                  <p className="text-sm text-muted-foreground">
                    Deposit: ₹{record.deposit.toFixed(2)} · Spent: ₹{spent.toFixed(2)}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MonthlyHistoryPage;
