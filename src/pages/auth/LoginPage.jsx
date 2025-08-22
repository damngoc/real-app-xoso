import { Lock } from "@mui/icons-material";
import { User } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ROUTES } from "@/config/constants";
import { authAPI } from "@/services/authApi";
import { setAuthToken } from "@/utils/auth";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!username.trim()) {
      newErrors.username = "Username là bắt buộc";
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      const res = await authAPI.loginAdmin({ username, password });
      if (res?.status === 200) {
        localStorage.setItem("currentRole", "admin");
        setAuthToken(res?.data?.result?.accessToken);
        toast.success("Đăng nhập thành công!");
        navigate(ROUTES.USER_MANAGEMENT);
      } else {
        toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
      }

      // Reset form after successful login
      setUsername("");
      setPassword("");
      setErrors({});
    } catch (error) {
      console.log(error);
      setErrors({ general: "Đăng nhập thất bại. Vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error when user starts typing
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (errors.username) {
      setErrors({ ...errors, username: "" });
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors({ ...errors, password: "" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Đăng nhập</h1>
          <span className="text-sm text-red-600">
            Website này sử dụng để test và học hỏi kĩ thuật dev. Không sử dụng
            cho mục đích khác{" "}
          </span>
        </div>

        <div className="space-y-6">
          {/* General error message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200 text-gray-700 ${
                  errors.username
                    ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }`}
                placeholder="Nhập username của bạn"
              />
            </div>
            {errors.username && (
              <p className="mt-2 text-sm text-red-600">{errors.username}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mật khẩu *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200 text-gray-700 ${
                  errors.password
                    ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }`}
                placeholder="Nhập mật khẩu của bạn"
              />
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg transform ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Đang đăng nhập...
              </div>
            ) : (
              "ĐĂNG NHẬP"
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Quên mật khẩu?
            <a
              href="#"
              className="text-blue-500 hover:text-blue-600 font-medium ml-1 hover:underline"
            >
              Khôi phục tại đây
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
