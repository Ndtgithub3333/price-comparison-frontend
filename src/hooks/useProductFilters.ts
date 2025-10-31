import { useState, useCallback, useEffect } from "react";
import { getAllProducts } from "@/services/productService";
import type {
  Product,
  ProductPagination,
  ProductFilters,
} from "@/services/productService";
import { toast } from "sonner";

export function useProductFilters() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<ProductPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Filter states
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [inStock, setInStock] = useState<string>("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Fetch products với filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const filters: ProductFilters = {
        page,
        ...(search && { search }),
        ...(category && { category }),
        ...(source && { source }),
        ...(inStock && { inStock: inStock === "true" }),
        ...(minPrice && { minPrice: parseInt(minPrice) }),
        ...(maxPrice && { maxPrice: parseInt(maxPrice) }),
      };

      const res = await getAllProducts(filters);
      setProducts(res.products || []);
      setPagination(res.pagination);
    } catch {
      toast.error("Lỗi tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [page, search, category, source, inStock, minPrice, maxPrice]);

  // Debounce search - chỉ cho ô tìm kiếm
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500); // Chờ 700ms sau khi user ngừng gõ

    return () => clearTimeout(timer);
  }, [search]); // Chỉ debounce cho search

  // Fetch khi thay đổi page
  useEffect(() => {
    fetchProducts();
  }, [page]);

  // Handler để clear tất cả filters
  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
    setSource("");
    setInStock("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  // Handler để apply filters (reset về page 1)
  const handleApplyFilters = () => {
    setPage(1);
    fetchProducts();
  };

  return {
    // Data
    products,
    pagination,
    loading,
    page,
    setPage,

    // Filter states
    search,
    setSearch,
    category,
    setCategory,
    source,
    setSource,
    inStock,
    setInStock,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,

    // Handlers
    handleClearFilters,
    handleApplyFilters,
    fetchProducts,
  };
}
