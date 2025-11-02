import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  getCrawlJobs,
  getCrawlJobLogs,
  cancelCrawlJob,
  type CrawlJob,
} from "@/services/crawlerService";
import { POLLING_CONFIG } from "@/config/polling";

interface JobHistoryProps {
  refreshTrigger?: number;
}

export default function JobHistory({ refreshTrigger }: JobHistoryProps) {
  const [jobs, setJobs] = useState<CrawlJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<CrawlJob | null>(null);
  const [logs, setLogs] = useState<CrawlJob["logs"]>([]);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadJobs = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await getCrawlJobs({ page, limit: 10 });
      setJobs(response.data.jobs);
      setTotalPages(response.data.pagination.totalPages);
    } catch {
      if (!silent) toast.error("Lỗi khi tải danh sách jobs");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();

    // Auto-refresh mỗi 3 giây để thấy job mới ngay lập tức
    const interval = setInterval(() => {
      if (autoRefresh) {
        loadJobs(true); // Silent refresh, không show loading
      }
  }, POLLING_CONFIG.JOBS_INTERVAL);

    return () => clearInterval(interval);
  }, [page, refreshTrigger, autoRefresh]);

  const handleViewLogs = async (job: CrawlJob) => {
    try {
      setSelectedJob(job);
      setIsLogsOpen(true);

      // Load logs lần đầu
      const response = await getCrawlJobLogs(job.jobId, 200);
      setLogs(response.data.logs);

      // Auto-refresh logs nếu job đang chạy
      if (job.status === "running") {
        const logsInterval = setInterval(async () => {
          try {
            const logsResponse = await getCrawlJobLogs(job.jobId, 200);
            setLogs(logsResponse.data.logs);

            // Update job status
            const jobDetail = await getCrawlJobs({ page: 1, limit: 100 });
            const updatedJob = jobDetail.data.jobs.find(
              (j) => j.jobId === job.jobId,
            );
            if (updatedJob?.status !== "running") {
              clearInterval(logsInterval);
            }
          } catch {
            clearInterval(logsInterval);
          }
  }, POLLING_CONFIG.LOGS_INTERVAL); // Refresh logs từ config

        // Cleanup khi đóng dialog
        return () => clearInterval(logsInterval);
      }
    } catch {
      toast.error("Lỗi khi tải logs");
    }
  };

  const handleCancelJob = async (jobId: string) => {
    try {
      await cancelCrawlJob(jobId);
      toast.success("Đã hủy job thành công");

      // Dispatch event để notify AdminCrawlerPage
      const event = new CustomEvent("jobCancelled", { detail: { jobId } });
      window.dispatchEvent(event);

      loadJobs();
    } catch (error) {
      toast.error("Lỗi khi hủy job");
    }
  };

  const getStatusBadge = (status: CrawlJob["status"]) => {
    const variants: Record<
      CrawlJob["status"],
      { variant: any; label: string }
    > = {
      pending: { variant: "secondary", label: "⏳ Chờ" },
      running: { variant: "default", label: "🔄 Đang chạy" },
      completed: { variant: "success", label: "✅ Hoàn thành" },
      failed: { variant: "destructive", label: "❌ Thất bại" },
      cancelled: { variant: "outline", label: "🚫 Đã hủy" },
    };

    const { variant, label } = variants[status];
    return <Badge variant={variant as any}>{label}</Badge>;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("vi-VN");
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>📜 Lịch sử Crawl Jobs</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Tự động làm mới:</span>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="h-4 w-4"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job ID</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-8 text-center">
                        Chưa có job nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    jobs.map((job) => (
                      <TableRow key={job._id}>
                        <TableCell className="font-mono text-xs">
                          {job.jobId.slice(0, 20)}...
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{job.source}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{job.category}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(job.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <span className="text-green-600">
                              +{job.newItems || 0}
                            </span>{" "}
                            /{" "}
                            <span className="text-blue-600">
                              ~{job.updatedItems || 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDuration(job.duration)}</TableCell>
                        <TableCell className="text-xs">
                          {formatDate(job.startedAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewLogs(job)}
                            >
                              📋 Logs
                            </Button>
                            {(job.status === "running" ||
                              job.status === "pending") && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleCancelJob(job.jobId)}
                              >
                                ❌ Hủy
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Trang {page} / {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    ← Trước
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Sau →
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Log Viewer Dialog */}
      <Dialog open={isLogsOpen} onOpenChange={setIsLogsOpen}>
        <DialogContent className="max-h-[80vh] max-w-4xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>
                📋 Logs - {selectedJob?.jobId.slice(0, 30)}...
              </DialogTitle>
              {selectedJob && (
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedJob.status)}
                  <span className="text-sm text-gray-500">
                    {selectedJob.progress}%
                  </span>
                </div>
              )}
            </div>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto rounded-lg border bg-black p-4 font-mono text-xs">
            {logs.length === 0 ? (
              <div className="text-gray-400">Đang tải logs...</div>
            ) : (
              logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`mb-1 ${
                    log.level === "error"
                      ? "text-red-400"
                      : log.level === "warning"
                        ? "text-yellow-400"
                        : "text-green-400"
                  }`}
                >
                  <span className="text-gray-500">
                    [{new Date(log.timestamp).toLocaleTimeString("vi-VN")}]
                  </span>{" "}
                  <span className="text-blue-400">
                    [{log.level.toUpperCase()}]
                  </span>{" "}
                  {log.message}
                </div>
              ))
            )}
          </div>
          {selectedJob?.status === "running" && (
            <div className="text-center text-xs text-gray-500">
              🔄 Logs tự động cập nhật mỗi 2 giây...
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
