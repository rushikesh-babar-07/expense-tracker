import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

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
  month: string;
  deposit: number;
  expenses: Expense[];
  savings: number;
}

const CATEGORIES = ["Food", "Travel", "Shops", "Health", "Others"] as const;
const USER_ID = "default";
const currentMonth = () => new Date().toISOString().slice(0, 7);
const today = () => new Date().toISOString().split("T")[0];

export function useExpenseStore() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [deposit, setDeposit] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [savingsHistory, setSavingsHistory] = useState<SavingsEntry[]>([]);
  const [monthlyHistory, setMonthlyHistory] = useState<MonthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data on mount
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchExpenses(), fetchDeposit(), fetchSavings()]);
    setLoading(false);
  };

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", USER_ID)
      .eq("month", currentMonth())
      .order("created_at", { ascending: false });
    if (!error && data) {
      setExpenses(
        data.map((e: any) => ({
          id: e.id,
          name: e.title,
          category: e.category,
          amount: Number(e.amount),
          date: e.date,
          isDefault: e.is_default || false,
        }))
      );
    }
  };

  const fetchDeposit = async () => {
    const { data, error } = await supabase
      .from("deposits")
      .select("*")
      .eq("user_id", USER_ID)
      .eq("month", currentMonth())
      .single();
    if (!error && data) {
      setDeposit(Number(data.amount));
    }
  };

  const fetchSavings = async () => {
    const { data, error } = await supabase
      .from("savings")
      .select("*")
      .eq("user_id", USER_ID)
      .order("created_at", { ascending: false });
    if (!error && data) {
      let total = 0;
      const history: SavingsEntry[] = data.map((s: any) => {
        const t = s.type as "add" | "deduct";
        total += t === "add" ? Number(s.amount) : -Number(s.amount);
        return {
          id: s.id,
          type: t,
          amount: Number(s.amount),
          note: s.reason || "",
          date: s.created_at?.split("T")[0] || today(),
        };
      });
      setTotalSavings(Math.max(0, total));
      setSavingsHistory(history);
    }
  };

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = deposit - totalSpent;
  const savingsEstimate = remaining > 0 ? remaining * 0.2 : 0;

  const addExpense = useCallback(async (expense: Omit<Expense, "id">) => {
    const { error } = await supabase.from("expenses").insert({
      user_id: USER_ID,
      title: expense.name,
      category: expense.category,
      amount: expense.amount,
      date: expense.date,
      month: currentMonth(),
      is_default: expense.isDefault || false,
    });
    if (!error) {
      toast.success("Expense added successfully");
      await fetchExpenses();
    } else {
      toast.error("Failed to add expense");
    }
  }, []);

  const editExpense = useCallback(async (id: string, data: Omit<Expense, "id">) => {
    const { error } = await supabase
      .from("expenses")
      .update({
        title: data.name,
        category: data.category,
        amount: data.amount,
        date: data.date,
      })
      .eq("id", id);
    if (!error) {
      toast.success("Expense updated");
      await fetchExpenses();
    } else {
      toast.error("Failed to update expense");
    }
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (!error) {
      toast.success("Expense deleted");
      await fetchExpenses();
    } else {
      toast.error("Failed to delete expense");
    }
  }, []);

  const updateDeposit = useCallback(async (amount: number) => {
    const { data: existing } = await supabase
      .from("deposits")
      .select("id")
      .eq("user_id", USER_ID)
      .eq("month", currentMonth())
      .single();

    let error;
    if (existing) {
      ({ error } = await supabase
        .from("deposits")
        .update({ amount })
        .eq("id", existing.id));
    } else {
      ({ error } = await supabase
        .from("deposits")
        .insert({ user_id: USER_ID, amount, month: currentMonth() }));
    }
    if (!error) {
      setDeposit(amount);
      toast.success("Deposit updated");
    } else {
      toast.error("Failed to update deposit");
    }
  }, []);

  const addToDeposit = useCallback(async (extra: number) => {
    const { data: existing } = await supabase
      .from("deposits")
      .select("id, amount")
      .eq("user_id", USER_ID)
      .eq("month", currentMonth())
      .single();

    const newAmount = (existing ? Number(existing.amount) : 0) + extra;
    let error;
    if (existing) {
      ({ error } = await supabase
        .from("deposits")
        .update({ amount: newAmount })
        .eq("id", existing.id));
    } else {
      ({ error } = await supabase
        .from("deposits")
        .insert({ user_id: USER_ID, amount: newAmount, month: currentMonth() }));
    }
    if (!error) {
      setDeposit(newAmount);
      toast.success(`₹${extra} added to deposit`);
    } else {
      toast.error("Failed to add to deposit");
    }
  }, []);

  const addSavings = useCallback(async (amount: number, note: string) => {
    const { error } = await supabase.from("savings").insert({
      user_id: USER_ID,
      type: "add",
      amount,
      reason: note,
    });
    if (!error) {
      toast.success(`₹${amount} added to savings`);
      await fetchSavings();
    } else {
      toast.error("Failed to add savings");
    }
  }, []);

  const deductSavings = useCallback(async (amount: number, note: string) => {
    const { error } = await supabase.from("savings").insert({
      user_id: USER_ID,
      type: "deduct",
      amount,
      reason: note,
    });
    if (!error) {
      toast.success(`₹${amount} deducted from savings`);
      await fetchSavings();
    } else {
      toast.error("Failed to deduct savings");
    }
  }, []);

  const resetAll = useCallback(async () => {
    // Save current month to history (local only for now)
    const record: MonthRecord = {
      month: currentMonth(),
      deposit,
      expenses: [...expenses],
      savings: savingsEstimate,
    };
    setMonthlyHistory((p) => [record, ...p]);

    // Delete current month data from DB
    await supabase.from("expenses").delete().eq("user_id", USER_ID).eq("month", currentMonth());
    await supabase.from("deposits").delete().eq("user_id", USER_ID).eq("month", currentMonth());
    await supabase.from("savings").delete().eq("user_id", USER_ID);

    // Insert default expenses
    await supabase.from("expenses").insert([
      { user_id: USER_ID, title: "Mess Fee", category: "Food", amount: 3500, date: today(), month: currentMonth(), is_default: true },
      { user_id: USER_ID, title: "Room Rent", category: "Others", amount: 5000, date: today(), month: currentMonth(), is_default: true },
    ]);

    await fetchAll();
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
    defaultExpenses: [
      { name: "Mess Fee", category: "Food", amount: 3500 },
      { name: "Room Rent", category: "Others", amount: 5000 },
    ],
    addExpense,
    editExpense,
    deleteExpense,
    updateDeposit,
    addToDeposit,
    addSavings,
    deductSavings,
    resetAll,
    categories: CATEGORIES,
    loading,
  };
}
