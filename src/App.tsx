
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
import Payments from "./pages/Payments";
import BirthdayEvents from "./pages/BirthdayEvents";
import Therapy from "./pages/Therapy";
import Basketball from "./pages/Basketball";
import SchoolWorkshops from "./pages/SchoolWorkshops";
import CustomerProfile from "./pages/CustomerProfile";
import Domains from "./pages/Domains";
import DomainProfile from "./pages/DomainProfile";
import Events from "./pages/Events";
import Tasks from "./pages/Tasks";
import Reports from "./pages/Reports";
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
            <Route path="/customer/:id" element={<CustomerProfile />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/domains" element={<Domains />} />
            <Route path="/domain/:id" element={<DomainProfile />} />
            <Route path="/events" element={<Events />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/reports" element={<Reports />} />
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
