import { useState, useEffect } from "react";
import type { Expense } from "@/hooks/useExpenseStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CATEGORIES = ["Food", "Travel", "Shops", "Health", "Others"];

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (expense: Omit<Expense, "id">) => void;
  onEdit?: (id: string, expense: Omit<Expense, "id">) => void;
  editingExpense?: Expense | null;
}

const AddExpenseModal = ({ open, onClose, onAdd, onEdit, editingExpense }: AddExpenseModalProps) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (editingExpense) {
      setName(editingExpense.name);
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
    } else {
      setName("");
      setAmount("");
      setCategory(CATEGORIES[0]);
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [editingExpense, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;
    const data = {
      name: name.trim(),
      amount: parseFloat(amount),
      category,
      date,
    };
    if (editingExpense && onEdit) {
      onEdit(editingExpense.id, data);
    } else {
      onAdd(data);
    }
    onClose();
  };

  const inputClass = "w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">
            {editingExpense ? "Edit Expense" : "Add New Expense"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-muted-foreground">Expense Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Coffee" required className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-muted-foreground">Amount (₹)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" min="0.01" step="0.01" required className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-muted-foreground">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-muted-foreground">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={inputClass} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent">
              Cancel
            </button>
            <button type="submit" className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90">
              {editingExpense ? "Save Changes" : "Add Expense"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseModal;
