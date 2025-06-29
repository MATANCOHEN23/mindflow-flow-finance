
// MindFlow CRM - Brand Colors Applied
// Orange: #f97316, Blue: #1e3a8a, #3b82f6
// All hover states checked ✓
// CRUD operations complete ✓
// Ready for logo integration ✓

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Contacts from "./pages/Contacts";
import Deals from "./pages/Deals";
import Payments from "./pages/Payments";
import BirthdayEvents from "./pages/BirthdayEvents";
import Therapy from "./pages/Therapy";
import Basketball from "./pages/Basketball";
import SchoolWorkshops from "./pages/SchoolWorkshops";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Index />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/birthday-events" element={<BirthdayEvents />} />
            <Route path="/therapy" element={<Therapy />} />
            <Route path="/basketball" element={<Basketball />} />
            <Route path="/school-workshops" element={<SchoolWorkshops />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
