import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";
import CategoryItems from "./pages/admin/CategoryItems";
import Items from "./pages/admin/Items";
import ItemForm from "./pages/admin/ItemForm";
import Orders from "./pages/admin/Orders";
import OrderDetail from "./pages/admin/OrderDetail";
import Reservations from "./pages/admin/Reservations";
import ReservationDetail from "./pages/admin/ReservationDetail";
import Reviews from "./pages/admin/Reviews";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import { AdminLayout } from "./components/admin/AdminLayout";
import { ThemeProvider } from "./components/ThemeProvider";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Categories />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories/:id/items"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <CategoryItems />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/items"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Items />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/items/add"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ItemForm />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/items/:id/edit"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ItemForm />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Orders />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders/:id"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <OrderDetail />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reservations"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Reservations />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reservations/:id"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ReservationDetail />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Reviews />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
