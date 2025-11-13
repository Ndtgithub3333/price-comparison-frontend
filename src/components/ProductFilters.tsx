import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  source: string;
  setSource: (value: string) => void;
  inStock: string;
  setInStock: (value: string) => void;
  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

export function ProductFilters({
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
  sort,
  setSort,
  onClearFilters,
  onApplyFilters,
}: ProductFiltersProps) {
  const hasFilters =
    search || category || source || inStock || minPrice || maxPrice || sort !== "newest";

  return (
    <div className="mb-6 rounded-lg border bg-white p-4">
      <h3 className="mb-4 text-lg font-semibold">Tìm kiếm & Lọc</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
        {/* Search */}
        <div className="xl:col-span-2">
          <Input
            placeholder="🔍 Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
        {/* Category Filter */}
        <div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="laptop">Laptop</SelectItem>
              <SelectItem value="tablet">Tablet</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Source Filter */}
        <div>
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger>
              <SelectValue placeholder="Nguồn" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dienmayxanh">Điện máy xanh</SelectItem>
              <SelectItem value="thegioididong">Thế giới di động</SelectItem>
              <SelectItem value="cellphones">CellphoneS</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Stock Filter */}
        <div>
          <Select value={inStock} onValueChange={setInStock}>
            <SelectTrigger>
              <SelectValue placeholder="Tình trạng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Còn hàng</SelectItem>
              <SelectItem value="false">Hết hàng</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Sort Filter */}
        <div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger>
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="price_asc">Giá tăng dần</SelectItem>
              <SelectItem value="price_desc">Giá giảm dần</SelectItem>
              <SelectItem value="bestseller">Bán chạy</SelectItem>
              <SelectItem value="discount">Giảm giá nhiều</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Clear Filters Button */}
        {hasFilters && (
          <div>
            <Button
              onClick={onClearFilters}
              variant="destructive"
              className="w-full cursor-pointer"
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>
      {/* Price Range */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Input
            type="number"
            placeholder="Giá từ..."
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>
        <div>
          <Input
            type="number"
            placeholder="Giá đến..."
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={onApplyFilters} className="w-full cursor-pointer">
            Áp dụng bộ lọc
          </Button>
        </div>
      </div>
    </div>
  );
}
