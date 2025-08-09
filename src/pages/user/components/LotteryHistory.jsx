import React, { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, Sparkles, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LotteryHistory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("LỊCH SỬ CƯỢC");
  const [isVisible, setIsVisible] = useState(false);
  const [sparkleAnimation, setSparkleAnimation] = useState(false);
  const [displayedItems, setDisplayedItems] = useState(10); // Items per load
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // Generate more mock data for demonstration
  const generateMockData = (type, count) => {
    const data = [];
    for (let i = 1; i <= count; i++) {
      if (type === "LỊCH SỬ CƯỢC") {
        data.push({
          id: i,
          title: `Cuộc xổ số ${
            i % 3 === 0 ? "miền Bắc" : i % 2 === 0 ? "miền Nam" : "miền Trung"
          } #${i}`,
          date: new Date(2025, 6, 27 - (i % 30)).toLocaleDateString("vi-VN"),
          time: `${15 + (i % 6)}:${(i % 4) * 15}0`,
          status:
            i % 3 === 0
              ? "Đã hoàn thành"
              : i % 2 === 0
              ? "Đang chờ"
              : "Thất bại",
          amount: `${(i * 25000).toLocaleString()}`,
          type: i % 3 === 0 ? "success" : i % 2 === 0 ? "pending" : "failed",
        });
      } else {
        data.push({
          id: i,
          title: `Kết quả xổ số ${
            i % 3 === 0 ? "miền Bắc" : i % 2 === 0 ? "miền Nam" : "miền Trung"
          } #${i}`,
          date: new Date(2025, 6, 27 - (i % 30)).toLocaleDateString("vi-VN"),
          numbers: String(Math.floor(10000 + Math.random() * 90000)),
          prize:
            i % 4 === 0
              ? "Giải nhất"
              : i % 3 === 0
              ? "Giải nhì"
              : i % 2 === 0
              ? "Giải ba"
              : "Không trúng",
          amount:
            i % 2 === 0
              ? `+${(i * 100000).toLocaleString()}`
              : `-${(i * 25000).toLocaleString()}`,
          type: i % 2 === 0 ? "win" : "lose",
        });
      }
    }
    return data;
  };

  // Mock data with more items
  const [allData] = useState({
    "LỊCH SỬ CƯỢC": generateMockData("LỊCH SỬ CƯỢC", 50),
    "LỊCH SỬ KẾT QUẢ": generateMockData("LỊCH SỬ KẾT QUẢ", 50),
  });

  const currentAllData = allData[activeTab] || [];
  const currentData = currentAllData.slice(0, displayedItems);
  const hasData = currentData.length > 0;

  // Lazy loading function
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const newDisplayedItems = displayedItems + 10;
      setDisplayedItems(newDisplayedItems);

      if (newDisplayedItems >= currentAllData.length) {
        setHasMore(false);
      }

      setIsLoading(false);
    }, 800);
  }, [displayedItems, currentAllData.length, isLoading, hasMore]);

  // Intersection Observer for infinite scroll
  const lastItemRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, loadMore]
  );

  // Reset when tab changes
  useEffect(() => {
    setDisplayedItems(10);
    setHasMore(true);
    setIsLoading(false);
  }, [activeTab]);

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setSparkleAnimation((prev) => !prev);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const tabs = ["LỊCH SỬ CƯỢC", "LỊCH SỬ KẾT QUẢ"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
        <div className="flex items-center justify-between p-4 text-white">
          <button
            onClick={() => navigate(-1)}
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
      <div
        className={`flex-1 transition-all duration-1000 overflow-hidden ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {hasData ? (
          // Table View
          <div className="h-full overflow-y-auto bg-gray-50">
            <div className="min-w-full">
              {/* Table Header */}
              <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="px-4 py-3">
                  {activeTab === "LỊCH SỬ CƯỢC" ? (
                    <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="col-span-4">Cuộc</div>
                      <div className="col-span-3">Thời gian</div>
                      <div className="col-span-2">Trạng thái</div>
                      <div className="col-span-3 text-right">Số tiền</div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="col-span-4">Kết quả</div>
                      <div className="col-span-2">Số</div>
                      <div className="col-span-3">Giải thưởng</div>
                      <div className="col-span-3 text-right">Tiền thưởng</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {currentData.map((item, index) => (
                  <div
                    key={item.id}
                    ref={index === currentData.length - 1 ? lastItemRef : null}
                    className={`bg-white hover:bg-gray-50 transition-all duration-200 border-l-4 ${
                      activeTab === "LỊCH SỬ CƯỢC"
                        ? item.type === "success"
                          ? "border-l-green-400 hover:border-l-green-500"
                          : item.type === "pending"
                          ? "border-l-yellow-400 hover:border-l-yellow-500"
                          : "border-l-red-400 hover:border-l-red-500"
                        : item.type === "win"
                        ? "border-l-green-400 hover:border-l-green-500"
                        : "border-l-gray-300 hover:border-l-gray-400"
                    } ${
                      isVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-4"
                    }`}
                    style={{
                      animationDelay: `${Math.min(index * 30, 300)}ms`,
                    }}
                  >
                    <div className="px-4 py-4">
                      {activeTab === "LỊCH SỬ CƯỢC" ? (
                        // History Row
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-4">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                  item.type === "success"
                                    ? "bg-green-400"
                                    : item.type === "pending"
                                    ? "bg-yellow-400"
                                    : "bg-red-400"
                                }`}
                              ></div>
                              <div>
                                <div className="font-medium text-gray-900 text-sm line-clamp-1">
                                  {item.title}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  ID: #{item.id.toString().padStart(4, "0")}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-3">
                            <div className="text-sm text-gray-900">
                              {item.date}
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.time}
                            </div>
                          </div>
                          <div className="col-span-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                item.type === "success"
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : item.type === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                  : "bg-red-100 text-red-800 border border-red-200"
                              }`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  item.type === "success"
                                    ? "bg-green-400"
                                    : item.type === "pending"
                                    ? "bg-yellow-400"
                                    : "bg-red-400"
                                }`}
                              ></div>
                              {item.status}
                            </span>
                          </div>
                          <div className="col-span-3 text-right">
                            <div className="font-semibold text-gray-900">
                              {item.amount}
                            </div>
                            <div className="text-xs text-gray-500">VNĐ</div>
                          </div>
                        </div>
                      ) : (
                        // Result Row
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-4">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                  item.type === "win"
                                    ? "bg-green-400"
                                    : "bg-gray-400"
                                }`}
                              ></div>
                              <div>
                                <div className="font-medium text-gray-900 text-sm line-clamp-1">
                                  {item.title}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {item.date}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <div className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                              {item.numbers}
                            </div>
                          </div>
                          <div className="col-span-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                item.type === "win"
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : "bg-gray-100 text-gray-600 border border-gray-200"
                              }`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  item.type === "win"
                                    ? "bg-green-400"
                                    : "bg-gray-400"
                                }`}
                              ></div>
                              {item.prize}
                            </span>
                          </div>
                          <div className="col-span-3 text-right">
                            <div
                              className={`font-bold text-sm ${
                                item.type === "win"
                                  ? "text-green-600"
                                  : "text-red-500"
                              }`}
                            >
                              {item.amount}
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.type === "win" ? "Thắng" : "Thua"}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Loading Indicator */}
              {isLoading && (
                <div className="bg-white border-t">
                  <div className="flex items-center justify-center py-8 space-x-2">
                    <Loader className="animate-spin text-green-500" size={20} />
                    <span className="text-gray-500 text-sm">
                      Đang tải thêm dữ liệu...
                    </span>
                  </div>
                </div>
              )}

              {/* End of List Indicator */}
              {!hasMore && currentData.length > 10 && (
                <div className="bg-white border-t">
                  <div className="text-center py-8">
                    <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">
                      <Sparkles size={16} className="mr-2" />
                      Đã hiển thị tất cả {currentAllData.length} bản ghi
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Empty State
          <div className="flex items-center justify-center p-8">
            <div className="text-center space-y-6 max-w-sm">
              {/* Empty State Icon */}
              <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl transform rotate-3 shadow-lg"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-200 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="relative">
                    <Sparkles
                      size={48}
                      className={`text-gray-400 mx-auto transition-all duration-1000 ${
                        sparkleAnimation
                          ? "scale-110 text-green-400"
                          : "scale-100"
                      }`}
                    />
                    {/* Floating particles */}
                    <div
                      className={`absolute -top-2 -right-2 w-2 h-2 bg-green-400 rounded-full transition-all duration-1000 ${
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
                  {activeTab === "LỊCH SỬ CƯỢC"
                    ? "Chưa có lịch sử cược nào. Các cược sẽ được hiển thị tại đây khi có."
                    : "Chưa có kết quả nào. Các kết quả sẽ được hiển thị tại đây khi có."}
                </p>
              </div>

              {/* Action Button */}
              <button className="mt-8 px-8 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-green-500 hover:to-green-600">
                <span className="flex items-center justify-center space-x-2">
                  <Sparkles size={16} />
                  <span>
                    {activeTab === "LỊCH SỬ CƯỢC"
                      ? "Tạo cược mới"
                      : "Xem kết quả"}
                  </span>
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-20 left-10 w-2 h-2 bg-green-300 rounded-full opacity-30 animate-bounce"
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

export default LotteryHistory;
