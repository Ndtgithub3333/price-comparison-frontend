import { Button } from "@/components/ui/button";
import type { ProductPagination as PaginationType } from "@/services/productService";

interface ProductPaginationProps {
  pagination: PaginationType;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function ProductPagination({
  pagination,
  currentPage,
  onPageChange,
}: ProductPaginationProps) {
  const { totalPages, hasPrevPage, hasNextPage } = pagination;

  // Generate page numbers with ellipsis
  const renderPageNumbers = () => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === 2 ||
        i === totalPages ||
        i === totalPages - 1 ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      }
    }
    const uniquePages = Array.from(new Set(pages)).sort((a, b) => a - b);
    const result = [];

    for (let i = 0; i < uniquePages.length; i++) {
      if (i > 0 && uniquePages[i] !== uniquePages[i - 1] + 1) {
        result.push(
          <span key={"dots-" + i} className="px-1 text-gray-400">
            ...
          </span>,
        );
      }
      result.push(
        <Button
          key={uniquePages[i]}
          size="sm"
          variant={uniquePages[i] === currentPage ? "default" : "outline"}
          className={`${uniquePages[i] === currentPage ? "font-bold" : ""} cursor-pointer`}
          onClick={() => onPageChange(uniquePages[i])}
          disabled={uniquePages[i] === currentPage}
        >
          {uniquePages[i]}
        </Button>,
      );
    }
    return result;
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <Button
        size="sm"
        variant="outline"
        disabled={!hasPrevPage}
        onClick={() => onPageChange(currentPage - 1)}
        className="cursor-pointer"
      >
        ←
      </Button>
      {renderPageNumbers()}
      <Button
        size="sm"
        variant="outline"
        disabled={!hasNextPage}
        onClick={() => onPageChange(currentPage + 1)}
        className="cursor-pointer"
      >
        →
      </Button>
    </div>
  );
}
