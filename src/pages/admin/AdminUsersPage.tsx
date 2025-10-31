import { useEffect, useState, useCallback } from "react";
// import axios from "axios";
import { userAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type User = {
  _id: string;
  email: string;
  name: string;
  role: string;
};

type Activity = {
  searchHistory?: Array<{ keyword?: string; searchedAt?: string }>;
  favoriteProducts?: Array<{ _id?: string; name?: string; price?: number }>;
  viewHistory?: Array<{
    product?: { _id?: string; name?: string; price?: number };
    viewedAt?: string;
  }>;
  redirectHistory?: Array<{
    product?: { _id?: string; name?: string };
    source?: string;
    url?: string;
    redirectedAt?: string;
  }>;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<User | null>(null);
  const [tab, setTab] = useState<"activity" | "mail">("activity");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [activity, setActivity] = useState<Activity | null>(null);
  const [sendingCustom, setSendingCustom] = useState(false);
  const [sendingSummary, setSendingSummary] = useState(false);

  const getErrMsg = (err: unknown, fallback: string) => {
    const shaped = err as
      | { response?: { data?: { message?: string } }; message?: string }
      | undefined;
    return (
      (shaped && (shaped.response?.data?.message || shaped.message)) || fallback
    );
  };

  const fetchUsers = useCallback(async () => {
    try {
      const res = await userAPI.get("/");
      setUsers(res.data.users || []);
    } catch (err) {
      console.debug(err);
      const msg = getErrMsg(err, "Không load được danh sách user");
      toast.error(msg);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openUser = async (u: User) => {
    setSelected(u);
    setTab("activity");
    try {
      const res = await userAPI.get(`/${u._id}/activity`);
      setActivity(res.data.activity);
    } catch (err) {
      console.debug(err);
      const msg = getErrMsg(err, "Không lấy được activity");
      toast.error(msg);
      setActivity(null);
    }
  };

  const sendCustomEmail = async () => {
    if (!selected) return;
    setSendingCustom(true);
    try {
      await userAPI.post(`/${selected._id}/send-email`, { subject, text });
      toast.success("Gửi email thành công");
      setSubject("");
      setText("");
    } catch (err) {
      console.debug(err);
      const msg = getErrMsg(err, "Gửi email thất bại");
      toast.error(msg);
    } finally {
      setSendingCustom(false);
    }
  };

  const sendActivityEmail = async () => {
    if (!selected) return;
    setSendingSummary(true);
    try {
      await userAPI.post(`/${selected._id}/send-activity-summary`);
      toast.success("Đã gửi email tóm tắt hoạt động");
    } catch (err) {
      console.debug(err);
      const msg = getErrMsg(err, "Gửi email tóm tắt thất bại");
      toast.error(msg);
    } finally {
      setSendingSummary(false);
    }
  };

  const formatDate = (raw?: string) => {
    if (!raw) return "-";
    const d = new Date(raw);
    return isNaN(d.getTime()) ? "-" : d.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">
          Quản lý người dùng và hoạt động của họ
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Users List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Danh sách Users</CardTitle>
            <CardDescription>Tổng: {users.length} người dùng</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thông tin</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow
                      key={u._id}
                      className={
                        selected?._id === u._id ? "bg-muted" : "cursor-pointer"
                      }
                      onClick={() => openUser(u)}
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{u.name}</span>
                          <span className="text-muted-foreground text-xs">
                            {u.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={u.role === "admin" ? "default" : "secondary"}
                        >
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            openUser(u);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* User Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selected ? (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl">{selected.name}</div>
                    <div className="text-muted-foreground text-sm font-normal">
                      {selected.email}
                    </div>
                  </div>
                  <Badge
                    variant={
                      selected.role === "admin" ? "default" : "secondary"
                    }
                    className="text-sm"
                  >
                    {selected.role}
                  </Badge>
                </div>
              ) : (
                "Chi tiết người dùng"
              )}
            </CardTitle>
            <CardDescription>
              {selected
                ? "Xem hoạt động và gửi email cho người dùng"
                : "Chọn một người dùng để xem chi tiết"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selected ? (
              <Tabs
                value={tab}
                onValueChange={(v) => setTab(v as "activity" | "mail")}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="activity">📊 Hoạt động</TabsTrigger>
                  <TabsTrigger value="mail">✉️ Gửi Email</TabsTrigger>
                </TabsList>

                <TabsContent value="activity" className="space-y-4">
                  {/* Recent Views */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        👁️ Lịch sử xem gần đây
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {activity?.viewHistory &&
                      activity.viewHistory.length > 0 ? (
                        <div className="space-y-2">
                          {activity.viewHistory.slice(0, 5).map((v, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between rounded-lg border p-3"
                            >
                              <div className="flex-1">
                                <div className="font-medium">
                                  {v.product?.name || "Unknown"}
                                </div>
                                <div className="text-muted-foreground text-sm">
                                  {v.product?.price?.toLocaleString()}₫
                                </div>
                              </div>
                              <div className="text-muted-foreground text-xs">
                                {formatDate(v.viewedAt)}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          Chưa có lịch sử xem
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Redirects */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        🔗 Lịch sử chuyển hướng
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {activity?.redirectHistory &&
                      activity.redirectHistory.length > 0 ? (
                        <div className="space-y-2">
                          {activity.redirectHistory.slice(0, 5).map((r, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between rounded-lg border p-3"
                            >
                              <div className="flex-1">
                                <div className="font-medium">
                                  {r.product?.name || "Unknown"}
                                </div>
                                <div className="text-muted-foreground text-sm">
                                  Nguồn:{" "}
                                  <Badge variant="outline">{r.source}</Badge>
                                </div>
                              </div>
                              <div className="text-muted-foreground text-xs">
                                {formatDate(r.redirectedAt)}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          Chưa có lịch sử chuyển hướng
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Search History */}
                  {activity?.searchHistory &&
                    activity.searchHistory.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">
                            🔍 Lịch sử tìm kiếm
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {activity.searchHistory.slice(0, 10).map((s, i) => (
                              <Badge key={i} variant="secondary">
                                {s.keyword}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                  <div className="pt-4">
                    <Button
                      onClick={sendActivityEmail}
                      disabled={sendingSummary}
                      className="w-full"
                    >
                      {sendingSummary
                        ? "Đang gửi..."
                        : "📧 Gửi Email Tóm Tắt Hoạt Động"}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="mail" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Tiêu đề
                      </label>
                      <Input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Nhập tiêu đề email..."
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Nội dung
                      </label>
                      <Textarea
                        rows={10}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Nhập nội dung email..."
                        className="resize-none"
                      />
                    </div>
                    <Button
                      onClick={sendCustomEmail}
                      disabled={sendingCustom || !subject || !text}
                      className="w-full"
                    >
                      {sendingCustom ? "Đang gửi..." : "📨 Gửi Email"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-muted-foreground flex h-[400px] items-center justify-center">
                👈 Chọn một user để xem chi tiết
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
