import { useEffect, useState } from "react";
import { useUserStore } from "@/lib/userStore";
import { getMe } from "@/services/userService";
import Login from "@/pages/Login";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({
  children,
  adminOnly = false,
}: ProtectedRouteProps) {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const logout = useUserStore((state) => state.logout);
  const isChecking = useUserStore((state) => state.isChecking);
  const [localChecking, setLocalChecking] = useState(false);

  useEffect(() => {
    // Chỉ verify lại nếu global auth đã hoàn thành và chưa có user
    if (!isChecking && !user) {
      setLocalChecking(true);
      const verifyAuth = async () => {
        try {
          const res = await getMe();
          setUser(res.data.user);
        } catch {
          logout();
        } finally {
          setLocalChecking(false);
        }
      };
      verifyAuth();
    }
  }, [setUser, logout, isChecking, user]);

  // Hiển thị loading nếu đang check (global hoặc local)
  if (isChecking || localChecking) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Login />;
  }

  return <>{children}</>;
}
