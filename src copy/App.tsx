import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { MainLayout } from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import AbandonedCarts from "./pages/AbandonedCarts";
import Analytics from "./pages/Analytics";
import Campaigns from "./pages/Campaigns";
import Templates from "./pages/Templates";
import Customers from "./pages/Customers";
import Promotions from "./pages/Promotions";
import Products from "./pages/Products";
import Banners from "./pages/Banners";
import BrokenImages from "./pages/BrokenImages";
import Integrations from "./pages/Integrations";
import Logs from "./pages/Logs";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import WhatsAppDetail from "./pages/WhatsAppDetail";
import Manufacturers from "./pages/Manufacturers";
import Categories from "./pages/Categories";
import ReferenceDataProvider from "./components/ReferenceDataProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ReferenceDataProvider>
          <BrowserRouter>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/abandoned-carts" element={<AbandonedCarts />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/promotions" element={<Promotions />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/broken-images" element={<BrokenImages />} />
                <Route path="/manufacturers" element={<Manufacturers />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/banners" element={<Banners />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/logs" element={<Logs />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/whatsapp-detail" element={<WhatsAppDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          </BrowserRouter>
        </ReferenceDataProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
