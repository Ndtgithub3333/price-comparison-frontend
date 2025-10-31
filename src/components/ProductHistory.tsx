import { useState, useEffect } from "react";
import {
  getProductHistory,
  type ProductHistory as IProductHistory,
} from "@/services/productService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ProductHistoryProps {
  productId: string;
}

const formatValue = (
  value: string | number | boolean | null | undefined,
): string => {
  if (value === null || value === undefined) return "N/A";
  if (typeof value === "boolean") return value ? "Có" : "Không";
  if (typeof value === "number") return value.toLocaleString();
  return String(value);
};

const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    price: "Giá",
    originalPrice: "Giá gốc",
    discount: "Giảm giá",
    inStock: "Còn hàng",
    rating: "Đánh giá",
    soldCount: "Đã bán",
    promotion: "Khuyến mãi",
  };
  return labels[field] || field;
};

const getChangeColor = (
  field: string,
  oldValue: string | number | boolean | null | undefined,
  newValue: string | number | boolean | null | undefined,
): string => {
  if (field === "price" || field === "originalPrice") {
    if (Number(newValue) < Number(oldValue)) return "text-green-600";
    if (Number(newValue) > Number(oldValue)) return "text-red-600";
  }
  if (field === "discount") {
    if (Number(newValue) > Number(oldValue)) return "text-green-600";
    if (Number(newValue) < Number(oldValue)) return "text-red-600";
  }
  if (field === "inStock") {
    if (newValue === true && oldValue === false) return "text-green-600";
    if (newValue === false && oldValue === true) return "text-red-600";
  }
  return "text-blue-600";
};

export default function ProductHistory({ productId }: ProductHistoryProps) {
  const [history, setHistory] = useState<IProductHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const { history: data } = await getProductHistory(productId);
        setHistory(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching product history:", err);
        setError("Không thể tải lịch sử sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [productId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📊 Lịch sử thay đổi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-20 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-20 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-20 w-full animate-pulse rounded bg-gray-200" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📊 Lịch sử thay đổi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📊 Lịch sử thay đổi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Chưa có lịch sử thay đổi nào</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>📊 Lịch sử thay đổi</span>
          <Badge variant="secondary">{history.length} lần</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Price Chart */}
        {history.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-semibold text-gray-700">
              📈 Biểu đồ giá
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={[...history].reverse().map((item) => ({
                  date: new Date(item.changedAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                  }),
                  price: item.price || 0,
                  originalPrice: item.originalPrice || 0,
                }))}
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#666" />
                <YAxis
                  tick={{ fontSize: 11 }}
                  stroke="#666"
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [
                    `${value.toLocaleString()}₫`,
                    "",
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} iconType="line" />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#2563eb"
                  strokeWidth={2}
                  name="Giá bán"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="originalPrice"
                  stroke="#9ca3af"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  name="Giá gốc"
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* History List */}
        <h4 className="mb-3 text-sm font-semibold text-gray-700">
          📋 Chi tiết thay đổi
        </h4>
        <div className="max-h-96 space-y-4 overflow-y-auto">
          {history.map((item) => (
            <div
              key={item._id}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {new Date(item.changedAt).toLocaleString("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {item.crawlJobId && (
                  <Badge variant="outline" className="text-xs">
                    Job: {item.crawlJobId.slice(-8)}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                {item.changes.map((change, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="font-medium text-gray-700">
                      {getFieldLabel(change.field)}:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">
                        {formatValue(change.oldValue)}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span
                        className={`font-semibold ${getChangeColor(
                          change.field,
                          change.oldValue,
                          change.newValue,
                        )}`}
                      >
                        {formatValue(change.newValue)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {item.price !== undefined && (
                <div className="mt-2 border-t border-gray-300 pt-2">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Giá tại thời điểm:</span>{" "}
                    <span className="font-semibold text-blue-600">
                      {item.price.toLocaleString()}₫
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
