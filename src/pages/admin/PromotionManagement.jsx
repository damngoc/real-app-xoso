import React, { useState, useEffect } from "react";
import Table from "@/components/admin/Table";
import { Search, Plus } from "lucide-react";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import PromotionModal from "@/pages/admin/components/PromotionModal";
import ModalDelete from "@/components/admin/ModalDelete";
import { adminAPI } from "@/services/adminApi";
import { toast } from "react-toastify";

const columns = [
  { key: "idColumn", label: "ID" },
  { key: "title", label: "Tiêu đề" },
  { key: "image", label: "Nội dung" },
];

const PromotionManagement = () => {
  const { setBreadcrumb } = useBreadcrumb();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPromotionId, setSelectedPromotionId] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    setBreadcrumb([
      { label: "Trang chủ", href: "/" },
      { label: "Quản lý khuyến mãi", href: "/admin/promotions", active: true },
    ]);
  }, [setBreadcrumb]);

  // lấy dữ liệu từ api
  const fetchPromotions = async () => {
    try {
      const response = await adminAPI.getPromotions();
      setPromotions(response?.data?.result || []);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  };
  useEffect(() => {
    fetchPromotions();
  }, []);
  // Lọc theo từ khóa tìm kiếm
  const filteredData = promotions.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const pagedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Xử lý xóa
  const handleDelete = (promotion) => {
    setDeleteModalOpen(true);
    setSelectedPromotionId(promotion.id);
  };

  const handleConfirmDelete = async () => {
    try {
      await adminAPI.deletePromotion(selectedPromotionId);
      toast.success("Xóa khuyến mãi thành công!");
      fetchPromotions();
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting promotion:", error);
    }
  };

  // Xử lý thêm mới (ví dụ mở modal)
  const handleOpenAddPromotion = () => {
    setModalOpen(true);
  };
  const handleAddPromotion = async (data) => {
    // Logic call api add new promotion
    try {
      const response = await adminAPI.createPromotion(data);
      if (response?.status === 201) {
        toast.success("Thêm khuyến mãi thành công!");
        fetchPromotions();
        setModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding promotion:", error);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <>
      <title>Quản lý khuyến mãi</title>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Quản lý khuyến mãi
          </h2>
        </div>
        <div className="bg-white shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm tiêu đề, nội dung..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 !pr-4 !py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
              />
            </div>
            <button
              onClick={handleOpenAddPromotion}
              className="flex justify-center px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Thêm khuyến mãi
            </button>
          </div>
        </div>

        <Table
          columns={columns}
          data={pagedData.map((row, index) => ({
            ...row,
            idColumn: (currentPage - 1) * pageSize + index + 1,
          }))}
          actionsLabel="Thao tác"
          onDelete={handleDelete}
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
      {/* Modal for adding new promotion */}
      {modalOpen && (
        <PromotionModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleAddPromotion}
        />
      )}
      {/* Modal for delete promotion */}
      {deleteModalOpen && (
        <ModalDelete
          open={deleteModalOpen}
          title="Xác nhận xóa khuyến mãi"
          message="Bạn có chắc chắn muốn xóa khuyến mãi này?"
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}
    </>
  );
};

export default PromotionManagement;
