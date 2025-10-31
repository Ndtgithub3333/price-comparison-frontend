import api from "./api";

export interface DashboardStats {
  overview: {
    totalProducts: number;
    totalUsers: number;
    activeProducts: number;
    outOfStockProducts: number;
    recentProducts: number;
    stockPercentage: string;
  };
  categoryStats: Array<{
    _id: string;
    count: number;
    avgPrice: number;
    inStock: number;
  }>;
  storeStats: Array<{
    _id: string;
    count: number;
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
  }>;
  timeSeriesData: Array<{
    date: string;
    totalProducts: number;
    inStockProducts: number;
    avgPrice: number;
    newUsers: number;
  }>;
  priceRange: {
    highest: {
      name: string;
      price: number;
      store: string;
      category: string;
    } | null;
    lowest: {
      name: string;
      price: number;
      store: string;
      category: string;
    } | null;
  };
  timeRange: string;
}

export interface RecentActivity {
  recentProducts: Array<{
    _id: string;
    name: string;
    price: number;
    store: string;
    category: string;
    inStock: boolean;
    updatedAt: string;
  }>;
  recentUsers: Array<{
    _id: string;
    name: string;
    email: string;
    createdAt: string;
  }>;
}

export const getDashboardStats = async (timeRange: string = "7d") => {
  const response = await api.get<{
    success: boolean;
    data: DashboardStats;
  }>("/dashboard/stats", {
    params: { timeRange },
  });
  return response.data;
};

export const getRecentActivity = async (limit?: number) => {
  const response = await api.get<{
    success: boolean;
    data: RecentActivity;
  }>("/dashboard/recent-activity", {
    params: { limit },
  });
  return response.data;
};
