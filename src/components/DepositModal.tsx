import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DepositModalProps {
  open: boolean;
  onClose: () => void;
  currentDeposit: number;
  onUpdate: (amount: number) => void;
  onAddExtra: (amount: number) => void;
}

const DepositModal = ({ open, onClose, currentDeposit, onUpdate, onAddExtra }: DepositModalProps) => {
  const [mode, setMode] = useState<"edit" | "add">("edit");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    if (mode === "edit") {
      onUpdate(val);
    } else {
      onAddExtra(val);
    }
    setAmount("");
    onClose();
  };

  const inputClass = "w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="border-border bg-card sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Manage Deposit</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">Current deposit: <span className="font-semibold text-foreground">₹{currentDeposit.toFixed(2)}</span></p>
        <div className="flex gap-2">
          <button onClick={() => setMode("edit")} className={`flex-1 rounded-lg px-3 py-1.5 text-sm transition-colors ${mode === "edit" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"}`}>
            Set Amount
          </button>
          <button onClick={() => setMode("add")} className={`flex-1 rounded-lg px-3 py-1.5 text-sm transition-colors ${mode === "add" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"}`}>
            Add Extra
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-muted-foreground">
              {mode === "edit" ? "New Deposit Amount (₹)" : "Extra Amount (₹)"}
            </label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" min="1" step="0.01" required className={inputClass} />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent">Cancel</button>
            <button type="submit" className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90">
              {mode === "edit" ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
