import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ContactButton from "./components/ContactButton";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Houses from "./pages/Houses";
import Services from "./pages/Services";
import HouseDetail from "./pages/HouseDetail";
import ProductDetail from "./pages/ProductDetail";
import Advertise from "./pages/Advertise";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SellerDashboard from "./pages/SellerDashboard";
import LandlordDashboard from "./pages/LandlordDashboard";
import ServiceProviderDashboard from "./pages/ServiceProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Install from "./pages/Install";
import NotFound from "./pages/NotFound";

// Create QueryClient outside component to prevent recreation on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/houses" element={<Houses />} />
          <Route path="/services" element={<Services />} />
          <Route path="/house-detail" element={<HouseDetail />} />
          <Route path="/product-detail" element={<ProductDetail />} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/landlord-dashboard" element={<LandlordDashboard />} />
          <Route path="/service-provider-dashboard" element={<ServiceProviderDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/install" element={<Install />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ContactButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
