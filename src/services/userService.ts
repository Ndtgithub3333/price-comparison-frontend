import { userAPI } from "./api";

// Types based on BE validation schemas and models
export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: "user" | "admin";
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  preferences?: {
    categories?: string[];
    priceRange?: {
      min: number;
      max: number;
    };
  };
}

// API calls with proper typing - BE handles validation
export const register = (data: RegisterData) => userAPI.post("/register", data);
export const login = (data: LoginData) =>
  userAPI.post("/login", data, { withCredentials: true });
export const getMe = () => userAPI.get("/me", { withCredentials: true });
export const updateMe = (data: UpdateUserData) =>
  userAPI.put("/me", data, { withCredentials: true });
export const changePassword = (data: ChangePasswordData) =>
  userAPI.post("/change-password", data, { withCredentials: true });
export const logout = () =>
  userAPI.post("/logout", {}, { withCredentials: true });
