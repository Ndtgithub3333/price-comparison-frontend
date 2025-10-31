import { useState } from "react";
import type { Product as ProductType } from "@/services/productService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Star } from "@/components/icons/temp-icons";
import {
  recordRedirect,
  getProductById,
  recordView,
} from "@/services/productService";
import { ProductFilters as Filters } from "@/components/ProductFilters";
import { ProductPagination as Pagination } from "@/components/ProductPagination";
import { useProductFilters } from "@/hooks/useProductFilters";
import ProductHistory from "@/components/ProductHistory";

// Extend Product type to include missing properties for rendering
type Product = ProductType & {
  originalPrice?: number;
  discount?: number;
  promotion?: string;
  soldCount?: number;
  rating?: number;
};

export default function ProductListPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  // Sử dụng custom hook để quản lý filters và data
  const {
    products,
    pagination,
    loading,
    page,
    setPage,
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
    handleClearFilters,
    handleApplyFilters,
  } = useProductFilters();

  const handleOpenProduct = async (id: string) => {
    try {
      // Explicitly record view (so list click counts) then fetch detail
      try {
        await recordView(id);
      } catch (err) {
        console.debug("recordView failed", err);
      }
      const res = await getProductById(id);
      setModalProduct(res.product ?? res); // adapt to service shape
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Không mở được chi tiết sản phẩm");
    }
  };

  return (
    <div className="mx-auto max-w-7xl py-8">
      <h2 className="mb-6 text-2xl font-bold">Danh sách sản phẩm</h2>

      {/* Filter Section - Using Component */}
      <Filters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        source={source}
        setSource={setSource}
        inStock={inStock}
        setInStock={setInStock}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        onClearFilters={handleClearFilters}
        onApplyFilters={handleApplyFilters}
      />

      {loading ? (
        <div className="py-10 text-center">Đang tải...</div>
      ) : (
        <>
          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((p) => (
              <div
                key={p._id}
                role="button"
                tabIndex={0}
                onClick={() => handleOpenProduct(p._id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleOpenProduct(p._id);
                }}
                className="flex h-full cursor-pointer flex-col rounded-lg border bg-white shadow-md transition-all duration-200 hover:shadow-lg"
              >
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="h-40 w-full rounded-t-lg object-cover"
                />
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h3
                      className="mb-1 truncate text-lg font-bold"
                      title={p.name}
                    >
                      {p.name}
                    </h3>
                    <div className="mb-2 flex flex-wrap items-center gap-1">
                      <span className="text-primary text-xl font-semibold">
                        {p.price?.toLocaleString()}₫
                      </span>
                      {p.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {p.originalPrice.toLocaleString()}₫
                        </span>
                      )}
                    </div>
                    {p.discount && (
                      <div className="mb-2">
                        <span className="inline-block rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                          -{p.discount}%
                        </span>
                      </div>
                    )}
                    {p.promotion && (
                      <div className="mb-2 text-xs text-green-700">
                        {p.promotion}
                      </div>
                    )}
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                      <span
                        className={`rounded px-2 py-1 ${p.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {p.inStock ? "Còn hàng" : "Hết hàng"}
                      </span>
                      <span className="rounded bg-gray-100 px-2 py-1 text-gray-800">
                        Đã bán: {p.soldCount ?? "-"}
                      </span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const rating = p.rating ?? 0;
                          const filled = rating >= i + 0.5; // fill if >= half
                          return (
                            <Star
                              key={i}
                              filled={filled}
                              className={`${filled ? "text-yellow-500" : "text-gray-300"} inline-block`}
                            />
                          );
                        })}
                        <span className="ml-1 text-xs text-gray-600">
                          {p.rating ? p.rating.toFixed(1) : "-"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded bg-blue-100 px-2 py-1 text-blue-800">
                        {p.category}
                      </span>
                      <span className="rounded bg-purple-100 px-2 py-1 text-purple-800">
                        {p.source}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full cursor-pointer"
                      onClick={async (e) => {
                        e.stopPropagation(); // prevent card click navigation / modal open
                        try {
                          await recordRedirect(p._id, p.source);
                        } catch {
                          // ignore errors so we still open the link
                        }
                        window.open(p.sourceUrl, "_blank");
                      }}
                    >
                      Tới nơi bán
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Modal for product detail (opened when click card) */}
          {modalOpen && modalProduct && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center"
              onClick={() => setModalOpen(false)}
            >
              <div className="absolute inset-0 bg-black/50" aria-hidden />
              <div
                className="relative z-10 max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Left Column - Product Info */}
                  <div>
                    <div className="flex items-start gap-4">
                      <img
                        src={modalProduct.imageUrl}
                        alt={modalProduct.name}
                        className="h-32 w-32 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">
                          {modalProduct.name}
                        </h3>
                        <div className="text-primary mt-2 text-xl font-semibold">
                          {modalProduct.price?.toLocaleString()}₫
                        </div>
                        {modalProduct.originalPrice && (
                          <div className="text-sm text-gray-400 line-through">
                            {modalProduct.originalPrice.toLocaleString()}₫
                          </div>
                        )}
                        {modalProduct.promotion && (
                          <div className="mt-2 text-sm text-green-700">
                            {modalProduct.promotion}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-700">
                      {modalProduct.description ?? "Không có mô tả"}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button
                        onClick={async () => {
                          try {
                            await recordRedirect(
                              modalProduct._id,
                              modalProduct.source,
                            );
                          } catch (err) {
                            console.debug("recordRedirect failed", err);
                          }
                          window.open(modalProduct.sourceUrl, "_blank");
                        }}
                        className="cursor-pointer"
                      >
                        Tới nơi bán
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setModalOpen(false)}
                        className="cursor-pointer"
                      >
                        Đóng
                      </Button>
                    </div>
                  </div>

                  {/* Right Column - Product History */}
                  <div>
                    <ProductHistory productId={modalProduct._id} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pagination - Using Component */}
          {pagination && (
            <Pagination
              pagination={pagination}
              currentPage={page}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
