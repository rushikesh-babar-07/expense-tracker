import { useState } from "react";
import { Wallet, TrendingDown, PiggyBank, DollarSign, Plus } from "lucide-react";
import SummaryCard from "@/components/SummaryCard";
import ExpenseTable from "@/components/ExpenseTable";
import AddExpenseModal from "@/components/AddExpenseModal";
import DepositModal from "@/components/DepositModal";
import type { Expense } from "@/hooks/useExpenseStore";

interface DashboardProps {
  expenses: Expense[];
  deposit: number;
  totalSpent: number;
  remaining: number;
  savingsEstimate: number;
  totalSavings: number;
  addExpense: (e: Omit<Expense, "id">) => void;
  editExpense: (id: string, e: Omit<Expense, "id">) => void;
  deleteExpense: (id: string) => void;
  updateDeposit: (amount: number) => void;
  addToDeposit: (amount: number) => void;
}

const Dashboard = ({
  expenses, deposit, totalSpent, remaining, savingsEstimate, totalSavings,
  addExpense, editExpense, deleteExpense, updateDeposit, addToDeposit,
}: DashboardProps) => {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  const handleCloseExpenseModal = () => {
    setIsExpenseModalOpen(false);
    setEditingExpense(null);
  };

  return (
    <div>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Monthly Deposit" value={deposit} icon={<Wallet className="h-5 w-5 text-info" />} clickable onClick={() => setIsDepositModalOpen(true)} />
        <SummaryCard title="Total Spent" value={totalSpent} icon={<TrendingDown className="h-5 w-5 text-destructive" />} />
        <SummaryCard title="Remaining Balance" value={remaining} icon={<DollarSign className="h-5 w-5 text-success" />} />
        <SummaryCard title="Savings (est.)" value={savingsEstimate} icon={<PiggyBank className="h-5 w-5 text-warning" />} />
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-card-foreground">Recent Expenses</h2>
          <button
            onClick={() => { setEditingExpense(null); setIsExpenseModalOpen(true); }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add Expense
          </button>
        </div>
        <ExpenseTable expenses={expenses} onDelete={deleteExpense} onEdit={handleEdit} />
      </div>

      <AddExpenseModal
        open={isExpenseModalOpen}
        onClose={handleCloseExpenseModal}
        onAdd={addExpense}
        onEdit={editExpense}
        editingExpense={editingExpense}
      />
      <DepositModal
        open={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        currentDeposit={deposit}
        onUpdate={updateDeposit}
        onAddExtra={addToDeposit}
      />
    </div>
  );
};

export default Dashboard;
