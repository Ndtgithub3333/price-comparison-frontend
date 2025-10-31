import api from "./api";

export interface CrawlJob {
  _id: string;
  jobId: string;
  source: "dienmayxanh" | "thegioididong";
  category: "phone" | "laptop";
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  progress: number;
  totalItems?: number;
  processedItems?: number;
  newItems?: number;
  updatedItems?: number;
  failedItems?: number;
  logs: Array<{
    timestamp: string;
    level: "info" | "warning" | "error";
    message: string;
  }>;
  error?: string;
  triggeredBy?: "manual" | "scheduled" | "auto";
  userId?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CrawlJobsResponse {
  success: boolean;
  data: {
    jobs: CrawlJob[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface CrawlStatsResponse {
  success: boolean;
  data: {
    total: number;
    running: number;
    completed: number;
    failed: number;
    cancelled: number;
  };
}

export interface JobLogsResponse {
  success: boolean;
  data: {
    logs: Array<{
      timestamp: string;
      level: "info" | "warning" | "error";
      message: string;
    }>;
  };
}

/**
 * Lấy danh sách crawl jobs
 */
export const getCrawlJobs = async (params?: {
  source?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<CrawlJobsResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.source) queryParams.append("source", params.source);
  if (params?.category) queryParams.append("category", params.category);
  if (params?.status) queryParams.append("status", params.status);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  const response = await api.get<CrawlJobsResponse>(
    `/crawler/jobs?${queryParams.toString()}`,
  );
  return response.data;
};

/**
 * Lấy chi tiết một job
 */
export const getCrawlJobDetail = async (
  jobId: string,
): Promise<{ success: boolean; data: CrawlJob }> => {
  const response = await api.get(`/crawler/jobs/${jobId}`);
  return response.data;
};

/**
 * Lấy logs của một job
 */
export const getCrawlJobLogs = async (
  jobId: string,
  limit?: number,
): Promise<JobLogsResponse> => {
  const queryParams = limit ? `?limit=${limit}` : "";
  const response = await api.get<JobLogsResponse>(
    `/crawler/jobs/${jobId}/logs${queryParams}`,
  );
  return response.data;
};

/**
 * Hủy một job đang chạy
 */
export const cancelCrawlJob = async (
  jobId: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(`/crawler/jobs/${jobId}/cancel`);
  return response.data;
};

/**
 * Lấy thống kê crawl jobs
 */
export const getCrawlStats = async (): Promise<CrawlStatsResponse> => {
  const response = await api.get<CrawlStatsResponse>("/crawler/stats");
  return response.data;
};

/**
 * Chạy crawler (existing)
 */
export const runCrawler = async (
  type: "dmx" | "tgdd" | "tgdd-laptop",
): Promise<any> => {
  const endpoints = {
    dmx: "/crawler/run",
    tgdd: "/crawler/run-tgdd",
    "tgdd-laptop": "/crawler/run-tgdd-laptop",
  };

  const response = await api.post(endpoints[type]);
  return response.data;
};
