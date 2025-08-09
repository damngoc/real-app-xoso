import React, { useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  User,
  Shield,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "@/services/authApi";
import { toast } from "react-toastify";
import { logoutUser } from "@/utils/Auth";
import { getUserStorage } from "@/utils/Auth";

export default function MyAccount() {
  const navigate = useNavigate();
  const user = getUserStorage();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    setShowLogoutDialog(false);
    // Logic đăng xuất
    await authAPI.logoutUser();
    toast.success("Đã đăng xuất!");
    logoutUser();
  };

  const menuItems = [
    {
      icon: Shield,
      title: "Quản lý mật khẩu",
      subtitle: "Thay đổi mật khẩu bảo mật",
      redirect: "/change-password",
      hasArrow: true,
    },
    {
      icon: Settings,
      title: "Tư liệu hoàn chỉnh",
      subtitle: "Cập nhật thông tin cá nhân",
      redirect: "/my-account",
      hasArrow: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white">
        <div className="flex items-center justify-between p-4 text-white">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold tracking-wide">
            Tài khoản của tôi
          </h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* User Info Section */}
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
                <User className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Tài khoản
                </h2>
                <p className="text-gray-500 text-sm">{user?.username}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                Thành viên
              </span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-6 py-4">
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <button
                onClick={() => navigate(item.redirect)}
                key={index}
                className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-red-100 transition-colors">
                    <item.icon
                      className="text-gray-600 group-hover:text-red-600 transition-colors"
                      size={20}
                    />
                  </div>
                  <div className="text-left">
                    <h3 className="text-gray-900 font-medium">{item.title}</h3>
                    <p className="text-gray-500 text-sm">{item.subtitle}</p>
                  </div>
                </div>
                {item.hasArrow && (
                  <ChevronRight
                    className="text-gray-400 group-hover:text-red-500 transition-colors"
                    size={20}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="px-6 py-6">
          <button
            onClick={() => setShowLogoutDialog(true)}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-red-600 hover:to-red-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            ĐĂNG XUẤT KHỎI TÀI KHOẢN
          </button>
        </div>

        {/* Additional Info Cards */}
        <div className="px-6 pb-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <Shield className="text-white" size={16} />
                </div>
                <p className="text-blue-800 font-medium text-sm">Bảo mật</p>
                <p className="text-blue-600 text-xs">Cao</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <User className="text-white" size={16} />
                </div>
                <p className="text-purple-800 font-medium text-sm">
                  Trạng thái
                </p>
                <p className="text-purple-600 text-xs">Hoạt động</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <LogOut className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Xác nhận đăng xuất
              </h3>
              <p className="text-gray-600">
                Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
