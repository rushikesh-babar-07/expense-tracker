import { Trash2 } from "lucide-react";
import type { Expense } from "@/pages/Index";

interface ExpenseTableProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  Food: "bg-success/20 text-success",
  Travel: "bg-info/20 text-info",
  Shops: "bg-warning/20 text-warning",
  Health: "bg-destructive/20 text-destructive",
  Others: "bg-muted text-muted-foreground",
};

const ExpenseTable = ({ expenses, onDelete }: ExpenseTableProps) => {
  if (expenses.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        No expenses yet. Add one to get started!
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="pb-3 font-medium">Expense Name</th>
            <th className="pb-3 font-medium">Category</th>
            <th className="pb-3 font-medium">Amount</th>
            <th className="pb-3 font-medium">Date</th>
            <th className="pb-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr
              key={expense.id}
              className="border-b border-border/50 last:border-0"
            >
              <td className="py-3 text-card-foreground">{expense.name}</td>
              <td className="py-3">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[expense.category] || categoryColors.Others}`}
                >
                  {expense.category}
                </span>
              </td>
              <td className="py-3 text-card-foreground">
                ${expense.amount.toFixed(2)}
              </td>
              <td className="py-3 text-muted-foreground">{expense.date}</td>
              <td className="py-3 text-right">
                <button
                  onClick={() => onDelete(expense.id)}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;
