import { useLocation } from "react-router-dom";
import Dashboard from "@/components/Dashboard";
import SavingsPage from "@/components/SavingsPage";
import MonthlyHistoryPage from "@/components/MonthlyHistoryPage";
import SettingsPage from "@/components/SettingsPage";
import RecurringExpensesPage from "@/components/RecurringExpensesPage";

interface IndexProps {
  store: any;
}

const Index = ({ store }: IndexProps) => {
  const location = useLocation();

  const renderPage = () => {
    switch (location.pathname) {
      case "/recurring":
        return (
          <RecurringExpensesPage
            recurringExpenses={store.recurringExpenses}
            onAdd={store.addRecurring}
            onEdit={store.editRecurring}
            onDelete={store.deleteRecurring}
          />
        );
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
      <div className="mx-auto max-w-6xl">{renderPage()}</div>
    </div>
  );
};

export default Index;
