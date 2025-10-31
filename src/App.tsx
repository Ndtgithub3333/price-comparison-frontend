import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import UserLayout from "./components/user/UserLayout";
import AdminLayout from "./components/admin/AdminLayout";
import AdminProductPage from "./pages/admin/AdminProductPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminCrawlerPage from "./pages/admin/AdminCrawlerPage";
import UserChangePasswordPage from "./pages/user/UserChangePasswordPage";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import { useUserStore } from "@/lib/userStore";
import { getMe } from "@/services/userService";
import ProductListPage from "./pages/ProductListPage";
import HeroSection from "./components/HeroSection";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/not-found" element={<NotFound />} />

          {/* User routes */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<HeroSection />} />
            <Route
              path="products"
              element={
                <ProtectedRoute>
                  <ProductListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="change-password"
              element={
                <ProtectedRoute>
                  <UserChangePasswordPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="crawler" element={<AdminCrawlerPage />} />
          </Route>

          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="bottom-right" richColors />
      </AuthProvider>
    </Router>
  );
}

// Component để handle global auth check
function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useUserStore((state) => state.setUser);
  const setChecking = useUserStore((state) => state.setChecking);
  const logout = useUserStore((state) => state.logout);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getMe();
        setUser(res.data.user);
      } catch {
        logout();
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [setUser, setChecking, logout]);

  return <>{children}</>;
}
export default App;
