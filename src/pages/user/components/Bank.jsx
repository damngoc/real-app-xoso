import React, { useEffect, useState } from "react";
import { ArrowLeft, Plus, CreditCard, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "@/services/userApi";

export default function Bank() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  // get profile
  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      return setUser(response?.data?.result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);
  const isCheckHadBank =
    user?.bankName && user?.accountNumber && user?.accountHolderName;
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
        <div className="px-4 py-4 flex items-center justify-between">
          <button className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200">
            <ArrowLeft
              onClick={() => window.history.back()}
              className="text-white w-6 h-6"
            />
          </button>
          <h1 className="text-white text-xl font-semibold tracking-wide">
            Thông tin ngân hàng
          </h1>
          <button
            disabled={isCheckHadBank}
            onClick={() => navigate("/add-bank")}
            className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
          >
            <Plus className="text-white w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-8">
        {/* thêm code hiển thị nếu có thẻ ngân hàng */}
        {isCheckHadBank ? (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-200 to-red-300 rounded-2xl flex items-center justify-center shadow-inner">
                  <div className="relative">
                    <CreditCard className="w-10 h-10 text-red-400" />
                    <Sparkles className="w-4 h-4 text-gray-300 absolute -top-1 -right-1" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>

              <h3 className="text-gray-400 text-lg font-medium mb-4">
                Thanh toán ngân hàng
              </h3>

              <div className="flex flex-col items-center justify-center gap-2 mb-8">
                <div className="text-gray-500 text-sm leading-relaxed">
                  <span className="font-medium text-gray-700">
                    Tên ngân hàng:
                  </span>{" "}
                  {user?.bankName}
                </div>
                <div className="text-gray-500 text-sm leading-relaxed">
                  <span className="font-medium text-gray-700">
                    Số tài khoản:
                  </span>{" "}
                  {user?.accountNumber}
                </div>
                <div className="text-gray-500 text-sm leading-relaxed">
                  <span className="font-medium text-gray-700">
                    Tên tài khoản:
                  </span>{" "}
                  {user?.accountHolderName}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            {/* Empty State */}
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center shadow-inner">
                  <div className="relative">
                    <CreditCard className="w-10 h-10 text-gray-400" />
                    <Sparkles className="w-4 h-4 text-gray-300 absolute -top-1 -right-1" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>

              <h3 className="text-gray-400 text-lg font-medium mb-4">
                Không có thông báo
              </h3>

              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Hiện tại chưa có thẻ ngân hàng nào được liên kết.
                <br />
                Thêm thẻ để bắt đầu quản lý chi tiêu của bạn.
              </p>

              <button
                onClick={() => navigate("/add-bank")}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Thêm Thẻ Ngân Hàng</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Hint */}
      <div className="px-4 pb-8">
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="text-blue-900 font-medium text-sm mb-1">
                  Mẹo sử dụng
                </h4>
                <p className="text-blue-700 text-xs leading-relaxed">
                  Liên kết thẻ ngân hàng để theo dõi chi tiêu tự động và nhận
                  thông báo khi có giao dịch mới.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
