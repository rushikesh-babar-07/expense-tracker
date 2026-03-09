import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SettingsPageProps {
  onReset: () => void;
}

const SettingsPage = ({ onReset }: SettingsPageProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleReset = () => {
    onReset();
    setConfirmOpen(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-4">Settings</h2>
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-base font-semibold text-card-foreground mb-2">Reset All Data</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Permanently delete all your financial data. Your login account will remain unchanged.
        </p>
        <button
          onClick={() => setConfirmOpen(true)}
          className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:opacity-90"
        >
          Reset All Data
        </button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={(v) => !v && setConfirmOpen(false)}>
        <DialogContent className="border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-card-foreground">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Confirm Full Reset
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently delete all financial data including expenses, savings, recurring expenses, history, dashboard totals, and analytics charts. Your login account will remain unchanged.
          </p>
          <p className="text-sm font-medium text-destructive">Are you sure you want to continue?</p>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setConfirmOpen(false)} className="flex-1 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent">
              Cancel
            </button>
            <button onClick={handleReset} className="flex-1 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:opacity-90">
              Yes, Delete Everything
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
