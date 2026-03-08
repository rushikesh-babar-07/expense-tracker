import { useState } from "react";
import { CalendarPlus, ArrowRight, PiggyBank, Plus, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StartNewMonthModalProps {
  open: boolean;
  onClose: () => void;
  remaining: number;
  totalSavings: number;
  onStart: (newBudget: number, transferToSavings: boolean) => Promise<{ newBudget: number; transferred: number } | undefined>;
}

const StartNewMonthModal = ({ open, onClose, remaining, totalSavings, onStart }: StartNewMonthModalProps) => {
  const [step, setStep] = useState(1);
  const [newBudget, setNewBudget] = useState("");
  const [transferToSavings, setTransferToSavings] = useState(true);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<{ newBudget: number; transferred: number } | null>(null);

  const handleClose = () => {
    setStep(1);
    setNewBudget("");
    setTransferToSavings(true);
    setSummary(null);
    onClose();
  };

  const handleNext = () => {
    if (step === 1) {
      const val = parseFloat(newBudget);
      if (!val || val <= 0) return;
      if (remaining > 0) {
        setStep(2);
      } else {
        handleSubmit(true);
      }
    }
  };

  const handleSubmit = async (skipTransfer = false) => {
    setLoading(true);
    const val = parseFloat(newBudget);
    const shouldTransfer = skipTransfer ? false : transferToSavings;
    const result = await onStart(val, shouldTransfer);
    if (result) {
      setSummary(result);
      setStep(3);
    }
    setLoading(false);
  };

  const inputClass = "w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";
  const positiveRemaining = Math.max(0, remaining);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-card-foreground">
            <CalendarPlus className="h-5 w-5 text-primary" />
            {step === 3 ? "New Month Started!" : "Start New Month"}
          </DialogTitle>
        </DialogHeader>

        {/* Step indicators */}
        {step < 3 && (
          <div className="flex items-center gap-2 mb-2">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                  s === step ? "bg-primary text-primary-foreground" : s < step ? "bg-primary/30 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {s}
                </div>
                {s < 2 && <div className={`h-px w-8 ${s < step ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Enter your budget for the new month.</p>
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Monthly Budget (₹)</label>
              <input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                placeholder="e.g. 15000"
                min="1"
                step="0.01"
                required
                className={inputClass}
                autoFocus
              />
            </div>
            {remaining > 0 && (
              <p className="text-xs text-muted-foreground">
                You have <span className="font-semibold text-success">₹{positiveRemaining.toFixed(2)}</span> remaining from this month.
              </p>
            )}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={handleClose} className="flex-1 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent">
                Cancel
              </button>
              <button
                onClick={handleNext}
                disabled={!newBudget || parseFloat(newBudget) <= 0}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {remaining > 0 ? "Next" : "Start Month"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You have <span className="font-semibold text-success">₹{positiveRemaining.toFixed(2)}</span> remaining. What would you like to do with it?
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setTransferToSavings(true)}
                className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-all ${
                  transferToSavings
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-border/80 hover:bg-accent/50"
                }`}
              >
                <PiggyBank className={`mt-0.5 h-5 w-5 flex-shrink-0 ${transferToSavings ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                  <p className={`text-sm font-medium ${transferToSavings ? "text-foreground" : "text-muted-foreground"}`}>
                    Transfer to Savings
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Add ₹{positiveRemaining.toFixed(2)} to your savings. New budget: ₹{parseFloat(newBudget || "0").toFixed(2)}
                  </p>
                </div>
              </button>
              <button
                onClick={() => setTransferToSavings(false)}
                className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-all ${
                  !transferToSavings
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-border/80 hover:bg-accent/50"
                }`}
              >
                <Plus className={`mt-0.5 h-5 w-5 flex-shrink-0 ${!transferToSavings ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                  <p className={`text-sm font-medium ${!transferToSavings ? "text-foreground" : "text-muted-foreground"}`}>
                    Add to New Budget
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    New budget: ₹{(parseFloat(newBudget || "0") + positiveRemaining).toFixed(2)}
                  </p>
                </div>
              </button>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setStep(1)} className="flex-1 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent">
                Back
              </button>
              <button
                onClick={() => handleSubmit()}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Start Month"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && summary && (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-success" />
            </div>
            <div className="rounded-lg border border-border bg-background p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">New Monthly Budget</span>
                <span className="font-semibold text-foreground">₹{summary.newBudget.toFixed(2)}</span>
              </div>
              {summary.transferred > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transferred to Savings</span>
                  <span className="font-semibold text-success">+₹{summary.transferred.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm border-t border-border pt-2">
                <span className="text-muted-foreground">Updated Total Savings</span>
                <span className="font-semibold text-foreground">₹{(totalSavings + summary.transferred).toFixed(2)}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Recurring expenses have been automatically added. Previous month data is saved to history.
            </p>
            <button
              onClick={handleClose}
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
            >
              Done
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StartNewMonthModal;
