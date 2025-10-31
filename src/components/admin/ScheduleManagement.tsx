import { useState, useEffect } from "react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  toggleSchedule,
  cronToHumanReadable,
  type CrawlSchedule,
  type CreateScheduleData,
} from "@/services/scheduleService";

const CRON_PRESETS = [
  { label: "Mỗi 30 phút", value: "*/30 * * * *" },
  { label: "Mỗi giờ", value: "0 * * * *" },
  { label: "Mỗi 6 giờ", value: "0 */6 * * *" },
  { label: "Hàng ngày lúc 02:00", value: "0 2 * * *" },
  { label: "Hàng ngày lúc 14:00", value: "0 14 * * *" },
  { label: "Thứ 2 hàng tuần lúc 08:00", value: "0 8 * * 1" },
  { label: "Ngày đầu tháng lúc 00:00", value: "0 0 1 * *" },
];

export default function ScheduleManagement() {
  const [schedules, setSchedules] = useState<CrawlSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<CrawlSchedule | null>(
    null,
  );

  // Form state
  const [formData, setFormData] = useState<CreateScheduleData>({
    name: "",
    source: "dienmayxanh",
    category: "phone",
    cronExpression: "0 2 * * *",
    timezone: "Asia/Ho_Chi_Minh",
    isActive: true,
  });

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const response = await getSchedules();
      setSchedules(response.data);
    } catch {
      toast.error("Lỗi khi tải danh sách lịch crawl");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleOpenDialog = (schedule?: CrawlSchedule) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        name: schedule.name,
        source: schedule.source,
        category: schedule.category,
        cronExpression: schedule.cronExpression,
        timezone: schedule.timezone,
        isActive: schedule.isActive,
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        name: "",
        source: "dienmayxanh",
        category: "phone",
        cronExpression: "0 2 * * *",
        timezone: "Asia/Ho_Chi_Minh",
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSchedule) {
        await updateSchedule(editingSchedule._id, {
          name: formData.name,
          cronExpression: formData.cronExpression,
          timezone: formData.timezone,
          isActive: formData.isActive,
        });
        toast.success("Cập nhật lịch crawl thành công");
      } else {
        await createSchedule(formData);
        toast.success("Tạo lịch crawl thành công");
      }
      setIsDialogOpen(false);
      loadSchedules();
    } catch (error: unknown) {
      const errorMsg =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Có lỗi xảy ra";
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa lịch crawl này?")) return;

    try {
      await deleteSchedule(id);
      toast.success("Xóa lịch crawl thành công");
      loadSchedules();
    } catch {
      toast.error("Lỗi khi xóa lịch crawl");
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleSchedule(id);
      toast.success("Đã cập nhật trạng thái lịch crawl");
      loadSchedules();
    } catch {
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("vi-VN");
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>🗓️ Lịch Crawl Tự Động</CardTitle>
          <Button onClick={() => handleOpenDialog()}>➕ Tạo lịch mới</Button>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground mb-4 space-y-1 text-sm">
            <p>
              👆 Nhấn <strong>Tạo lịch mới</strong> để mở biểu mẫu cấu hình.
            </p>
            <p>
              ✅ Chọn <strong>Source</strong> và <strong>Category</strong> phù
              hợp với crawler.
            </p>
            <p>
              ⏰ Dùng preset có sẵn hoặc tự nhập cron expression (ví dụ:{" "}
              <code>0 2 * * *</code> chạy hằng ngày lúc 02:00).
            </p>
            <p>📝 Cron expression gồm 5 phần: phút, giờ, ngày, tháng, thứ.</p>
            <p>
              🔁 Ký hiệu <code>/</code> nghĩa là bước nhảy, ví dụ{" "}
              <code>*/30</code> là mỗi 30 phút.
            </p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Lịch chạy</TableHead>
                  <TableHead>Lần chạy tiếp theo</TableHead>
                  <TableHead>Lần chạy cuối</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center">
                      Chưa có lịch nào
                    </TableCell>
                  </TableRow>
                ) : (
                  schedules.map((schedule) => (
                    <TableRow key={schedule._id}>
                      <TableCell className="font-medium">
                        {schedule.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{schedule.source}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{schedule.category}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {cronToHumanReadable(schedule.cronExpression)}
                        <div className="text-xs text-gray-500">
                          ({schedule.cronExpression})
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        {formatDate(schedule.nextRunAt)}
                      </TableCell>
                      <TableCell>
                        {schedule.lastRunAt ? (
                          <div className="text-xs">
                            <div>{formatDate(schedule.lastRunAt)}</div>
                            {schedule.lastStatus && (
                              <Badge
                                variant={
                                  schedule.lastStatus === "completed"
                                    ? "default"
                                    : "destructive"
                                }
                                className="mt-1"
                              >
                                {schedule.lastStatus}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={schedule.isActive ? "default" : "secondary"}
                        >
                          {schedule.isActive ? "🟢 Bật" : "⚪ Tắt"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggle(schedule._id)}
                          >
                            {schedule.isActive ? "Tắt" : "Bật"}
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleOpenDialog(schedule)}
                          >
                            Sửa
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(schedule._id)}
                          >
                            Xóa
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog for create/edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSchedule ? "Sửa lịch crawl" : "Tạo lịch crawl mới"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Tên lịch</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="VD: Crawl điện thoại DMX hàng ngày"
                  required
                />
              </div>

              {!editingSchedule && (
                <>
                  <div>
                    <Label htmlFor="source">Source</Label>
                    <Select
                      value={formData.source}
                      onValueChange={(value: "dienmayxanh" | "thegioididong") =>
                        setFormData({ ...formData, source: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dienmayxanh">
                          Điện Máy Xanh
                        </SelectItem>
                        <SelectItem value="thegioididong">
                          Thế Giới Di Động
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: "phone" | "laptop") =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="laptop">Laptop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="cron">Lịch chạy (Cron Expression)</Label>
                <Select
                  value={
                    CRON_PRESETS.some(
                      (preset) => preset.value === formData.cronExpression,
                    )
                      ? formData.cronExpression
                      : "custom"
                  }
                  onValueChange={(value) => {
                    if (value === "custom") return;
                    setFormData({ ...formData, cronExpression: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lịch có sẵn hoặc tự nhập" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Tùy chỉnh</SelectItem>
                    {CRON_PRESETS.map((preset) => (
                      <SelectItem key={preset.value} value={preset.value}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  className="mt-2"
                  value={formData.cronExpression}
                  onChange={(e) =>
                    setFormData({ ...formData, cronExpression: e.target.value })
                  }
                  placeholder="0 2 * * *"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {cronToHumanReadable(formData.cronExpression)}
                </p>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit">
                {editingSchedule ? "Cập nhật" : "Tạo mới"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
