import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCrawlStats } from "@/services/crawlerService";

type CrawlStatsData = {
  total: number;
  running: number;
  completed: number;
  cancelled: number;
};

export default function CrawlStats() {
  const [stats, setStats] = useState<CrawlStatsData>({
    total: 0,
    running: 0,
    completed: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadStats = async (showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      }
      const response = await getCrawlStats();
      const {
        total = 0,
        running = 0,
        completed = 0,
        cancelled = 0,
      } = response.data ?? {};

      setStats({ total, running, completed, cancelled });
    } catch {
      // Error handled silently
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadStats(true);
  }, []);

  useEffect(() => {
    if (!autoRefresh) {
      return;
    }

    loadStats(false);
    const interval = setInterval(() => loadStats(false), 3000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end gap-2">
        <span className="text-sm text-gray-500">Tự động làm mới:</span>
        <input
          type="checkbox"
          checked={autoRefresh}
          onChange={(e) => setAutoRefresh(e.target.checked)}
          className="h-4 w-4"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              📊 Tổng Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">
              🔄 Đang chạy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {stats.running}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">
              ✅ Hoàn thành
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats.completed}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              🚫 Đã hủy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-600">
              {stats.cancelled}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
