import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, CalendarDays, PiggyBank, FileDown, Settings } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/history", label: "Monthly History", icon: CalendarDays },
  { to: "/savings", label: "Savings", icon: PiggyBank },
  { to: "/settings", label: "Settings", icon: Settings },
];

const Navbar = () => {
  const location = useLocation();

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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
