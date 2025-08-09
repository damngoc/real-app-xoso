import React, { useState, useEffect } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { userAPI } from "@/services/userApi";
import { formatDate } from "@/utils/moment";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/constants";

const TransactionDetails = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("NẠP TIỀN");
  const [isVisible, setIsVisible] = useState(false);
  const [sparkleAnimation, setSparkleAnimation] = useState(false);

  // fetching transaction details
  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const response = await userAPI.getTransactionHistory();
        setTransactions(response?.data?.result?.transactions || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactionDetails();
  }, []);

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setSparkleAnimation((prev) => !prev);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const tabs = ["NẠP TIỀN", "RÚT TIỀN"];

  const handleCreateTransaction = (type) => {
    // Navigate to the transaction creation page or open a modal
    if (type === "deposit") {
      navigate(ROUTES.DEPOSIT);
    } else if (type === "withdraw") {
      navigate(ROUTES.WITHDRAW);
    }
  };

  const getTransactionsForType = (type) => {
    return transactions.filter((transaction) => transaction.type === type);
  };

  const TransactionList = ({ transactions }) => {
    if (transactions.length === 0) {
      return (
        <div
          className={`flex-1 flex items-center justify-center p-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center space-y-6 max-w-sm">
            {/* Empty State Icon */}
            <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl transform rotate-3 shadow-lg"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-200 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="relative">
                  <Sparkles
                    size={48}
                    className={`text-gray-400 mx-auto transition-all duration-1000 ${
                      sparkleAnimation ? "scale-110 text-red-400" : "scale-100"
                    }`}
                  />
                  {/* Floating particles */}
                  <div
                    className={`absolute -top-2 -right-2 w-2 h-2 bg-red-400 rounded-full transition-all duration-1000 ${
                      sparkleAnimation
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-0"
                    }`}
                  ></div>
                  <div
                    className={`absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-blue-400 rounded-full transition-all duration-1000 delay-300 ${
                      sparkleAnimation
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-0"
                    }`}
                  ></div>
                  <div
                    className={`absolute top-1 left-8 w-1 h-1 bg-yellow-400 rounded-full transition-all duration-1000 delay-500 ${
                      sparkleAnimation
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-0"
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            {/* Empty State Text */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-600 tracking-wide">
                Không có thông báo
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                Hiện tại chưa có giao dịch nào trong mục này. Các giao dịch sẽ
                được hiển thị tại đây khi có.
              </p>
            </div>

            {/* Action Button */}
            <button className="mt-8 px-8 py-3 bg-gradient-to-r from-red-400 to-red-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-red-500 hover:to-red-600">
              <span className="flex items-center justify-center space-x-2">
                <Sparkles size={16} />
                <span>Tạo giao dịch mới</span>
              </span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className={`p-4 rounded-2xl shadow-lg border transition-all duration-200
            ${
              transaction.status === "approved"
                ? "bg-gradient-to-r from-green-50 to-green-100 border-green-200"
                : transaction.status === "pending"
                ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200"
                : "bg-gradient-to-r from-red-50 to-red-100 border-red-200"
            }
          `}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`font-semibold text-base ${
                  transaction.status === "approved"
                    ? "text-green-600"
                    : transaction.status === "pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {transaction.status === "pending"
                  ? "Đang xử lý"
                  : transaction.status === "approved"
                  ? "Thành công"
                  : "Thất bại"}
              </span>
              <span className="text-xs text-gray-400 font-mono">
                {formatDate(transaction.createdAt, "DD/MM/YYYY HH:mm")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-400">
                  Nội dung:{" "}
                  <span className="font-mono">{transaction.note || "--"}</span>
                </div>
              </div>
              <div
                className={`text-lg font-bold ${
                  transaction.type === "deposit"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.type === "deposit" ? "+" : "-"}
                {Number(transaction.amount).toLocaleString()}đ
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
        <div className="flex items-center justify-between p-4 text-white">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold tracking-wide">
            Chi tiết giao dịch
          </h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 px-4 text-sm font-medium transition-all duration-300 relative ${
                activeTab === tab
                  ? "text-red-500 border-b-2 border-red-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="relative z-10">{tab}</span>
              {activeTab === tab && (
                <div className="absolute inset-0 bg-red-50 opacity-50 transform scale-x-0 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {/* hiển thị dữ liệu giao dịch theo type tương ứng với các tab */}
      {transactions.length > 0 ? (
        <div className="content-area px-2 py-6">
          {activeTab === "NẠP TIỀN" && (
            <TransactionList transactions={getTransactionsForType("deposit")} />
          )}
          {activeTab === "RÚT TIỀN" && (
            <TransactionList
              transactions={getTransactionsForType("withdraw")}
            />
          )}
        </div>
      ) : (
        <div
          className={`flex-1 flex items-center justify-center p-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center space-y-6 max-w-sm">
            {/* Empty State Icon */}
            <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl transform rotate-3 shadow-lg"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-200 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="relative">
                  <Sparkles
                    size={48}
                    className={`text-gray-400 mx-auto transition-all duration-1000 ${
                      sparkleAnimation ? "scale-110 text-red-400" : "scale-100"
                    }`}
                  />
                  {/* Floating particles */}
                  <div
                    className={`absolute -top-2 -right-2 w-2 h-2 bg-red-400 rounded-full transition-all duration-1000 ${
                      sparkleAnimation
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-0"
                    }`}
                  ></div>
                  <div
                    className={`absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-blue-400 rounded-full transition-all duration-1000 delay-300 ${
                      sparkleAnimation
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-0"
                    }`}
                  ></div>
                  <div
                    className={`absolute top-1 left-8 w-1 h-1 bg-yellow-400 rounded-full transition-all duration-1000 delay-500 ${
                      sparkleAnimation
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-0"
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            {/* Empty State Text */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-600 tracking-wide">
                Không có thông báo
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                Hiện tại chưa có giao dịch nào trong mục này. Các giao dịch sẽ
                được hiển thị tại đây khi có.
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={() =>
                activeTab === "NẠP TIỀN"
                  ? handleCreateTransaction("deposit")
                  : handleCreateTransaction("withdraw")
              }
              className="mt-8 px-8 py-3 bg-gradient-to-r from-red-400 to-red-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-red-500 hover:to-red-600"
            >
              <span className="flex items-center justify-center space-x-2">
                <Sparkles size={16} />
                <span>Tạo giao dịch mới</span>
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-20 left-10 w-2 h-2 bg-red-300 rounded-full opacity-30 animate-bounce"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-40 right-20 w-1 h-1 bg-blue-300 rounded-full opacity-40 animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-30 animate-bounce"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-1 h-1 bg-pink-300 rounded-full opacity-40 animate-bounce"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>
    </div>
  );
};

export default TransactionDetails;
