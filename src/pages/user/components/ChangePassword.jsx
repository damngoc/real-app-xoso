import React, { useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "@/services/userApi";
import { ROUTES } from "@/config/constants";
import { toast } from "react-toastify";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const passwordRequirements = [
    {
      text: "Ít nhất 8 ký tự",
      met: formData.newPassword.length >= 8,
    },
    { text: "Có chữ hoa", met: /[A-Z]/.test(formData.newPassword) },
    {
      text: "Có chữ thường",
      met: /[a-z]/.test(formData.newPassword),
    },
    { text: "Có số", met: /\d/.test(formData.newPassword) },
    {
      text: "Có ký tự đặc biệt",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword),
    },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "newPassword") {
      setPasswordStrength(checkPasswordStrength(value));
    }

    // Clear errors when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log(formData);
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate API call
    try {
      // Here you would typically make an API call to update the password
      const response = await userAPI.changePassword(formData);
      // Reset form after successful update
      if (response.status === 200) {
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        toast.success("Mật khẩu đã đổi thành công!");
        setIsSubmitting(false);
        navigate(ROUTES.PROFILE);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Đã xảy ra lỗi khi đổi mật khẩu!");
      setIsSubmitting(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-400";
    if (passwordStrength <= 3) return "bg-yellow-400";
    if (passwordStrength <= 4) return "bg-blue-400";
    return "bg-green-400";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 2) return "Yếu";
    if (passwordStrength <= 3) return "Trung bình";
    if (passwordStrength <= 4) return "Mạnh";
    return "Rất mạnh";
  };

  const inputFields = [
    {
      key: "currentPassword",
      label: "Mật khẩu cũ",
      placeholder: "Nhập mật khẩu hiện tại",
    },
    {
      key: "newPassword",
      label: "Mật khẩu mới",
      placeholder: "Nhập mật khẩu mới",
    },
    {
      key: "confirmPassword",
      label: "Xác nhận mật khẩu",
      placeholder: "Nhập lại mật khẩu mới",
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
          <h1 className="text-lg font-semibold tracking-wide">Đổi mật khẩu</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="px-6 py-8">
          {/* Security Tips */}
          <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lock className="text-red-600" size={16} />
              </div>
              <div>
                <h3 className="font-medium text-red-900 mb-1">Mẹo bảo mật</h3>
                <p className="text-red-700 text-sm leading-relaxed">
                  Sử dụng mật khẩu mạnh với ít nhất 8 ký tự, bao gồm chữ hoa,
                  chữ thường, số và ký tự đặc biệt.
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {inputFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    type={
                      showPasswords[field.key.replace("Password", "")]
                        ? "text"
                        : "password"
                    }
                    value={formData[field.key]}
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
                    placeholder={field.placeholder}
                    className={`w-full !px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                      errors[field.key]
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 bg-gray-50 focus:bg-white"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      togglePasswordVisibility(
                        field.key.replace("Password", "")
                      )
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPasswords[field.key.replace("Password", "")] ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {field.key === "newPassword" && formData.newPassword && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Độ mạnh mật khẩu:
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          passwordStrength <= 2
                            ? "text-red-600"
                            : passwordStrength <= 3
                            ? "text-yellow-600"
                            : passwordStrength <= 4
                            ? "text-blue-600"
                            : "text-green-600"
                        }`}
                      >
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {errors[field.key] && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertCircle size={16} />
                    <span className="text-sm">{errors[field.key]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Password Requirements */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-3">
              Yêu cầu mật khẩu:
            </h4>
            <div className="space-y-2">
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {req.met ? (
                    <Check className="text-red-500" size={16} />
                  ) : (
                    <X className="text-gray-400" size={16} />
                  )}
                  <span
                    className={`text-sm ${
                      req.met ? "text-red-700" : "text-gray-500"
                    }`}
                  >
                    {req.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full mt-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
              isSubmitting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                <span>Đang xử lý...</span>
              </div>
            ) : (
              "XÁC NHẬN"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
