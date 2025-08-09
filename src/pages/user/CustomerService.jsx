import React, { useState } from "react";
import { ArrowLeft, MessageCircle, Clock, User } from "lucide-react";
import { Footer } from "@/components/common/Footer";

const CustomerService = () => {
  const [accountName, setAccountName] = useState("");

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="bg-red-500 p-4 flex items-center space-x-4">
        <ArrowLeft
          className="text-white w-6 h-6 cursor-pointer mr-[70px]"
          onClick={() => window.history.back()}
        />
        <h1 className="text-white font-semibold text-lg">Hỗ trợ trực tuyến</h1>
      </div>

      {/* Main Content */}
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Info Message */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center relative">
                <MessageCircle className="w-6 h-6 text-white" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                  <Clock className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-gray-700 text-sm leading-relaxed">
                Hiện tại các nhân viên của chúng tôi đều đang bận, nhưng bạn vẫn
                có thể gửi tin nhắn. Chúng tôi sẽ thông báo về địa chỉ email của
                bạn khi bạn nhận được hồi đáp.
              </p>
            </div>
          </div>
        </div>

        {/* Chat Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-start space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-gray-700 text-sm leading-relaxed">
                Xin chào mừng bạn đến với Đại Phát! Vui lòng điền tên tài khoản
                Đại Phát của bạn vào dưới đây.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên Tài Khoản: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder=""
              />
            </div>

            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Bắt đầu chat
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <Footer />
    </div>
  );
};

export default CustomerService;
