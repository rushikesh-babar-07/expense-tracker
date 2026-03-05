import { useState } from "react";
import { Wallet, TrendingDown, PiggyBank, DollarSign, Plus } from "lucide-react";
import SummaryCard from "@/components/SummaryCard";
import ExpenseTable from "@/components/ExpenseTable";
import AddExpenseModal from "@/components/AddExpenseModal";

export interface Expense {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
}

const INITIAL_DEPOSIT = 1000;

const SAMPLE_EXPENSES: Expense[] = [
  { id: "1", name: "Groceries", category: "Food", amount: 45.50, date: "2026-03-04" },
  { id: "2", name: "Bus Pass", category: "Travel", amount: 30, date: "2026-03-03" },
  { id: "3", name: "Notebooks", category: "Shops", amount: 12.99, date: "2026-03-02" },
  { id: "4", name: "Gym Membership", category: "Health", amount: 25, date: "2026-03-01" },
];

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>(SAMPLE_EXPENSES);
  const [deposit] = useState(INITIAL_DEPOSIT);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = deposit - totalSpent;
  const savings = remaining > 0 ? remaining * 0.2 : 0;

  const addExpense = (expense: Omit<Expense, "id">) => {
    setExpenses((prev) => [
      { ...expense, id: Date.now().toString() },
      ...prev,
    ]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-2xl font-bold text-foreground">
          💰 Expense Tracker
        </h1>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Monthly Deposit"
            value={deposit}
            icon={<Wallet className="h-5 w-5 text-info" />}
          />
          <SummaryCard
            title="Total Spent"
            value={totalSpent}
            icon={<TrendingDown className="h-5 w-5 text-destructive" />}
          />
          <SummaryCard
            title="Remaining Balance"
            value={remaining}
            icon={<DollarSign className="h-5 w-5 text-success" />}
          />
          <SummaryCard
            title="Savings"
            value={savings}
            icon={<PiggyBank className="h-5 w-5 text-warning" />}
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-card-foreground">
              Recent Expenses
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add Expense
            </button>
          </div>
          <ExpenseTable expenses={expenses} onDelete={deleteExpense} />
        </div>
      </div>

      <AddExpenseModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addExpense}
      />
    </div>
  );
};

export default Index;
