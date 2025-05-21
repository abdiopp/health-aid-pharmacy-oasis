import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ChatbotProvider } from "./contexts/ChatbotContext";

import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthRoute from "@/components/AuthRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <ChatbotProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Layout>
                      <Index />
                    </Layout>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <Layout>
                      <Products />
                    </Layout>
                  }
                />
                <Route
                  path="/products/:id"
                  element={
                    <Layout>
                      <ProductDetail />
                    </Layout>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <Layout>
                      <Cart />
                    </Layout>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <Layout>
                      <AuthRoute>
                        <Login />
                      </AuthRoute>
                    </Layout>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <Layout>
                      <AuthRoute>
                        <Register />
                      </AuthRoute>
                    </Layout>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ChatbotProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
