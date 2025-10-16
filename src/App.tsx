
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
import { useUrlTracking } from "@/hooks/useUrlTracking";
import { Suspense, lazy } from "react";
import { LoadingSpinner } from "./components/LoadingSpinner";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Home = lazy(() => import("./pages/Home"));
const Deals = lazy(() => import("./pages/Deals"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Contacts = lazy(() => import("./pages/Contacts"));
const Payments = lazy(() => import("./pages/Payments"));
const BirthdayEvents = lazy(() => import("./pages/BirthdayEvents"));
const Therapy = lazy(() => import("./pages/Therapy"));
const Basketball = lazy(() => import("./pages/Basketball"));
const SchoolWorkshops = lazy(() => import("./pages/SchoolWorkshops"));
const CustomerProfile = lazy(() => import("./pages/CustomerProfile"));
const Domains = lazy(() => import("./pages/Domains"));
const DomainProfile = lazy(() => import("./pages/DomainProfile"));
const Events = lazy(() => import("./pages/Events"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Reports = lazy(() => import("./pages/Reports"));
const Install = lazy(() => import("./pages/Install"));
const SystemTesterPage = lazy(() => import("./pages/SystemTesterPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const InstallPrompt = lazy(() => import("./components/InstallPrompt").then(m => ({ default: m.InstallPrompt })));
const PrivateRoute = lazy(() => import("./components/PrivateRoute").then(m => ({ default: m.PrivateRoute })));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50">
    <LoadingSpinner />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// App with URL tracking
function AppWithTracking() {
  try {
    useUrlTracking(); // Track all navigation
  } catch (error) {
    console.error('URL tracking failed:', error);
  }
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Index /></PrivateRoute>} />
        <Route path="/contacts" element={<PrivateRoute><Contacts /></PrivateRoute>} />
        <Route path="/customer/:id" element={<PrivateRoute><CustomerProfile /></PrivateRoute>} />
        <Route path="/deals" element={<PrivateRoute><Deals /></PrivateRoute>} />
        <Route path="/payments" element={<PrivateRoute><Payments /></PrivateRoute>} />
        <Route path="/domains" element={<PrivateRoute><Domains /></PrivateRoute>} />
        <Route path="/domain/:id" element={<PrivateRoute><DomainProfile /></PrivateRoute>} />
        <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
        <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
        <Route path="/install" element={<Install />} />
        <Route path="/system-tester" element={<PrivateRoute><SystemTesterPage /></PrivateRoute>} />
        <Route path="/birthday-events" element={<PrivateRoute><BirthdayEvents /></PrivateRoute>} />
        <Route path="/therapy" element={<PrivateRoute><Therapy /></PrivateRoute>} />
        <Route path="/basketball" element={<PrivateRoute><Basketball /></PrivateRoute>} />
        <Route path="/school-workshops" element={<PrivateRoute><SchoolWorkshops /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <InstallPrompt />
          </Suspense>
          <AppWithTracking />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
