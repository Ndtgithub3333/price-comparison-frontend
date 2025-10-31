// src/components/admin/AdminLayout.tsx
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useUserStore } from "@/lib/userStore";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { logout } from "@/services/userService";

export default function AdminLayout() {
  const user = useUserStore((state) => state.user);
  const logoutStore = useUserStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      logoutStore();
      navigate("/login", { replace: true }); // luôn chuyển về /login
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-blue-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-semibold">Admin Panel</h1>
            <div className="space-x-4">
              <span>Welcome, {user ? user.email : "Admin"}</span>
              <Button onClick={handleLogout}>Logout</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="min-h-screen w-64 bg-white shadow-sm">
          <nav className="mt-5 px-2">
            <Link
              to="/admin"
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/products"
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Products
            </Link>
            <Link
              to="/admin/users"
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Users
            </Link>
            <Link
              to="/admin/crawler"
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              🚀 Crawler
            </Link>
            <Link
              to="/profile"
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Đổi mật khẩu
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet /> {/* Page content hiển thị ở đây */}
        </main>
      </div>
    </div>
  );
}
