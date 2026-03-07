import { useState } from "react";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import type { RecurringExpense } from "@/hooks/useExpenseStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CATEGORIES = ["Food", "Travel", "Shops", "Health", "Others"];

interface RecurringExpensesPageProps {
  recurringExpenses: RecurringExpense[];
  onAdd: (data: Omit<RecurringExpense, "id">) => void;
  onEdit: (id: string, data: Omit<RecurringExpense, "id">) => void;
  onDelete: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  Food: "bg-success/20 text-success",
  Travel: "bg-info/20 text-info",
  Shops: "bg-warning/20 text-warning",
  Health: "bg-destructive/20 text-destructive",
  Others: "bg-muted text-muted-foreground",
};

const RecurringExpensesPage = ({ recurringExpenses, onAdd, onEdit, onDelete }: RecurringExpensesPageProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RecurringExpense | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("monthly");

  const openAdd = () => {
    setEditing(null);
    setTitle("");
    setCategory(CATEGORIES[0]);
    setAmount("");
    setFrequency("monthly");
    setModalOpen(true);
  };

  const openEdit = (r: RecurringExpense) => {
    setEditing(r);
    setTitle(r.title);
    setCategory(r.category);
    setAmount(r.amount.toString());
    setFrequency(r.frequency);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!title.trim() || !val || val <= 0) return;
    const data = { title: title.trim(), category, amount: val, frequency };
    if (editing) onEdit(editing.id, data);
    else onAdd(data);
    setModalOpen(false);
  };

  const inputClass = "w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Recurring Expenses</h2>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-200 hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Recurring
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        {recurringExpenses.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No recurring expenses yet. Add one to get started!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Title</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Frequency</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recurringExpenses.map((r) => (
                  <tr key={r.id} className="border-b border-border/50 last:border-0 transition-colors hover:bg-accent/30">
                    <td className="py-3 text-card-foreground">{r.title}</td>
                    <td className="py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[r.category] || categoryColors.Others}`}>
                        {r.category}
                      </span>
                    </td>
                    <td className="py-3 text-card-foreground">₹{r.amount.toFixed(2)}</td>
                    <td className="py-3 text-muted-foreground capitalize">{r.frequency}</td>
                    <td className="py-3 text-right">
                      <button onClick={() => openEdit(r)} className="mr-1 rounded-md p-1.5 text-muted-foreground transition-all hover:bg-accent hover:text-foreground">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => onDelete(r.id)} className="rounded-md p-1.5 text-muted-foreground transition-all hover:bg-destructive/20 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={(v) => !v && setModalOpen(false)}>
        <DialogContent className="border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">
              {editing ? "Edit Recurring Expense" : "Add Recurring Expense"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Mess Fee" required className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Amount (₹)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" min="0.01" step="0.01" required className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Frequency</label>
              <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className={inputClass}>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="flex-1 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent">Cancel</button>
              <button type="submit" className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90">
                {editing ? "Save Changes" : "Add"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecurringExpensesPage;
