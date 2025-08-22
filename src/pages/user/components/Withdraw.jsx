import React, { useState } from "react";
import { ArrowLeft, CreditCard, DollarSign, Info } from "lucide-react";
import { toast } from "react-toastify";
import { userAPI } from "@/services/userApi";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/constants";
import { getUserStorage } from "@/utils/auth";

const moneys = [
  { value: "100000", label: "100K" },
  { value: "500000", label: "500K" },
  { value: "1000000", label: "1M" },
  { value: "2000000", label: "2M" },
];
export default function Withdraw() {
  const navigate = useNavigate();
  const user = getUserStorage();
  const [amount, setAmount] = useState("");
  const [balance] = useState(user?.balance || 0);

  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    setAmount(Number(value));
  };

  const handleConfirm = async () => {
    // xử lý nếu amount lớn hơn balance
    if (amount > balance) {
      toast.error("Số tiền rút không được lớn hơn số dư khả dụng.");
      return;
    }
    // xử lý logic rút tiền ở đây
    try {
      await userAPI.transactionWithdraw({
        amount: Number(amount),
        note: "Rút tiền từ tài khoản",
      });
      toast.success("Rút tiền thành công!");
      navigate(ROUTES.TRANSACTION_DETAILS);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-500 to-red-600">
      {/* Header */}
      <div className="text-white px-6 py-6">
        <div className="flex items-center justify-between mb-4 text-white">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Rút tiền</h1>
          <div className="w-10"></div>
        </div>

        {/* Inline Balance Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <DollarSign className="text-white" size={24} />
            </div>
            <div>
              <p className="text-white text-opacity-80 text-sm">
                Số dư khả dụng
              </p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(balance) || "0"} đ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl min-h-screen px-6 py-8 shadow-2xl">
        {/* Bank Transfer Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-red-100 p-3 rounded-2xl">
            <CreditCard className="text-red-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-600">
              CHUYỂN KHOẢN NGÂN HÀNG
            </h2>
            <p className="text-gray-500 text-sm">
              Vui lòng chọn chuyển sang thẻ ngân hàng
            </p>
          </div>
        </div>

        {/* Amount Input Section */}
        <div className="mb-8">
          <label className="block text-gray-800 font-semibold text-lg mb-4">
            Số tiền rút
          </label>
          <div className="relative mb-4">
            <input
              type="text"
              value={formatCurrency(amount)}
              onChange={handleAmountChange}
              placeholder="0"
              className="w-full !px-3 !py-3 border-3 border-gray-200 rounded-2xl focus:border-green-500 focus:outline-none transition-all duration-200 text-3xl font-bold text-center bg-gray-50"
            />
            <span className="absolute right-6 top-4 text-gray-400 font-bold text-2xl">
              đ
            </span>
          </div>

          {/* Quick Amount Buttons - Inline */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {moneys.map((quickAmount) => (
              <button
                key={quickAmount.value}
                onClick={() => setAmount(quickAmount.value)}
                className="py-3 px-4 bg-gray-100 hover:bg-red-100 hover:text-red-700 hover:border-red-300 border-2 border-transparent rounded-xl transition-all duration-200 text-center font-semibold text-gray-700"
              >
                {quickAmount.label}
              </button>
            ))}
          </div>

          {/* Limit Info - Inline */}
          <div className="flex items-center space-x-2 text-gray-500 text-sm bg-blue-50 p-4 rounded-xl">
            <Info size={16} className="text-blue-500 flex-shrink-0" />
            <span>
              <span className="font-medium text-blue-700">Giới hạn:</span>{" "}
              100,000đ - 100,000,000,000,000đ
            </span>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="space-y-4">
          <button
            onClick={handleConfirm}
            disabled={!amount}
            className={`w-full py-4 rounded-2xl font-bold text-xl transition-all duration-300 transform ${
              amount
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 shadow-xl hover:shadow-2xl"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            XÁC NHẬN RÚT TIỀN
          </button>

          {amount > 0 && (
            <div className="text-center text-gray-600 animate-fade-in">
              <p className="text-sm">
                Bạn sẽ rút{" "}
                <span className="font-bold text-green-600">
                  {formatCurrency(amount)}đ
                </span>{" "}
                về tài khoản ngân hàng
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
