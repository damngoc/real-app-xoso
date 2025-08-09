import React, { useState } from "react";
import { Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/constants";
import { userAPI } from "@/services/userApi";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Vui lòng nhập địa chỉ email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Địa chỉ email không hợp lệ");
      return;
    }

    setIsLoading(true);

    // Giả lập API call
    try {
      const res = await userAPI.forgotPassword({ email });
      if (res?.status === 200) {
        console.log(res);
        setTimeout(() => {
          setIsLoading(false);
          setIsSuccess(true);
        }, 2000);
      } else {
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBackToLogin = () => {
    navigate(ROUTES.LOGIN);
    setEmail("");
    setError("");
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 transform transition-all duration-500 hover:shadow-3xl">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Đã gửi email thành công!
              </h2>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email:
                <span className="block font-semibold text-blue-600 mt-1">
                  {email}
                </span>
              </p>

              <p className="text-sm text-gray-500 mb-8">
                Vui lòng kiểm tra hộp thư và làm theo hướng dẫn. Nếu không thấy
                email, hãy kiểm tra thư mục spam.
              </p>

              <button
                onClick={handleBackToLogin}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 hover:from-purple-700 hover:to-blue-700 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-200"
              >
                <ArrowLeft className="w-5 h-5 inline mr-2" />
                Quay lại đăng nhập
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Floating elements decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-8 -right-8 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 transform transition-all duration-500 hover:shadow-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 transform rotate-12 hover:rotate-0 transition-transform duration-500">
              <Mail className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Quên mật khẩu?
            </h1>

            <p className="text-gray-600 leading-relaxed">
              Đừng lo lắng! Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt
              lại mật khẩu.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Địa chỉ Email
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-700 placeholder-gray-400 bg-gray-50/50"
                  placeholder="Nhập địa chỉ email của bạn"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm mt-2 animate-pulse">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:from-purple-700 hover:to-blue-700 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Đang gửi...
                </div>
              ) : (
                "Gửi"
              )}
            </button>
          </div>

          {/* Back to login */}
          <div className="mt-8 text-center">
            <button
              onClick={handleBackToLogin}
              className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors duration-300 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
