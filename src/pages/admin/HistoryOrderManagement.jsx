import React, { useState, useEffect } from "react";
import Table from "@/components/admin/Table";
import { Search } from "lucide-react";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { adminAPI } from "../../services/adminApi";

const columns = [
  { key: "id", label: "ID" },
  { key: "user", label: "Username" },
  { key: "betAmount", label: "Số tiền cược" },
  { key: "roomName", label: "Tên phòng" },
  { key: "codeSession", label: "Mã phiên" },
  { key: "betType", label: "Loại cược" },
  { key: "createdAt", label: "Thời gian đặt" },
  { key: "result", label: "Kết quả" },
  { key: "status", label: "Trạng thái" },
];

const HistoryOrderManagement = () => {
  const { setBreadcrumb } = useBreadcrumb();
  const [historyBets, setHistoryBets] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    setBreadcrumb([
      { label: "Trang chủ", href: "/" },
      { label: "Lịch sử cược", href: "/admin/history-order", active: true },
    ]);
  }, [setBreadcrumb]);

  const fetchHistoryOrders = async () => {
    // Simulate fetching data from an API or any other data source
    try {
      // Here you would typically make an API call to fetch the data
      const response = await adminAPI.getHistoryBets();
      setHistoryBets(response?.data?.result?.bets || []);
    } catch (error) {
      console.error("Error fetching history orders:", error);
    }
  };
  useEffect(() => {
    fetchHistoryOrders();
  }, []);
  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredData = historyBets.filter((item) =>
    item.username.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const pagedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Custom render cho status và result
  const renderStatus = (row) => (
    <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-700">
      {row.status}
    </span>
  );
  const renderResult = (row) => (
    <span
      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
        row.result === "Thắng"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {row.result}
    </span>
  );

  return (
    <>
      <title>Lịch sử cược</title>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Lịch sử cược</h2>
        </div>
        <div className="bg-white shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm tên..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 !pr-4 !py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
              />
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          data={pagedData.map((row) => ({
            ...row,
            status: renderStatus(row),
            result: renderResult(row),
          }))}
        />

        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Hiển thị {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, filteredData.length)} của{" "}
              {filteredData.length} kết quả
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              <span className="px-3 py-1 text-sm text-white bg-purple-600 rounded">
                {currentPage}
              </span>
              <button
                className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoryOrderManagement;
