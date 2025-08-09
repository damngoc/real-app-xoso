import React, { useState } from "react";
import {
  User,
  CreditCard,
  FileText,
  Calendar,
  Ticket,
  UserCheck,
  Lock,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";
import { Footer } from "@/components/common/Footer";
import { formatCurrency } from "@/utils/helper";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { authAPI } from "@/services/authApi";
import { getUserStorage } from "@/utils/Auth";
import { logoutUser } from "@/utils/Auth";

export default function Profile() {
  const navigate = useNavigate();
  const user = getUserStorage();
  const [showBalance, setShowBalance] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const balance = user?.balance || 0;
  const handleLogout = async () => {
    try {
      await authAPI.logoutUser();
      setShowLogoutConfirm(false);
      toast.success("Đã đăng xuất thành công!");
      logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Đã xảy ra lỗi khi đăng xuất!");
    }
  };

  const FeatureCard = ({
    icon: Icon,
    title,
    subtitle,
    color = "blue",
    onClick,
  }) => (
    <div
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div
        className={`w-12 h-12 rounded-xl bg-${color}-100 flex items-center justify-center mb-3`}
      >
        {Icon && <Icon className={`text-${color}-500`} size={24} />}
      </div>
      <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>
  );

  const renderContent = () => {
    return (
      <div className="space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-white font-bold">
                  {user?.username || "Unknown"}
                </h2>
                <p className="text-red-100">Thành viên</p>
              </div>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
            >
              {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="text-center">
            <p className="text-red-100 mb-2">Tài khoản chính</p>
            <h1 className="text-3xl font-bold mb-4">
              {showBalance ? formatCurrency(balance) : "••••••••"}
            </h1>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => navigate("/deposit")}
                className="bg-white bg-opacity-20 px-6 py-2 rounded-full font-medium hover:bg-opacity-30 transition-colors"
              >
                Nạp tiền
              </button>
              <button
                onClick={() => navigate("/withdraw")}
                className="bg-white bg-opacity-20 px-6 py-2 rounded-full font-medium hover:bg-opacity-30 transition-colors"
              >
                Rút tiền
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Quản Lý Tài Chính
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <FeatureCard
              icon={CreditCard}
              title="Liên kết ngân hàng"
              subtitle="Kết nối tài khoản"
              color="blue"
              onClick={() => navigate("/bank")}
            />
            <FeatureCard
              icon={FileText}
              title="Chi tiết giao dịch"
              subtitle="Lịch sử chi tiêu"
              color="green"
              onClick={() => navigate("/transaction-details")}
            />
          </div>
        </div>

        {/* Game Features */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Quản Lý Trò Chơi
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <FeatureCard
              icon={Calendar}
              title="Lịch Sử Đặt Cược"
              subtitle="Theo dõi hoạt động"
              color="purple"
              onClick={() => navigate("/orders-history")}
            />
            {/* <FeatureCard
              icon={Ticket}
              title="Lịch Sử Xổ số"
              subtitle="Kết quả xổ số"
              onClick={() => navigate("/lottery-history")}
              color="purple"
            /> */}
          </div>
        </div>

        {/* Account Management */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Quản Lý Tài Khoản
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <FeatureCard
              icon={UserCheck}
              title="Tài Khoản Của Tôi"
              subtitle="Thông tin cá nhân"
              color="cyan"
              onClick={() => navigate("/my-account")}
            />
            <FeatureCard
              icon={Lock}
              title="Quản Lý Mật Khẩu"
              subtitle="Bảo mật tài khoản"
              color="green"
              onClick={() => navigate("/change-password")}
            />
          </div>
        </div>
        {/* Logout Button */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-colors"
          >
            <LogOut size={20} />
            <span>Đăng xuất tài khoản</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
        <h1 className="text-white text-xl font-bold text-center">
          Trung Tâm Người Dùng
        </h1>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-24">{renderContent()}</div>
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="text-red-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Xác nhận đăng xuất
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Bottom Navigation */}
      <Footer tab="profile" />
    </div>
  );
}
