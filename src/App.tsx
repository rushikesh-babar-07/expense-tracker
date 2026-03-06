import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AppPages from "@/pages/Index";
import NotFound from "./pages/NotFound";
import { useExpenseStore } from "@/hooks/useExpenseStore";
import { generateExpenseReport } from "@/utils/generateReport";

const queryClient = new QueryClient();

const AppContent = () => {
  const store = useExpenseStore();

  const handleDownloadReport = () => {
    generateExpenseReport({
      expenses: store.expenses,
      deposit: store.deposit,
      totalSpent: store.totalSpent,
      remaining: store.remaining,
      totalSavings: store.totalSavings,
    });
  };

  return (
    <>
      <Navbar onDownloadReport={handleDownloadReport} />
      <Routes>
        <Route path="/" element={<AppPages store={store} />} />
        <Route path="/history" element={<AppPages store={store} />} />
        <Route path="/savings" element={<AppPages store={store} />} />
        <Route path="/settings" element={<AppPages store={store} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
