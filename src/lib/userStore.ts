import { create } from "zustand";

interface User {
  email: string;
  name: string;
  role: "user" | "admin" | "crawler";
}

interface UserState {
  user: User | null;
  isChecking: boolean;
  setUser: (user: User | null) => void;
  setChecking: (checking: boolean) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isChecking: true,
  setUser: (user) => set({ user }),
  setChecking: (checking) => set({ isChecking: checking }),
  logout: () => set({ user: null }),
}));
