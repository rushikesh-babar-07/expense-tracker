import { useLocation } from "react-router-dom";
import { useExpenseStore } from "@/hooks/useExpenseStore";
import Dashboard from "@/components/Dashboard";
import SavingsPage from "@/components/SavingsPage";
import MonthlyHistoryPage from "@/components/MonthlyHistoryPage";
import SettingsPage from "@/components/SettingsPage";

const Index = () => {
  const location = useLocation();
  const store = useExpenseStore();

  const renderPage = () => {
    switch (location.pathname) {
      case "/history":
        return <MonthlyHistoryPage history={store.monthlyHistory} />;
      case "/savings":
        return (
          <SavingsPage
            totalSavings={store.totalSavings}
            savingsHistory={store.savingsHistory}
            onAdd={store.addSavings}
            onDeduct={store.deductSavings}
          />
        );
      case "/settings":
        return <SettingsPage onReset={store.resetAll} />;
      default:
        return (
          <Dashboard
            expenses={store.expenses}
            deposit={store.deposit}
            totalSpent={store.totalSpent}
            remaining={store.remaining}
            savingsEstimate={store.savingsEstimate}
            totalSavings={store.totalSavings}
            addExpense={store.addExpense}
            editExpense={store.editExpense}
            deleteExpense={store.deleteExpense}
            updateDeposit={store.updateDeposit}
            addToDeposit={store.addToDeposit}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {renderPage()}
      </div>
    </div>
  );
};

export default Index;
