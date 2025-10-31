import ChangePasswordForm from "@/components/ChangePasswordForm";

export default function AdminChangePasswordPage() {
  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Đổi mật khẩu</h2>
        <p className="mt-2 text-gray-600">
          Thay đổi mật khẩu để bảo mật tài khoản của bạn
        </p>
      </div>

      <ChangePasswordForm />
    </div>
  );
}
