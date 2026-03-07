import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, CalendarDays, PiggyBank, Settings, FileDown, LogOut, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/recurring", label: "Recurring", icon: RefreshCw },
  { to: "/history", label: "History", icon: CalendarDays },
  { to: "/savings", label: "Savings", icon: PiggyBank },
  { to: "/settings", label: "Settings", icon: Settings },
];

interface NavbarProps {
  onDownloadReport?: () => void;
}

const Navbar = ({ onDownloadReport }: NavbarProps) => {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <span className="text-lg font-bold text-foreground">💰 ExpenseTracker</span>
        <div className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <NavLink
                key={to}
                to={to}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent ${
                  active ? "bg-accent text-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            );
          })}
          {onDownloadReport && (
            <button
              onClick={onDownloadReport}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent"
            >
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">Report</span>
            </button>
          )}
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
