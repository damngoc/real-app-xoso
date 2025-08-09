import React, { useState, useEffect } from "react";
import Table from "@/components/admin/Table";
import { Search } from "lucide-react";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { adminAPI } from "@/services/adminApi";

const columns = [
  { key: "idColumn", label: "ID" },
  { key: "username", label: "Username" },
  { key: "type", label: "Loại giao dịch" },
  { key: "amount", label: "Số tiền" },
  { key: "note", label: "Ghi chú" },
  { key: "adminNote", label: "Lý do từ chối" },
  { key: "createdAt", label: "Ngày" },
  { key: "status", label: "Trạng thái" },
];

const HistoryDepositManagement = () => {
  const { setBreadcrumb } = useBreadcrumb();
  const [historyData, setHistoryData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    setBreadcrumb([
      { label: "Trang chủ", href: "/" },
      {
        label: "Lịch sử nạp/rút tiền",
        href: "/admin/history-deposit",
        active: true,
      },
    ]);
  }, [setBreadcrumb]);

  const fetchHistoryTransaction = async () => {
    try {
      const response = await adminAPI.historyTransaction();
      console.log(response);
      setHistoryData(response?.data?.result?.transactions || []);
    } catch (error) {
      console.error("Error fetching history transaction:", error);
    }
  };

  useEffect(() => {
    fetchHistoryTransaction();
  }, []);

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredData = historyData.filter((item) =>
    item?.username.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const pagedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset về trang 1 khi search thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <>
      <title>Lịch sử nạp/rút tiền</title>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Danh sách lịch sử nạp/rút tiền
          </h2>
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
          data={pagedData.map((row, index) => ({
            ...row,
            idColumn: (currentPage - 1) * pageSize + index + 1,
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
                onClick={handlePrev}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              <span className="px-3 py-1 text-sm text-white bg-purple-600 rounded">
                {currentPage}
              </span>
              <button
                className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                onClick={handleNext}
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

export default HistoryDepositManagement;
