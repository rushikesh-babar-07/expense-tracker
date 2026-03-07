import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Expense {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  isDefault?: boolean;
  isRecurring?: boolean;
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

export interface RecurringExpense {
  id: string;
  title: string;
  category: string;
  amount: number;
  frequency: string;
}

const CATEGORIES = ["Food", "Travel", "Shops", "Health", "Others"] as const;
const currentMonth = () => new Date().toISOString().slice(0, 7);
const today = () => new Date().toISOString().split("T")[0];

// Helper to access recurring_expenses table (not yet in auto-generated types)
const recurringTable = () => supabase.from("recurring_expenses" as any);

export function useExpenseStore() {
  const { user } = useAuth();
  const userId = user?.id;

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [deposit, setDeposit] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [savingsHistory, setSavingsHistory] = useState<SavingsEntry[]>([]);
  const [monthlyHistory, setMonthlyHistory] = useState<MonthRecord[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) fetchAll();
    else setLoading(false);
  }, [userId]);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchExpenses(), fetchDeposit(), fetchSavings(), fetchRecurring()]);
    setLoading(false);
  };

  const fetchExpenses = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userId)
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
          isRecurring: e.is_recurring || false,
        }))
      );
    }
  };

  const fetchDeposit = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("deposits")
      .select("*")
      .eq("user_id", userId)
      .eq("month", currentMonth())
      .maybeSingle();
    if (!error && data) setDeposit(Number(data.amount));
    else setDeposit(0);
  };

  const fetchSavings = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("savings")
      .select("*")
      .eq("user_id", userId)
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

  const fetchRecurring = async () => {
    if (!userId) return;
    const { data, error } = await recurringTable()
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (!error && data) {
      setRecurringExpenses(
        (data as any[]).map((r) => ({
          id: r.id,
          title: r.title,
          category: r.category,
          amount: Number(r.amount),
          frequency: r.frequency,
        }))
      );
    }
  };

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = deposit - totalSpent;
  const savingsEstimate = remaining > 0 ? remaining * 0.2 : 0;

  const addExpense = useCallback(async (expense: Omit<Expense, "id">) => {
    if (!userId) return;
    const { error } = await supabase.from("expenses").insert({
      user_id: userId,
      title: expense.name,
      category: expense.category,
      amount: expense.amount,
      date: expense.date,
      month: currentMonth(),
      is_default: expense.isDefault || false,
      is_recurring: expense.isRecurring || false,
    });
    if (!error) {
      if (expense.isRecurring) {
        await recurringTable().insert({
          user_id: userId,
          title: expense.name,
          category: expense.category,
          amount: expense.amount,
          frequency: "monthly",
        });
        await fetchRecurring();
      }
      toast.success("Expense added successfully");
      await fetchExpenses();
    } else {
      toast.error("Failed to add expense");
    }
  }, [userId]);

  const editExpense = useCallback(async (id: string, data: Omit<Expense, "id">) => {
    if (!userId) return;
    const { error } = await supabase
      .from("expenses")
      .update({ title: data.name, category: data.category, amount: data.amount, date: data.date })
      .eq("id", id);
    if (!error) {
      toast.success("Expense updated");
      await fetchExpenses();
    } else {
      toast.error("Failed to update expense");
    }
  }, [userId]);

  const deleteExpense = useCallback(async (id: string) => {
    if (!userId) return;
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (!error) {
      toast.success("Expense deleted");
      await fetchExpenses();
    } else {
      toast.error("Failed to delete expense");
    }
  }, [userId]);

  const updateDeposit = useCallback(async (amount: number) => {
    if (!userId) return;
    const { data: existing } = await supabase
      .from("deposits").select("id").eq("user_id", userId).eq("month", currentMonth()).maybeSingle();
    let error;
    if (existing) {
      ({ error } = await supabase.from("deposits").update({ amount }).eq("id", existing.id));
    } else {
      ({ error } = await supabase.from("deposits").insert({ user_id: userId, amount, month: currentMonth() }));
    }
    if (!error) { setDeposit(amount); toast.success("Deposit updated"); }
    else toast.error("Failed to update deposit");
  }, [userId]);

  const addToDeposit = useCallback(async (extra: number) => {
    if (!userId) return;
    const { data: existing } = await supabase
      .from("deposits").select("id, amount").eq("user_id", userId).eq("month", currentMonth()).single();
    const newAmount = (existing ? Number(existing.amount) : 0) + extra;
    let error;
    if (existing) {
      ({ error } = await supabase.from("deposits").update({ amount: newAmount }).eq("id", existing.id));
    } else {
      ({ error } = await supabase.from("deposits").insert({ user_id: userId, amount: newAmount, month: currentMonth() }));
    }
    if (!error) { setDeposit(newAmount); toast.success(`₹${extra} added to deposit`); }
    else toast.error("Failed to add to deposit");
  }, [userId]);

  const addSavings = useCallback(async (amount: number, note: string) => {
    if (!userId) return;
    const { error } = await supabase.from("savings").insert({ user_id: userId, type: "add", amount, reason: note });
    if (!error) { toast.success(`₹${amount} added to savings`); await fetchSavings(); }
    else toast.error("Failed to add savings");
  }, [userId]);

  const deductSavings = useCallback(async (amount: number, note: string) => {
    if (!userId) return;
    const { error } = await supabase.from("savings").insert({ user_id: userId, type: "deduct", amount, reason: note });
    if (!error) { toast.success(`₹${amount} deducted from savings`); await fetchSavings(); }
    else toast.error("Failed to deduct savings");
  }, [userId]);

  const addRecurring = useCallback(async (data: Omit<RecurringExpense, "id">) => {
    if (!userId) return;
    const { error } = await recurringTable().insert({
      user_id: userId, title: data.title, category: data.category, amount: data.amount, frequency: data.frequency,
    });
    if (!error) { toast.success("Recurring expense added"); await fetchRecurring(); }
    else toast.error("Failed to add recurring expense");
  }, [userId]);

  const editRecurring = useCallback(async (id: string, data: Omit<RecurringExpense, "id">) => {
    if (!userId) return;
    const { error } = await recurringTable().update({
      title: data.title, category: data.category, amount: data.amount, frequency: data.frequency,
    }).eq("id", id);
    if (!error) { toast.success("Recurring expense updated"); await fetchRecurring(); }
    else toast.error("Failed to update recurring expense");
  }, [userId]);

  const deleteRecurring = useCallback(async (id: string) => {
    if (!userId) return;
    const { error } = await recurringTable().delete().eq("id", id);
    if (!error) { toast.success("Recurring expense deleted"); await fetchRecurring(); }
    else toast.error("Failed to delete recurring expense");
  }, [userId]);

  const resetAll = useCallback(async () => {
    if (!userId) return;
    const record: MonthRecord = { month: currentMonth(), deposit, expenses: [...expenses], savings: savingsEstimate };
    setMonthlyHistory((p) => [record, ...p]);
    await supabase.from("expenses").delete().eq("user_id", userId).eq("month", currentMonth());
    await supabase.from("deposits").delete().eq("user_id", userId).eq("month", currentMonth());
    await supabase.from("savings").delete().eq("user_id", userId);
    await fetchAll();
    toast.success("All data has been reset");
  }, [userId, deposit, expenses, savingsEstimate]);

  return {
    expenses, deposit, totalSpent, remaining, savingsEstimate, totalSavings,
    savingsHistory, monthlyHistory, recurringExpenses,
    defaultExpenses: [
      { name: "Mess Fee", category: "Food", amount: 3500 },
      { name: "Room Rent", category: "Others", amount: 5000 },
    ],
    addExpense, editExpense, deleteExpense, updateDeposit, addToDeposit,
    addSavings, deductSavings, addRecurring, editRecurring, deleteRecurring,
    resetAll, categories: CATEGORIES, loading,
  };
}
