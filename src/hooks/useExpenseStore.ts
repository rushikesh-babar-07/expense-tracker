import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface Expense {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  isDefault?: boolean;
}

export interface SavingsEntry {
  id: string;
  type: "add" | "deduct";
  amount: number;
  note: string;
  date: string;
}

export interface MonthRecord {
  month: string; // "2026-03"
  deposit: number;
  expenses: Expense[];
  savings: number;
}

const CATEGORIES = ["Food", "Travel", "Shops", "Health", "Others"] as const;

const DEFAULT_EXPENSES: Omit<Expense, "id" | "date">[] = [
  { name: "Mess Fee", category: "Food", amount: 3500, isDefault: true },
  { name: "Room Rent", category: "Others", amount: 5000, isDefault: true },
];

const currentMonth = () => new Date().toISOString().slice(0, 7);
const today = () => new Date().toISOString().split("T")[0];

function generateDefaultExpenses(): Expense[] {
  return DEFAULT_EXPENSES.map((e, i) => ({
    ...e,
    id: `default-${i}-${Date.now()}`,
    date: today(),
  }));
}

const SAMPLE_EXPENSES: Expense[] = [
  { id: "1", name: "Mess Fee", category: "Food", amount: 3500, date: "2026-03-01", isDefault: true },
  { id: "2", name: "Room Rent", category: "Others", amount: 5000, date: "2026-03-01", isDefault: true },
  { id: "3", name: "Groceries", category: "Food", amount: 450, date: "2026-03-04" },
  { id: "4", name: "Bus Ticket", category: "Travel", amount: 120, date: "2026-03-03" },
  { id: "5", name: "Notebooks", category: "Shops", amount: 199, date: "2026-03-02" },
];

export function useExpenseStore() {
  const [expenses, setExpenses] = useState<Expense[]>(SAMPLE_EXPENSES);
  const [deposit, setDeposit] = useState(15000);
  const [totalSavings, setTotalSavings] = useState(0);
  const [savingsHistory, setSavingsHistory] = useState<SavingsEntry[]>([]);
  const [monthlyHistory, setMonthlyHistory] = useState<MonthRecord[]>([
    {
      month: "2026-02",
      deposit: 12000,
      expenses: [
        { id: "h1", name: "Mess Fee", category: "Food", amount: 3500, date: "2026-02-01", isDefault: true },
        { id: "h2", name: "Room Rent", category: "Others", amount: 5000, date: "2026-02-01", isDefault: true },
        { id: "h3", name: "Movie Tickets", category: "Others", amount: 300, date: "2026-02-14" },
        { id: "h4", name: "Medicine", category: "Health", amount: 250, date: "2026-02-10" },
      ],
      savings: 2950,
    },
    {
      month: "2026-01",
      deposit: 10000,
      expenses: [
        { id: "h5", name: "Mess Fee", category: "Food", amount: 3500, date: "2026-01-01", isDefault: true },
        { id: "h6", name: "Room Rent", category: "Others", amount: 5000, date: "2026-01-01", isDefault: true },
        { id: "h7", name: "Stationery", category: "Shops", amount: 400, date: "2026-01-15" },
      ],
      savings: 1100,
    },
  ]);
  const [defaultExpenses, setDefaultExpenses] = useState(DEFAULT_EXPENSES);

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = deposit - totalSpent;
  const savingsEstimate = remaining > 0 ? remaining * 0.2 : 0;

  const addExpense = useCallback((expense: Omit<Expense, "id">) => {
    setExpenses((p) => [{ ...expense, id: Date.now().toString() }, ...p]);
    toast.success("Expense added successfully");
  }, []);

  const editExpense = useCallback((id: string, data: Omit<Expense, "id">) => {
    setExpenses((p) => p.map((e) => (e.id === id ? { ...data, id } : e)));
    toast.success("Expense updated");
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((p) => p.filter((e) => e.id !== id));
    toast.success("Expense deleted");
  }, []);

  const updateDeposit = useCallback((amount: number) => {
    setDeposit(amount);
    toast.success("Deposit updated");
  }, []);

  const addToDeposit = useCallback((extra: number) => {
    setDeposit((p) => p + extra);
    toast.success(`₹${extra} added to deposit`);
  }, []);

  const addSavings = useCallback((amount: number, note: string) => {
    setTotalSavings((p) => p + amount);
    setSavingsHistory((p) => [
      { id: Date.now().toString(), type: "add", amount, note, date: today() },
      ...p,
    ]);
    toast.success(`₹${amount} added to savings`);
  }, []);

  const deductSavings = useCallback((amount: number, note: string) => {
    setTotalSavings((p) => Math.max(0, p - amount));
    setSavingsHistory((p) => [
      { id: Date.now().toString(), type: "deduct", amount, note, date: today() },
      ...p,
    ]);
    toast.success(`₹${amount} deducted from savings`);
  }, []);

  const resetAll = useCallback(() => {
    const record: MonthRecord = {
      month: currentMonth(),
      deposit,
      expenses: [...expenses],
      savings: savingsEstimate,
    };
    setMonthlyHistory((p) => [record, ...p]);
    setExpenses(generateDefaultExpenses());
    setDeposit(0);
    setTotalSavings(0);
    setSavingsHistory([]);
    toast.success("All data has been reset");
  }, [deposit, expenses, savingsEstimate]);

  return {
    expenses,
    deposit,
    totalSpent,
    remaining,
    savingsEstimate,
    totalSavings,
    savingsHistory,
    monthlyHistory,
    defaultExpenses,
    addExpense,
    editExpense,
    deleteExpense,
    updateDeposit,
    addToDeposit,
    addSavings,
    deductSavings,
    resetAll,
    categories: CATEGORIES,
  };
}
