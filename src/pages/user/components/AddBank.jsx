import React, { useState } from "react";
import {
  ArrowLeft,
  CreditCard,
  Building2,
  User,
  Hash,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { userAPI } from "@/services/userApi";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/constants";

export default function AddBank() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
  });
  const [focusedField, setFocusedField] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid =
    formData.bankName && formData.accountHolderName && formData.accountNumber;

  const banks = [
    "Vietcombank",
    "Techcombank",
    "BIDV",
    "VietinBank",
    "Agribank",
    "MBBank",
    "ACB",
    "VPBank",
    "Sacombank",
    "TPBank",
  ];

  const handleFormSubmit = async () => {
    // Xu ly tao thong tin ngan hang
    try {
      await userAPI.updateProfile(formData);
      toast.success("Thêm ngân hàng thành công!");
      // lấy thông tin ngân hàng sau khi thêm
      navigate(ROUTES.BANK);
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi thêm ngân hàng!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative px-4 py-4 flex items-center">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200 mr-4"
          >
            <ArrowLeft className="text-white w-6 h-6" />
          </button>
          <h1 className="text-white text-xl font-semibold tracking-wide flex-1 text-center mr-12">
            Thêm thẻ ngân hàng
          </h1>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white bg-opacity-5 rounded-full translate-y-10 -translate-x-10"></div>
      </div>

      {/* Instruction */}
      <div className="px-4 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-gray-700 font-medium">
              Vui lòng nhập thông tin thẻ ngân hàng
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Thông tin của bạn sẽ được bảo mật tuyệt đối
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Bank Name Field */}
          <div className="space-y-2">
            <label className="flex items-center text-gray-700 font-medium text-sm">
              <Building2 className="w-4 h-4 mr-2 text-red-600" />
              Ngân hàng *
            </label>
            <div className="relative">
              <select
                value={formData.bankName}
                onChange={(e) => handleInputChange("bankName", e.target.value)}
                onFocus={() => setFocusedField("bankName")}
                onBlur={() => setFocusedField(null)}
                className={`w-full !px-4 py-4 bg-white border-2 rounded-xl transition-all duration-200 text-gray-700 ${
                  focusedField === "bankName"
                    ? "border-red-500 shadow-lg ring-4 ring-red-100"
                    : "border-gray-200 hover:border-gray-300"
                } ${formData.bankName ? "bg-red-50" : ""}`}
              >
                <option value="">Chọn ngân hàng của bạn</option>
                {banks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
              {formData.bankName && (
                <CheckCircle className="absolute right-3 top-4 w-5 h-5 text-red-500" />
              )}
            </div>
          </div>

          {/* Account Holder Field */}
          <div className="space-y-2">
            <label className="flex items-center text-gray-700 font-medium text-sm">
              <User className="w-4 h-4 mr-2 text-red-600" />
              Họ tên chủ tài khoản *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.accountHolderName}
                onChange={(e) =>
                  handleInputChange("accountHolderName", e.target.value)
                }
                onFocus={() => setFocusedField("accountHolderName")}
                onBlur={() => setFocusedField(null)}
                placeholder="Nhập họ tên đầy đủ"
                className={`w-full !px-4 py-4 bg-white border-2 rounded-xl transition-all duration-200 text-gray-700 placeholder-gray-400 ${
                  focusedField === "accountHolderName"
                    ? "border-red-500 shadow-lg ring-4 ring-red-100"
                    : "border-gray-200 hover:border-gray-300"
                } ${formData.accountHolderName ? "bg-red-50" : ""}`}
              />
              {formData.accountHolderName && (
                <CheckCircle className="absolute right-3 top-4 w-5 h-5 text-red-500" />
              )}
            </div>
            <p className="text-xs text-gray-500 ml-1">
              Tên phải khớp với tên trên thẻ ngân hàng
            </p>
          </div>

          {/* Account Number Field */}
          <div className="space-y-2">
            <label className="flex items-center text-gray-700 font-medium text-sm">
              <Hash className="w-4 h-4 mr-2 text-red-600" />
              Số tài khoản ngân hàng *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) =>
                  handleInputChange("accountNumber", e.target.value)
                }
                onFocus={() => setFocusedField("accountNumber")}
                onBlur={() => setFocusedField(null)}
                placeholder="Nhập số tài khoản"
                className={`w-full !px-4 py-4 pr-12 bg-white border-2 rounded-xl transition-all duration-200 text-gray-700 placeholder-gray-400 ${
                  focusedField === "accountNumber"
                    ? "border-green-500 shadow-lg ring-4 ring-green-100"
                    : "border-gray-200 hover:border-gray-300"
                } ${formData.accountNumber ? "bg-green-50" : ""}`}
              />
            </div>
            <p className="text-xs text-gray-500 ml-1">
              Số tài khoản từ 8-20 chữ số
            </p>
          </div>

          {/* Security Notice */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h4 className="text-amber-800 font-medium text-sm mb-1">
                  Bảo mật thông tin
                </h4>
                <p className="text-amber-700 text-xs leading-relaxed">
                  Thông tin thẻ của bạn được mã hóa và bảo vệ bằng công nghệ SSL
                  256-bit. Chúng tôi không lưu trữ thông tin nhạy cảm trên hệ
                  thống.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={!isFormValid}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform ${
              isFormValid
                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:transform-none"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            onClick={handleFormSubmit}
          >
            {isFormValid ? (
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>XÁC NHẬN</span>
              </div>
            ) : (
              <span>XÁC NHẬN</span>
            )}
          </button>

          {/* Form Progress */}
          <div className="flex justify-center space-x-2 mt-6">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  (step === 1 && formData.bankName) ||
                  (step === 2 && formData.accountHolder) ||
                  (step === 3 && formData.accountNumber)
                    ? "bg-red-500 w-8"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
