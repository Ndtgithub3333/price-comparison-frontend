// src/components/user/UserLayout.tsx
import { Outlet } from "react-router-dom";
import { Header } from "../ui/header";
import Footer from "../ui/footer";

export default function UserLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content: keep same container width as header/footer */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
