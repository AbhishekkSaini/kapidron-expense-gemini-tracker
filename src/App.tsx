
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import GroupDetails from "./pages/GroupDetails";
import CreateGroup from "./pages/CreateGroup";
import CreateExpense from "./pages/CreateExpense";
import ExpenseDetails from "./pages/ExpenseDetails";
import Summary from "./pages/Summary";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/group/:groupId" element={<GroupDetails />} />
          <Route path="/expense/:expenseId" element={<ExpenseDetails />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/create-expense/:groupId" element={<CreateExpense />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
