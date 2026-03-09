import { useState } from "react";
import { Wallet, TrendingDown, PiggyBank, DollarSign, Plus, Loader2, CalendarPlus } from "lucide-react";
import SummaryCard from "@/components/SummaryCard";
import ExpenseTable from "@/components/ExpenseTable";
import AddExpenseModal from "@/components/AddExpenseModal";
import DepositModal from "@/components/DepositModal";
import StartNewMonthModal from "@/components/StartNewMonthModal";
import ExpenseAnalytics from "@/components/ExpenseAnalytics";
import type { Expense, MonthRecord } from "@/hooks/useExpenseStore";

interface DashboardProps {
  expenses: Expense[];
  deposit: number;
  totalSpent: number;
  remaining: number;
  totalSavings: number;
  addExpense: (e: Omit<Expense, "id">) => void;
  editExpense: (id: string, e: Omit<Expense, "id">) => void;
  deleteExpense: (id: string) => void;
  updateDeposit: (amount: number) => void;
  addToDeposit: (amount: number) => void;
  startNewMonth: (newBudget: number, transferToSavings: boolean) => Promise<{ newBudget: number; transferred: number } | undefined>;
}

const Dashboard = ({
  expenses, deposit, totalSpent, remaining, totalSavings,
  addExpense, editExpense, deleteExpense, updateDeposit, addToDeposit, startNewMonth,
}: DashboardProps) => {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isNewMonthModalOpen, setIsNewMonthModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  const handleCloseExpenseModal = () => {
    setIsExpenseModalOpen(false);
    setEditingExpense(null);
  };

  const withLoading = (fn: (...args: any[]) => any) => async (...args: any[]) => {
    setActionLoading(true);
    const result = await fn(...args);
    setActionLoading(false);
    return result;
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Monthly Deposit" value={deposit} icon={<Wallet className="h-5 w-5 text-info" />} clickable onClick={() => setIsDepositModalOpen(true)} />
        <SummaryCard title="Total Spent" value={totalSpent} icon={<TrendingDown className="h-5 w-5 text-destructive" />} />
        <SummaryCard title="Remaining Balance" value={remaining} icon={<DollarSign className="h-5 w-5 text-success" />} />
        <SummaryCard title="Total Savings" value={totalSavings} icon={<PiggyBank className="h-5 w-5 text-warning" />} />
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-card-foreground">Recent Expenses</h2>
            {actionLoading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNewMonthModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground hover:-translate-y-px"
            >
              <CalendarPlus className="h-4 w-4" />
              Start New Month
            </button>
            <button
              onClick={() => { setEditingExpense(null); setIsExpenseModalOpen(true); }}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-200 hover:opacity-90 hover:shadow-md hover:shadow-primary/20 hover:-translate-y-px active:translate-y-0 active:shadow-none"
            >
              <Plus className="h-4 w-4" />
              Add Expense
            </button>
          </div>
        </div>
        <ExpenseTable expenses={expenses} onDelete={withLoading(deleteExpense)} onEdit={handleEdit} />
      </div>

      <AddExpenseModal
        open={isExpenseModalOpen}
        onClose={handleCloseExpenseModal}
        onAdd={withLoading(addExpense)}
        onEdit={withLoading(editExpense)}
        editingExpense={editingExpense}
      />
      <DepositModal
        open={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        currentDeposit={deposit}
        onUpdate={withLoading(updateDeposit)}
        onAddExtra={withLoading(addToDeposit)}
      />
      <StartNewMonthModal
        open={isNewMonthModalOpen}
        onClose={() => setIsNewMonthModalOpen(false)}
        remaining={remaining}
        totalSavings={totalSavings}
        onStart={withLoading(startNewMonth)}
      />
    </div>
  );
};

export default Dashboard;
