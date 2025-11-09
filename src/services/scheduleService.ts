import api from "./api";

export interface CrawlSchedule {
  _id: string;
  scheduleId: string;
  name: string;
  source: "dienmayxanh" | "thegioididong" | "cellphones";
  category: "phone" | "laptop";
  cronExpression: string;
  timezone?: string;
  isActive: boolean;
  lastRunAt?: string;
  lastJobId?: string;
  lastStatus?: "completed" | "failed";
  nextRunAt?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleData {
  name: string;
  source: "dienmayxanh" | "thegioididong" | "cellphones";
  category: "phone" | "laptop";
  cronExpression: string;
  timezone?: string;
  isActive?: boolean;
}

export interface UpdateScheduleData {
  name?: string;
  cronExpression?: string;
  timezone?: string;
  isActive?: boolean;
}

// Lấy danh sách schedules
export const getSchedules = async () => {
  const response = await api.get("/crawler/schedules");
  return response.data;
};

// Tạo schedule mới
export const createSchedule = async (data: CreateScheduleData) => {
  const response = await api.post("/crawler/schedules", data);
  return response.data;
};

// Cập nhật schedule
export const updateSchedule = async (id: string, data: UpdateScheduleData) => {
  const response = await api.put(`/crawler/schedules/${id}`, data);
  return response.data;
};

// Xóa schedule
export const deleteSchedule = async (id: string) => {
  const response = await api.delete(`/crawler/schedules/${id}`);
  return response.data;
};

// Toggle schedule active/inactive
export const toggleSchedule = async (id: string) => {
  const response = await api.patch(`/crawler/schedules/${id}/toggle`);
  return response.data;
};

// Helper: Parse cron to human readable
export const cronToHumanReadable = (cron: string): string => {
  const parts = cron.split(" ");
  if (parts.length < 5) return cron;

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  // Common patterns
  if (cron === "0 2 * * *") return "Hàng ngày lúc 02:00";
  if (cron === "0 0 * * 0") return "Chủ nhật hàng tuần lúc 00:00";
  if (cron === "0 0 1 * *") return "Ngày đầu tiên của mỗi tháng lúc 00:00";
  if (cron === "*/30 * * * *") return "Mỗi 30 phút";
  if (cron === "0 */6 * * *") return "Mỗi 6 giờ";

  // Custom parsing
  let result = "";

  // Minute
  if (minute === "*") result += "mỗi phút";
  else if (minute.startsWith("*/")) result += `mỗi ${minute.substring(2)} phút`;
  else result += `phút ${minute}`;

  // Hour
  if (hour !== "*") {
    if (hour.startsWith("*/")) result += ` mỗi ${hour.substring(2)} giờ`;
    else result += ` lúc ${hour}:${minute.padStart(2, "0")}`;
  }

  // Day
  if (dayOfMonth !== "*") result += ` ngày ${dayOfMonth}`;
  if (month !== "*") result += ` tháng ${month}`;
  if (dayOfWeek !== "*") {
    const days = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    result += ` ${days[parseInt(dayOfWeek)]}`;
  }

  return result || cron;
};
