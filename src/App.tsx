import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AppPages from "@/pages/Index";
import AuthPage from "@/pages/AuthPage";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useExpenseStore } from "@/hooks/useExpenseStore";
import { generateExpenseReport } from "@/utils/generateReport";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const AppContent = () => {
  const { user, loading } = useAuth();
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Navbar onDownloadReport={handleDownloadReport} />
            <Routes>
              <Route path="/" element={<AppPages store={store} />} />
              <Route path="/recurring" element={<AppPages store={store} />} />
              <Route path="/history" element={<AppPages store={store} />} />
              <Route path="/savings" element={<AppPages store={store} />} />
              <Route path="/settings" element={<AppPages store={store} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
