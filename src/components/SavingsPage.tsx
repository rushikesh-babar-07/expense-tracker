import { useState } from "react";
import { PiggyBank, Plus, Minus } from "lucide-react";
import type { SavingsEntry } from "@/hooks/useExpenseStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SavingsPageProps {
  totalSavings: number;
  savingsHistory: SavingsEntry[];
  onAdd: (amount: number, note: string) => void;
  onDeduct: (amount: number, note: string) => void;
}

const SavingsPage = ({ totalSavings, savingsHistory, onAdd, onDeduct }: SavingsPageProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "deduct">("add");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const openModal = (m: "add" | "deduct") => {
    setMode(m);
    setAmount("");
    setNote("");
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    if (mode === "add") onAdd(val, note || "Manual savings");
    else onDeduct(val, note || "Savings used");
    setModalOpen(false);
  };

  const inputClass = "w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div>
      <div className="mb-6 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <PiggyBank className="h-6 w-6 text-warning" />
          <h2 className="text-xl font-bold text-card-foreground">Total Savings</h2>
        </div>
        <p className="text-3xl font-bold text-foreground mb-4">₹{totalSavings.toFixed(2)}</p>
        <div className="flex gap-3">
          <button onClick={() => openModal("add")} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90">
            <Plus className="h-4 w-4" /> Add Savings
          </button>
          <button onClick={() => openModal("deduct")} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent">
            <Minus className="h-4 w-4" /> Deduct Savings
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Savings History</h3>
        {savingsHistory.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No savings history yet.</p>
        ) : (
          <div className="space-y-3">
            {savingsHistory.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                <div>
                  <p className="text-sm text-card-foreground">{entry.note}</p>
                  <p className="text-xs text-muted-foreground">{entry.date}</p>
                </div>
                <span className={`text-sm font-semibold ${entry.type === "add" ? "text-success" : "text-destructive"}`}>
                  {entry.type === "add" ? "+" : "-"}₹{entry.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={(v) => !v && setModalOpen(false)}>
        <DialogContent className="border-border bg-card sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">
              {mode === "add" ? "Add Savings" : "Deduct Savings"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Amount (₹)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" min="1" step="0.01" required className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">
                {mode === "deduct" ? "What was it used for?" : "Note (optional)"}
              </label>
              <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder={mode === "deduct" ? "e.g. Emergency expense" : "e.g. Monthly savings"} className={inputClass} />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="flex-1 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent">Cancel</button>
              <button type="submit" className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90">
                {mode === "add" ? "Add" : "Deduct"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavingsPage;
