import { deleteProduct } from "@/services/productService";
import { useState } from "react";
import type { Product as ProductType } from "@/services/productService";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { toast } from "sonner";
import { ProductFilters as Filters } from "@/components/ProductFilters";
import { ProductPagination as Pagination } from "@/components/ProductPagination";
import { useProductFilters } from "@/hooks/useProductFilters";
import ProductHistory from "@/components/ProductHistory";
import { History, ExternalLink, Trash2 } from "lucide-react";

type Product = ProductType;

export default function AdminProductPage() {
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
    fetchProducts,
  } = useProductFilters();

  async function handleDelete(id: string) {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await deleteProduct(id);
      toast.success("Đã xóa sản phẩm");
      fetchProducts();
    } catch {
      toast.error("Xóa sản phẩm thất bại");
    }
  }

  return (
    <div className="mx-auto max-w-7xl py-8">
      <h2 className="mb-6 text-2xl font-bold">Quản lý sản phẩm</h2>

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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="px-2 py-2">Ảnh</TableHead>
                  <TableHead className="px-2 py-2">Tên</TableHead>
                  <TableHead className="px-2 py-2">Giá</TableHead>
                  <TableHead className="px-2 py-2">Giá gốc</TableHead>
                  <TableHead className="px-2 py-2">Giảm (%)</TableHead>
                  <TableHead className="px-2 py-2">Đã bán</TableHead>
                  <TableHead className="px-2 py-2">Khuyến mãi</TableHead>
                  <TableHead className="px-2 py-2">Kho</TableHead>
                  <TableHead className="px-2 py-2">Đánh giá</TableHead>
                  <TableHead className="px-2 py-2">Danh mục</TableHead>
                  <TableHead className="px-2 py-2">Nguồn</TableHead>
                  <TableHead className="px-2 py-2">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p._id} className="border-b">
                    <TableCell className="px-2 py-2">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell className="max-w-xs truncate px-2 py-2 font-medium">
                      {p.name}
                    </TableCell>
                    <TableCell className="px-2 py-2">
                      {p.price?.toLocaleString()}₫
                    </TableCell>
                    <TableCell className="px-2 py-2">
                      {p.originalPrice
                        ? p.originalPrice.toLocaleString() + "₫"
                        : "-"}
                    </TableCell>
                    <TableCell className="px-2 py-2">
                      {p.discount ?? "-"}
                    </TableCell>
                    <TableCell className="px-2 py-2">
                      {p.soldCount ?? "-"}
                    </TableCell>
                    <TableCell className="max-w-xs truncate px-2 py-2">
                      {p.promotion || "-"}
                    </TableCell>
                    <TableCell className="px-2 py-2">
                      <span
                        className={`rounded px-2 py-1 text-xs ${p.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {p.inStock ? "Còn" : "Hết"}
                      </span>
                    </TableCell>
                    <TableCell className="px-2 py-2">
                      {p.rating ?? "-"}
                    </TableCell>
                    <TableCell className="px-2 py-2">{p.category}</TableCell>
                    <TableCell className="px-2 py-2">{p.source}</TableCell>
                    <TableCell className="px-2 py-2">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setModalProduct(p);
                            setModalOpen(true);
                          }}
                        >
                          <History />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            try {
                              await (
                                await import("@/services/productService")
                              ).recordRedirect(p._id, p.source);
                            } catch {
                              // ignore
                            }
                            window.open(p.sourceUrl, "_blank");
                          }}
                        >
                          <ExternalLink />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(p._id)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

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

      {/* Modal for product history */}
      {modalOpen && modalProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setModalOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50" aria-hidden />
          <div
            className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">{modalProduct.name}</h3>
                <p className="text-sm text-gray-500">
                  Giá hiện tại:{" "}
                  <span className="font-semibold text-blue-600">
                    {modalProduct.price?.toLocaleString()}₫
                  </span>
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setModalOpen(false)}
                className="cursor-pointer"
              >
                ✕
              </Button>
            </div>

            <ProductHistory productId={modalProduct._id} />
          </div>
        </div>
      )}
    </div>
  );
}
