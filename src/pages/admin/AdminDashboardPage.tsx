import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getDashboardStats,
  getRecentActivity,
} from "../../services/dashboardService";
import {
  getProductAnalytics,
  getTopProducts,
} from "../../services/productService";
import type {
  DashboardStats,
  RecentActivity,
} from "../../services/dashboardService";
import type { AnalyticsData } from "@/components/charts/DashboardCharts";
import { toast } from "sonner";
import {
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  AlertCircle,
  RefreshCw,
} from "@/components/icons/temp-icons";
import TimeRangeSelector from "../../components/ui/time-range-selector";
import {
  TimeSeriesChart,
  CategoryChart,
  StoreDistributionChart,
  PriceComparisonChart,
  AnalyticsCharts,
} from "../../components/charts/DashboardCharts";

type CategoryStat = {
  _id: string;
  count: number;
  avgPrice: number;
  inStock: number;
};

type StoreStat = {
  _id: string;
  count: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
};

type RecentProduct = {
  _id: string;
  name: string;
  price: number;
  store: string;
  category: string;
  inStock: boolean;
  updatedAt: string;
};

type RecentUser = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
};

type TopProduct = {
  product?: {
    _id: string;
    name: string;
    price?: number;
    category?: string;
  };
  count: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<RecentActivity | null>(null);
  const [topViewed, setTopViewed] = useState<TopProduct[]>([]);
  const [topRedirected, setTopRedirected] = useState<TopProduct[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState("all");

  const fetchDashboardData = async (
    selectedTimeRange = timeRange,
    showRefreshing = false,
  ) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);

      const [statsRes, activityRes] = await Promise.all([
        getDashboardStats(selectedTimeRange),
        getRecentActivity(10),
      ]);

      // fetch analytics and top products for selected range
      const analyticsRes = await getProductAnalytics(selectedTimeRange);
      const topRes = await getTopProducts(selectedTimeRange);

      setAnalytics(analyticsRes);
      setTopViewed(topRes.topViewed || []);
      setTopRedirected(topRes.topRedirected || []);

      setStats(statsRes.data);
      setActivity(activityRes.data);
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Lỗi khi tải dữ liệu dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleTimeRangeChange = (newTimeRange: string) => {
    setTimeRange(newTimeRange);
    fetchDashboardData(newTimeRange, true);
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    fetchDashboardData(timeRange, true);
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <p>Đang tải dữ liệu dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="py-8 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
        <p className="text-red-500">Không thể tải dữ liệu dashboard</p>
        <Button onClick={() => fetchDashboardData()} className="mt-4">
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header với time range selector và refresh button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Tổng quan hệ thống và thống kê</p>
        </div>
        <div className="flex gap-3">
          <TimeRangeSelector
            value={timeRange}
            onChange={handleTimeRangeChange}
            disabled={loading || refreshing}
          />
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Traffic / Redirect summary */}
      {analytics && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Tổng lượt truy cập
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalView}</div>
              <p className="text-muted-foreground text-sm">
                Lượt xem sản phẩm trong khoảng chọn
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Tổng lượt redirect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {analytics.totalRedirect}
              </div>
              <p className="text-muted-foreground text-sm">
                Số lần người dùng được chuyển tới nguồn bán
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Tỉ lệ redirect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {(analytics.redirectRate * 100).toFixed(2)}%
              </div>
              <p className="text-muted-foreground text-sm">
                Tỉ lệ redirect / lượt xem
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.overview.totalProducts}
            </div>
            <p className="text-muted-foreground text-xs">
              {stats.overview.recentProducts} sản phẩm mới trong{" "}
              {timeRange === "all"
                ? "tất cả thời gian"
                : timeRange === "1d"
                  ? "hôm nay"
                  : timeRange === "7d"
                    ? "7 ngày qua"
                    : timeRange === "30d"
                      ? "30 ngày qua"
                      : timeRange === "90d"
                        ? "3 tháng qua"
                        : "1 năm qua"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người dùng</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.overview.totalUsers}
            </div>
            <p className="text-muted-foreground text-xs">Không bao gồm admin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Còn hàng</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.overview.activeProducts}
            </div>
            <p className="text-muted-foreground text-xs">
              {stats.overview.stockPercentage}% tổng sản phẩm
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hết hàng</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.overview.outOfStockProducts}
            </div>
            <p className="text-muted-foreground text-xs">Cần cập nhật kho</p>
          </CardContent>
        </Card>
      </div>

      {/* Category & Store Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Category Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Thống kê theo danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.categoryStats.map((category: CategoryStat) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {category._id || "Không phân loại"}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {category.inStock}/{category.count} còn hàng
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{category.count} sản phẩm</p>
                    <p className="text-muted-foreground text-sm">
                      ~{category.avgPrice.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Store Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Thống kê theo cửa hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.storeStats.slice(0, 5).map((store: StoreStat) => (
                <div
                  key={store._id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{store._id}</p>
                    <p className="text-muted-foreground text-sm">
                      {store.minPrice.toLocaleString("vi-VN")}đ -{" "}
                      {store.maxPrice.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{store.count} sản phẩm</p>
                    <p className="text-muted-foreground text-sm">
                      TB: {store.avgPrice.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price Range */}
      {stats.priceRange.highest && stats.priceRange.lowest && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-red-500" />
                Sản phẩm đắt nhất
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-lg font-bold">
                  {stats.priceRange.highest.name}
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.priceRange.highest.price.toLocaleString("vi-VN")}đ
                </p>
                <p className="text-muted-foreground text-sm">
                  {stats.priceRange.highest.store} •{" "}
                  {stats.priceRange.highest.category}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingDown className="mr-2 h-5 w-5 text-green-500" />
                Sản phẩm rẻ nhất
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-lg font-bold">
                  {stats.priceRange.lowest.name}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.priceRange.lowest.price.toLocaleString("vi-VN")}đ
                </p>
                <p className="text-muted-foreground text-sm">
                  {stats.priceRange.lowest.store} •{" "}
                  {stats.priceRange.lowest.category}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Visualization Charts */}
      <div className="space-y-6">
        {/* Time Series Chart */}
        {stats.timeSeriesData && stats.timeSeriesData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Xu hướng theo thời gian</CardTitle>
              <p className="text-muted-foreground text-sm">
                Biểu đồ thống kê trong khoảng thời gian {stats.timeRange}
              </p>
            </CardHeader>
            <CardContent>
              <TimeSeriesChart
                data={stats.timeSeriesData}
                timeRange={timeRange}
              />
            </CardContent>
          </Card>
        )}

        {/* Category and Store Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Category Chart */}
          {stats.categoryStats && stats.categoryStats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Phân tích danh mục sản phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryChart data={stats.categoryStats} />
              </CardContent>
            </Card>
          )}

          {/* Store Distribution Chart */}
          {stats.storeStats && stats.storeStats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Phân bố theo cửa hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <StoreDistributionChart data={stats.storeStats} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Price Comparison Chart */}
        {stats.storeStats && stats.storeStats.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>So sánh giá theo cửa hàng</CardTitle>
              <p className="text-muted-foreground text-sm">
                Biểu đồ giá thấp nhất, trung bình và cao nhất của từng cửa hàng
              </p>
            </CardHeader>
            <CardContent>
              <PriceComparisonChart data={stats.storeStats} />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Top products (viewed / redirected) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top sản phẩm được xem nhiều</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topViewed.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  Không có dữ liệu
                </p>
              )}
              {topViewed.map((t) => (
                <div
                  key={t.product?._id || Math.random()}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {t.product?.name || "Không xác định"}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {t.product?.category || "-"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{t.count}</p>
                    <p className="text-muted-foreground text-xs">lượt xem</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top sản phẩm được redirect nhiều</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topRedirected.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  Không có dữ liệu
                </p>
              )}
              {topRedirected.map((t) => (
                <div
                  key={t.product?._id || Math.random()}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {t.product?.name || "Không xác định"}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {t.product?.category || "-"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{t.count}</p>
                    <p className="text-muted-foreground text-xs">
                      lượt redirect
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {activity && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Sản phẩm cập nhật gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activity.recentProducts
                  .slice(0, 5)
                  .map((product: RecentProduct) => (
                    <div
                      key={product._id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {product.store} • {product.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">
                          {product.price.toLocaleString("vi-VN")}đ
                        </p>
                        <p
                          className={`text-xs ${product.inStock ? "text-green-600" : "text-red-600"}`}
                        >
                          {product.inStock ? "Còn hàng" : "Hết hàng"}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Người dùng mới
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activity.recentUsers.map((user: RecentUser) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {user.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground text-xs">
                        {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Charts */}
      <AnalyticsCharts analytics={analytics} />
    </div>
  );
}
