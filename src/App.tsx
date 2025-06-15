
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
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
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
