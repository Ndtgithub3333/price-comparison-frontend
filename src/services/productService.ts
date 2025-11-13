import { productAPI } from "./api";

export interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  brand: string;
  source: string;
  sourceUrl: string;
  sourceProductId: string;
  inStock: boolean;
  description?: string;
  imageUrl?: string;
  soldCount?: number;
  promotion?: string;
  rating?: number;
}

export interface ProductPagination {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ProductFilters {
  page?: number;
  category?: string;
  source?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: string; // 'price_asc', 'price_desc', 'bestseller', 'discount', 'newest', ...
}

export const getAllProducts = async (filters: ProductFilters = {}) => {
  const params = new URLSearchParams();

  // Thêm các filter vào query params
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.category) params.append("category", filters.category);
  if (filters.source) params.append("source", filters.source);
  if (filters.search) params.append("search", filters.search);
  if (filters.minPrice) params.append("minPrice", filters.minPrice.toString());
  if (filters.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
  if (filters.inStock !== undefined)
    params.append("inStock", filters.inStock.toString());
  if (filters.sort) params.append("sort", filters.sort);

  const res = await productAPI.get(`/?${params.toString()}`);
  return {
    products: res.data.data,
    pagination: res.data.pagination,
  };
};

export const deleteProduct = async (id: string) => {
  return await productAPI.delete(`/${id}`);
};

export const getProductAnalytics = async (range = "all") => {
  const res = await productAPI.get(
    `/analytics?range=${encodeURIComponent(range)}`,
  );
  // backend returns { success: true, analytics: { ... } }
  return res.data.analytics ?? res.data;
};

export const getTopProducts = async (range = "all") => {
  const res = await productAPI.get(
    `/top-products?range=${encodeURIComponent(range)}`,
  );
  return res.data;
};

export const recordRedirect = async (productId: string, source: string) => {
  return await productAPI.post(`/${productId}/redirect`, { source });
};

export const recordView = async (productId: string) => {
  return await productAPI.post(`/${productId}/view`);
};

// Có thể bổ sung các hàm createProduct, updateProduct, getProductById nếu cần
export const getProductById = async (id: string) => {
  const res = await productAPI.get(`/${id}`);
  return res.data.data ?? res.data;
};

export interface ProductHistoryChange {
  field: string;
  oldValue: string | number | boolean | null | undefined;
  newValue: string | number | boolean | null | undefined;
}

export interface ProductHistory {
  _id: string;
  productId: string;
  sourceUrl: string;
  changes: ProductHistoryChange[];
  price?: number;
  originalPrice?: number;
  discount?: number;
  inStock?: boolean;
  crawlJobId?: string;
  changedAt: string;
}

export const getProductHistory = async (productId: string, limit = 50) => {
  const res = await productAPI.get(`/${productId}/history?limit=${limit}`);
  return {
    history: res.data.data as ProductHistory[],
    total: res.data.total,
  };
};
