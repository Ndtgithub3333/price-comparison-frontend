import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TimeSeriesChartProps {
  data: Array<{
    date: string;
    totalProducts: number;
    inStockProducts: number;
    avgPrice: number;
    newUsers: number;
  }>;
  timeRange: string;
}

export function TimeSeriesChart({ data, timeRange }: TimeSeriesChartProps) {
  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem);
    if (timeRange === "1d") {
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (timeRange === "7d" || timeRange === "30d") {
      return date.toLocaleDateString("vi-VN", {
        month: "short",
        day: "numeric",
      });
    } else {
      return date.toLocaleDateString("vi-VN", {
        month: "short",
        year: "numeric",
      });
    }
  };

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxisLabel}
            tick={{ fontSize: 12 }}
          />
          <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
          <Tooltip
            labelFormatter={(value: string) => formatXAxisLabel(value)}
            formatter={(value: number, name: string) => [
              typeof value === "number" ? value.toLocaleString("vi-VN") : value,
              name === "totalProducts"
                ? "Tổng sản phẩm"
                : name === "inStockProducts"
                  ? "Còn hàng"
                  : name === "avgPrice"
                    ? "Giá TB"
                    : name === "newUsers"
                      ? "Người dùng mới"
                      : name,
            ]}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="totalProducts"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Tổng sản phẩm"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="inStockProducts"
            stroke="#10b981"
            strokeWidth={2}
            name="Còn hàng"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avgPrice"
            stroke="#f59e0b"
            strokeWidth={2}
            name="Giá TB (VND)"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="newUsers"
            stroke="#8b5cf6"
            strokeWidth={2}
            name="Người dùng mới"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface CategoryChartProps {
  data: Array<{
    _id: string;
    count: number;
    avgPrice: number;
    inStock: number;
  }>;
}

export function CategoryChart({ data }: CategoryChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number, name: string) => [
              typeof value === "number" ? value.toLocaleString("vi-VN") : value,
              name === "count"
                ? "Số lượng"
                : name === "avgPrice"
                  ? "Giá TB"
                  : name === "inStock"
                    ? "Còn hàng"
                    : name,
            ]}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="Số lượng" />
          <Bar
            yAxisId="left"
            dataKey="inStock"
            fill="#10b981"
            name="Còn hàng"
          />
          <Bar
            yAxisId="right"
            dataKey="avgPrice"
            fill="#f59e0b"
            name="Giá TB (VND)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface StoreDistributionChartProps {
  data: Array<{
    _id: string;
    count: number;
    avgPrice: number;
  }>;
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#f97316",
];

export function StoreDistributionChart({ data }: StoreDistributionChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [
              value.toLocaleString("vi-VN"),
              "Số sản phẩm",
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface PriceComparisonChartProps {
  data: Array<{
    _id: string;
    count: number;
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
  }>;
}

export function PriceComparisonChart({ data }: PriceComparisonChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number, name: string) => [
              typeof value === "number"
                ? `${value.toLocaleString("vi-VN")} VND`
                : value,
              name === "minPrice"
                ? "Giá thấp nhất"
                : name === "maxPrice"
                  ? "Giá cao nhất"
                  : name === "avgPrice"
                    ? "Giá trung bình"
                    : name,
            ]}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="maxPrice"
            stackId="1"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.3}
            name="Giá cao nhất"
          />
          <Area
            type="monotone"
            dataKey="avgPrice"
            stackId="2"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.6}
            name="Giá trung bình"
          />
          <Area
            type="monotone"
            dataKey="minPrice"
            stackId="3"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.8}
            name="Giá thấp nhất"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export interface AnalyticsData {
  viewStats: Array<{ _id: string; count: number }>;
  redirectStats: Array<{ _id: string; count: number }>;
  totalView: number;
  totalRedirect: number;
  redirectRate: number;
}

export function AnalyticsCharts({
  analytics,
}: {
  analytics: AnalyticsData | null;
}) {
  if (!analytics) return null;
  const {
    viewStats = [],
    redirectStats = [],
  } = analytics;

  return (
    <div className="my-8 grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="rounded bg-white p-4 shadow">
        <h3 className="mb-2 font-semibold">Lượt truy cập theo ngày</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={viewStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" name="Lượt xem" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded bg-white p-4 shadow">
        <h3 className="mb-2 font-semibold">Lượt redirect theo nguồn</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={redirectStats}
              dataKey="count"
              nameKey="_id"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {redirectStats.map((_entry, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
