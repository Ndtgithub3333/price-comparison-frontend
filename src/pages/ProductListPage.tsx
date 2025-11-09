import { useMemo, useState } from "react";
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
  specifications?: Record<string, unknown>;
};

const SPEC_KEY_TRANSLATIONS: Record<string, string> = {
  battery: "Pin",
  bluetooth: "Bluetooth",
  camera_primary: "Camera sau",
  camera_secondary: "Camera trước",
  camera_video: "Quay video",
  best_discount_price: "Giá ưu đãi tốt nhất",
  warranty: "Bảo hành",
  warranty_policy: "Chính sách bảo hành",
  os: "Hệ điều hành",
  chipset: "Chipset",
  cpu: "CPU",
  gpu: "GPU",
  ram: "RAM",
  rom: "Bộ nhớ trong",
  storage: "Dung lượng",
  screen: "Màn hình",
  display: "Màn hình",
  display_size: "Kích thước màn hình",
  display_technology: "Công nghệ màn hình",
  material: "Chất liệu",
  dimensions: "Kích thước",
  weight: "Trọng lượng",
  sim: "SIM",
  sim_type: "Loại SIM",
  wifi: "Wi-Fi",
  nfc: "NFC",
  gps: "GPS",
  usb: "Cổng kết nối",
  speaker: "Loa",
  audio: "Âm thanh",
  battery_capacity: "Dung lượng pin",
  charging: "Sạc",
  fast_charging: "Sạc nhanh",
  wireless_charging: "Sạc không dây",
  water_resistant: "Chống nước",
};

const rawSpecKeysToExclude = [
  "short_description",
  "description",
  "image",
  "small_image",
  "thumbnail",
  "ads_base_image",
  "image_label",
  "url_key",
  "url_path",
  "meta_title",
  "meta_keyword",
  "meta_description",
  "spec_tag",
  "change_layout_preorder",
  "anh_chong_nuoc",
  "anh_dieu_khien_camera",
  "anh_intelligence",
  "anh_sac_khong_day",
  "anh_thu_phong_quang_hoc",
];

const SPEC_EXCLUDED_KEYS = new Set(rawSpecKeysToExclude);

const decodeEntities = (value: string): string =>
  value
    .replace(/&nbsp;/gi, " ")
    .replace(/&bull;/gi, "•")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");

const normalizeSpecValue = (value: unknown): string | null => {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) {
    const joined = value
      .map((item) => normalizeSpecValue(item))
      .filter((item): item is string => Boolean(item));
    return joined.length ? joined.join(", ") : null;
  }
  if (typeof value === "object") {
    const joined = Object.values(value as Record<string, unknown>)
      .map((item) => normalizeSpecValue(item))
      .filter((item): item is string => Boolean(item));
    return joined.length ? joined.join(", ") : null;
  }
  let text = String(value);
  if (!text.trim()) return null;

  text = decodeEntities(text);
  text = text
    .replace(/<br\s*\/?>(\s|&nbsp;)*/gi, "\n")
    .replace(/\r/g, "")
    .replace(/\u00a0/g, " ");

  const lines = text
    .split(/\n+/)
    .map((line) => line.replace(/<[^>]+>/g, " ").trim())
    .filter(Boolean);

  if (!lines.length) return null;

  const merged = lines.join("\n");

  if (/\.(png|jpe?g|webp|gif)$/i.test(merged)) return null;
  if (/^https?:\/\//i.test(merged)) return null;
  if (/^true$/i.test(merged) || /^false$/i.test(merged)) return null;

  return merged;
};

const normalizeKey = (key: string): string =>
  key
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

const formatSpecKey = (key: string): string => {
  const normalized = normalizeKey(key);
  if (SPEC_KEY_TRANSLATIONS[normalized]) {
    return SPEC_KEY_TRANSLATIONS[normalized];
  }
  return key
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/(^|\s)\w/g, (match) => match.toUpperCase());
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

  const specEntries = useMemo(() => {
    if (!modalProduct || typeof modalProduct.specifications !== "object") {
      return [] as Array<{ key: string; value: string }>;
    }

    const entries: Array<{ key: string; value: string }> = [];
    const seenKeys = new Set<string>();
    for (const [rawKey, rawValue] of Object.entries(
      modalProduct.specifications as Record<string, unknown>,
    )) {
      if (!rawKey) {
        continue;
      }
      const normalizedKey = normalizeKey(rawKey);
      if (SPEC_EXCLUDED_KEYS.has(normalizedKey)) {
        continue;
      }
      if (/^anh\b/.test(normalizedKey)) {
        continue;
      }
      const value = normalizeSpecValue(rawValue);
      if (!value) {
        continue;
      }
      const key = formatSpecKey(rawKey);
      if (seenKeys.has(key)) {
        continue;
      }
      seenKeys.add(key);
      entries.push({ key, value });
      if (entries.length >= 12) {
        break;
      }
    }
    return entries;
  }, [modalProduct]);

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
                    <div className="mt-3 text-sm text-gray-700">
                      <p>{modalProduct.description ?? "Không có mô tả"}</p>
                      {specEntries.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-gray-800">
                            Thông số nổi bật
                          </h4>
                          <dl className="mt-2 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                            {specEntries.map(({ key, value }) => (
                              <div key={key} className="flex gap-2">
                                <dt className="font-medium text-gray-600 shrink-0">
                                  {key}:
                                </dt>
                                <dd className="text-gray-800 whitespace-pre-line">
                                  {value}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      )}
                    </div>
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
