
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
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
          {/* Future routes for different CRM sections */}
          <Route path="/contacts" element={<div className="p-6 text-center">עמוד לקוחות - בפיתוח</div>} />
          <Route path="/deals" element={<div className="p-6 text-center">עמוד עסקאות - בפיתוח</div>} />
          <Route path="/payments" element={<div className="p-6 text-center">עמוד תשלומים - בפיתוח</div>} />
          <Route path="/birthday-events" element={<div className="p-6 text-center">עמוד אירועי יום הולדת - בפיתוח</div>} />
          <Route path="/therapy" element={<div className="p-6 text-center">עמוד טיפולים - בפיתוח</div>} />
          <Route path="/basketball" element={<div className="p-6 text-center">עמוד אימוני כדורסל - בפיתוח</div>} />
          <Route path="/school-workshops" element={<div className="p-6 text-center">עמוד סדנאות בית ספר - בפיתוח</div>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
