import axios from "axios";
import { useUserStore } from "@/lib/userStore";

const API_URL = import.meta.env.VITE_API_URL;

// Base API instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Gửi cookies với mỗi request
});

// Specific API instances for each module to avoid repeating path prefixes
export const userAPI = axios.create({
  baseURL: `${API_URL}/users`,
  withCredentials: true, // Gửi cookies với mỗi request
});

export const productAPI = axios.create({
  baseURL: `${API_URL}/products`,
  withCredentials: true, // Gửi cookies với mỗi request
});

export const crawlerAPI = axios.create({
  baseURL: `${API_URL}/crawler`,
  withCredentials: true, // Gửi cookies với mỗi request
});

// Response interceptor để xử lý 401 error globally
const setupInterceptors = () => {
  const errorInterceptor = (error: any) => {
    if (error.response?.status === 401) {
      // Token hết hạn, tự động logout
      const logout = useUserStore.getState().logout;
      logout();

      // Chỉ chuyển về login nếu đang ở protected route
      const currentPath = window.location.pathname;
      const protectedRoutes = [
        "/admin",
        "/profile",
        "/products",
        "/change-password",
      ];

      if (protectedRoutes.some((r) => currentPath.startsWith(r))) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  };

  // Chỉ cần response interceptor đơn giản
  api.interceptors.response.use((response) => response, errorInterceptor);
  productAPI.interceptors.response.use(
    (response) => response,
    errorInterceptor,
  );
  userAPI.interceptors.response.use((response) => response, errorInterceptor);
  crawlerAPI.interceptors.response.use(
    (response) => response,
    errorInterceptor,
  );
};

// Setup interceptors khi app khởi tạo
setupInterceptors();

export default api;
