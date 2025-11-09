import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { runCrawler } from "@/services/crawlerService";
import CrawlStats from "@/components/admin/CrawlStats";
import JobHistory from "@/components/admin/JobHistory";
import ScheduleManagement from "@/components/admin/ScheduleManagement";

import type { RunCrawlerResponse } from "@/services/crawlerService";

export default function AdminCrawlerPage() {
  const [dmxResult, setDmxResult] = useState<RunCrawlerResponse | null>(null);
  const [tgddResult, setTgddResult] = useState<RunCrawlerResponse | null>(null);
  const [tgddLaptopResult, setTgddLaptopResult] =
    useState<RunCrawlerResponse | null>(null);
  const [cellphonesResult, setCellphonesResult] =
    useState<RunCrawlerResponse | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCrawlDMX = async () => {
    setDmxResult(null);

    try {
      toast.info("🚀 Đang crawl Điện Máy Xanh...", { duration: 5000 });

      const response = await runCrawler("dmx");

      setDmxResult(response);

      if (response.success) {
        toast.success(`✅ ${response.message}`, { duration: 5000 });
        setRefreshTrigger((prev) => prev + 1); // Refresh job history
      } else {
        toast.error(`❌ ${response.message}`, { duration: 5000 });
      }
    } catch (error: unknown) {
      const errorMsg =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Crawl thất bại";
      toast.error(`❌ ${errorMsg}`);
      setDmxResult({
        success: false,
        message: errorMsg,
        error: (error as Error).message,
      });
    }
  };

  const handleCrawlCellphones = async () => {
    setCellphonesResult(null);

    try {
      toast.info("🚀 Đang crawl CellphoneS...", { duration: 5000 });

      const response = await runCrawler("cellphones");

      setCellphonesResult(response);

      if (response.success) {
        toast.success(`✅ ${response.message}`, { duration: 5000 });
        setRefreshTrigger((prev) => prev + 1);
      } else {
        toast.error(`❌ ${response.message}`, { duration: 5000 });
      }
    } catch (error: unknown) {
      const errorMsg =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Crawl thất bại";
      toast.error(`❌ ${errorMsg}`);
      setCellphonesResult({
        success: false,
        message: errorMsg,
        error: (error as Error).message,
      });
    }
  };

  const handleCrawlTGDD = async () => {
    setTgddResult(null);

    try {
      toast.info("🚀 Đang crawl Thế Giới Di Động...", { duration: 5000 });

      const response = await runCrawler("tgdd");

      setTgddResult(response);

      if (response.success) {
        toast.success(`✅ ${response.message}`, { duration: 5000 });
        setRefreshTrigger((prev) => prev + 1);
      } else {
        toast.error(`❌ ${response.message}`, { duration: 5000 });
      }
    } catch (error: unknown) {
      const errorMsg =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Crawl thất bại";
      toast.error(`❌ ${errorMsg}`);
      setTgddResult({
        success: false,
        message: errorMsg,
        error: (error as Error).message,
      });
    }
  };

  const handleCrawlTGDDLaptop = async () => {
    setTgddLaptopResult(null);

    try {
      toast.info("🚀 Đang crawl Laptop TGDD...", { duration: 5000 });

      const response = await runCrawler("tgdd-laptop");

      setTgddLaptopResult(response);

      if (response.success) {
        toast.success(`✅ ${response.message}`, { duration: 5000 });
        setRefreshTrigger((prev) => prev + 1);
      } else {
        toast.error(`❌ ${response.message}`, { duration: 5000 });
      }
    } catch (error: unknown) {
      const errorMsg =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Crawl thất bại";
      toast.error(`❌ ${errorMsg}`);
      setTgddLaptopResult({
        success: false,
        message: errorMsg,
        error: (error as Error).message,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Crawler Management
        </h2>
        <p className="text-muted-foreground">
          Quản lý việc crawl dữ liệu sản phẩm từ các website
        </p>
      </div>

      {/* Stats Dashboard */}
      <CrawlStats />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Điện Máy Xanh Crawler */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🟢</span>
              Điện Máy Xanh
            </CardTitle>
            <CardDescription>
              Crawl dữ liệu điện thoại từ dienmayxanh.com
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleCrawlDMX} className="w-full" size="lg">
              🚀 Bắt đầu Crawl
            </Button>

            {dmxResult && (
              <div
                className={`rounded-lg border p-4 ${dmxResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
              >
                <h4 className="mb-2 font-semibold">
                  {dmxResult.success ? "✅ Thành công" : "❌ Thất bại"}
                </h4>
                <p className="mb-3 text-sm">{dmxResult.message}</p>

                {dmxResult.data && (
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="rounded bg-white p-2 text-center">
                      <div className="text-xs text-gray-500">Tổng</div>
                      <div className="text-lg font-bold">
                        {dmxResult.data.totalProducts}
                      </div>
                    </div>
                    <div className="rounded bg-white p-2 text-center">
                      <div className="text-xs text-gray-500">Mới</div>
                      <div className="text-lg font-bold text-green-600">
                        {dmxResult.data.newProducts}
                      </div>
                    </div>
                    <div className="rounded bg-white p-2 text-center">
                      <div className="text-xs text-gray-500">Cập nhật</div>
                      <div className="text-lg font-bold text-blue-600">
                        {dmxResult.data.updatedProducts}
                      </div>
                    </div>
                  </div>
                )}

                {dmxResult.error && (
                  <div className="mt-2 rounded bg-white p-2 text-xs text-red-600">
                    <strong>Error:</strong> {dmxResult.error}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* CellphoneS Crawler */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🔴</span>
              CellphoneS
            </CardTitle>
            <CardDescription>
              Crawl dữ liệu điện thoại từ cellphones.com.vn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleCrawlCellphones}
              className="w-full"
              size="lg"
              variant="default"
            >
              🚀 Bắt đầu Crawl
            </Button>

            {cellphonesResult && (
              <div
                className={`rounded-lg border p-4 ${cellphonesResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
              >
                <h4 className="mb-2 font-semibold">
                  {cellphonesResult.success ? "✅ Thành công" : "❌ Thất bại"}
                </h4>
                <p className="mb-3 text-sm">{cellphonesResult.message}</p>

                {cellphonesResult.data && (
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="rounded bg-white p-2 text-center">
                      <div className="text-xs text-gray-500">Tổng</div>
                      <div className="text-lg font-bold">
                        {cellphonesResult.data.totalProducts}
                      </div>
                    </div>
                    <div className="rounded bg-white p-2 text-center">
                      <div className="text-xs text-gray-500">Mới</div>
                      <div className="text-lg font-bold text-green-600">
                        {cellphonesResult.data.newProducts}
                      </div>
                    </div>
                    <div className="rounded bg-white p-2 text-center">
                      <div className="text-xs text-gray-500">Cập nhật</div>
                      <div className="text-lg font-bold text-blue-600">
                        {cellphonesResult.data.updatedProducts}
                      </div>
                    </div>
                  </div>
                )}

                {cellphonesResult.error && (
                  <div className="mt-2 rounded bg-white p-2 text-xs text-red-600">
                    <strong>Error:</strong> {cellphonesResult.error}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* TGDD Crawler */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🔵</span>
              Thế Giới Di Động
            </CardTitle>
            <CardDescription>
              Crawl dữ liệu điện thoại từ thegioididong.com
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleCrawlTGDD}
              className="w-full"
              size="lg"
              variant="default"
            >
              🚀 Bắt đầu Crawl
            </Button>

            {tgddResult && (
              <div
                className={`rounded-lg border p-4 ${tgddResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
              >
                <h4 className="mb-2 font-semibold">
                  {tgddResult.success ? "✅ Thành công" : "❌ Thất bại"}
                </h4>
                <p className="mb-3 text-sm">{tgddResult.message}</p>

                {tgddResult.data && (
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="rounded bg-white p-2 text-center">
                      <div className="text-xs text-gray-500">Tổng</div>
                      <div className="text-lg font-bold">
                        {tgddResult.data.totalProducts}
                      </div>
                    </div>
                    <div className="rounded bg-white p-2 text-center">
                      <div className="text-xs text-gray-500">Mới</div>
                      <div className="text-lg font-bold text-green-600">
                        {tgddResult.data.newProducts}
                      </div>
                    </div>
                    <div className="rounded bg-white p-2 text-center">
                      <div className="text-xs text-gray-500">Cập nhật</div>
                      <div className="text-lg font-bold text-blue-600">
                        {tgddResult.data.updatedProducts}
                      </div>
                    </div>
                  </div>
                )}

                {tgddResult.error && (
                  <div className="mt-2 rounded bg-white p-2 text-xs text-red-600">
                    <strong>Error:</strong> {tgddResult.error}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* TGDD Laptop Crawler */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">💻</span>
              TGDD Laptop
            </CardTitle>
            <CardDescription>
              Crawl dữ liệu laptop từ thegioididong.com
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleCrawlTGDDLaptop}
              className="w-full"
              size="lg"
              variant="default"
            >
              🚀 Bắt đầu Crawl
            </Button>

            {tgddLaptopResult && (
              <div
                className={`rounded-lg border p-4 ${tgddLaptopResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
              >
                <h4 className="mb-2 font-semibold">
                  {tgddLaptopResult.success ? "✅ Thành công" : "❌ Thất bại"}
                </h4>
                <p className="mb-3 text-sm">{tgddLaptopResult.message}</p>

                {tgddLaptopResult.data && (
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="rounded bg-white p-2 text-center">
                      <div className="text-xs text-gray-500">Tổng</div>
                      <div className="text-lg font-bold">
                        {tgddLaptopResult.data.totalProducts}
                      </div>
                    </div>
                    <div className="rounded bg-white p-2 text-center">
                      <div className="text-xs text-gray-500">Mới</div>
                      <div className="text-lg font-bold text-green-600">
                        {tgddLaptopResult.data.newProducts}
                      </div>
                    </div>
                    <div className="rounded bg-white p-2 text-center">
                      <div className="text-xs text-gray-500">Cập nhật</div>
                      <div className="text-lg font-bold text-blue-600">
                        {tgddLaptopResult.data.updatedProducts}
                      </div>
                    </div>
                  </div>
                )}

                {tgddLaptopResult.error && (
                  <div className="mt-2 rounded bg-white p-2 text-xs text-red-600">
                    <strong>Error:</strong> {tgddLaptopResult.error}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>ℹ️ Thông tin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <p>
            • <strong>Điện Máy Xanh:</strong> Sử dụng Puppeteer (Node.js), crawl
            điện thoại (~300-400 sản phẩm)
          </p>
          <p>
            • <strong>TGDD Phone:</strong> Sử dụng Scrapy (Python), crawl điện
            thoại (~149 sản phẩm)
          </p>
          <p>
            • <strong>TGDD Laptop:</strong> Sử dụng Scrapy (Python), crawl
            laptop (~417 sản phẩm)
          </p>
          <p>
            • <strong>CellphoneS:</strong> Sử dụng GraphQL API (Node.js fetch),
            crawl điện thoại (~1200 sản phẩm)
          </p>
          <p>• Dữ liệu được lưu trực tiếp vào MongoDB</p>
          <p>• Sản phẩm trùng lặp sẽ được tự động cập nhật</p>
        </CardContent>
      </Card>

      {/* Schedule Management */}
      <ScheduleManagement />

      {/* Job History */}
      <JobHistory refreshTrigger={refreshTrigger} />
    </div>
  );
}
