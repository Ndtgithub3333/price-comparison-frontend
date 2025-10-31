import { useState, useEffect } from "react";
import { useUserStore } from "@/lib/userStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { userAPI } from "@/services/api";

type Activity = {
  viewHistory?: Array<{
    product?: { name?: string; price?: number; imageUrl?: string };
    viewedAt?: string;
  }>;
  redirectHistory?: Array<{
    product?: { name?: string; price?: number; imageUrl?: string };
    source?: string;
    redirectedAt?: string;
  }>;
  searchHistory?: Array<{ keyword?: string; searchedAt?: string }>;
};

const Profile = () => {
  const user = useUserStore((state) => state.user);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const res = await userAPI.get(`/me/activity`);
        setActivity(res.data.activity);
      } catch (err) {
        console.debug(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [user]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "-" : date.toLocaleString("vi-VN");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin và xem lịch sử hoạt động của bạn
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Info Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Thông tin tài khoản</CardTitle>
            <CardDescription>Chi tiết tài khoản của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <>
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    Tên
                  </label>
                  <p className="mt-1 text-lg font-semibold">{user.name}</p>
                </div>
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    Email
                  </label>
                  <p className="mt-1">{user.email}</p>
                </div>
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    Vai trò
                  </label>
                  <div className="mt-1">
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                    >
                      {user.role}
                    </Badge>
                  </div>
                </div>
                <div className="pt-4">
                  <Button
                    variant={showChangePassword ? "outline" : "default"}
                    onClick={() => setShowChangePassword(!showChangePassword)}
                    className="w-full"
                  >
                    {showChangePassword ? "Ẩn form" : "🔐 Đổi mật khẩu"}
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">
                Vui lòng đăng nhập để xem thông tin
              </p>
            )}
          </CardContent>
        </Card>

        {/* Activity Section */}
        <div className="space-y-6 lg:col-span-2">
          {/* Change Password Form */}
          {showChangePassword && (
            <Card>
              <CardHeader>
                <CardTitle>Đổi mật khẩu</CardTitle>
                <CardDescription>
                  Thay đổi mật khẩu để bảo mật tài khoản của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChangePasswordForm
                  onSuccess={() => {
                    setShowChangePassword(false);
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Hoạt động gần đây</CardTitle>
              <CardDescription>
                Lịch sử xem và chuyển hướng sản phẩm
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Đang tải...</p>
              ) : activity ? (
                <div className="space-y-6">
                  {/* Recent Views */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-base font-semibold">
                      👁️ Lịch sử xem gần đây
                      <Badge variant="secondary">
                        {activity.viewHistory?.length || 0}
                      </Badge>
                    </h3>
                    {activity.viewHistory && activity.viewHistory.length > 0 ? (
                      <div className="space-y-2">
                        {activity.viewHistory.slice(0, 5).map((v, i) => (
                          <div
                            key={i}
                            className="hover:bg-muted/50 flex items-center gap-3 rounded-lg border p-3 transition-colors"
                          >
                            {v.product?.imageUrl && (
                              <img
                                src={v.product.imageUrl}
                                alt={v.product.name}
                                className="h-12 w-12 rounded object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <div className="font-medium">
                                {v.product?.name || "Unknown"}
                              </div>
                              {v.product?.price && (
                                <div className="text-muted-foreground text-sm">
                                  {v.product.price.toLocaleString()}₫
                                </div>
                              )}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              {formatDate(v.viewedAt)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        Chưa có lịch sử xem sản phẩm
                      </p>
                    )}
                  </div>

                  {/* Recent Redirects */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-base font-semibold">
                      🔗 Đã chuyển hướng
                      <Badge variant="secondary">
                        {activity.redirectHistory?.length || 0}
                      </Badge>
                    </h3>
                    {activity.redirectHistory &&
                    activity.redirectHistory.length > 0 ? (
                      <div className="space-y-2">
                        {activity.redirectHistory.slice(0, 5).map((r, i) => (
                          <div
                            key={i}
                            className="hover:bg-muted/50 flex items-center gap-3 rounded-lg border p-3 transition-colors"
                          >
                            {r.product?.imageUrl && (
                              <img
                                src={r.product.imageUrl}
                                alt={r.product.name}
                                className="h-12 w-12 rounded object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <div className="font-medium">
                                {r.product?.name || "Unknown"}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                {r.product?.price && (
                                  <span className="text-muted-foreground">
                                    {r.product.price.toLocaleString()}₫
                                  </span>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {r.source}
                                </Badge>
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
                  </div>

                  {/* Search History */}
                  {activity.searchHistory &&
                    activity.searchHistory.length > 0 && (
                      <div>
                        <h3 className="mb-3 flex items-center gap-2 text-base font-semibold">
                          🔍 Từ khóa tìm kiếm
                          <Badge variant="secondary">
                            {activity.searchHistory.length}
                          </Badge>
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {activity.searchHistory.slice(0, 15).map((s, i) => (
                            <Badge key={i} variant="secondary">
                              {s.keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <p className="text-muted-foreground">Không có dữ liệu</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
