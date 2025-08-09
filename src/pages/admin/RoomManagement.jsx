import React, { useState, useEffect } from "react";
import Table from "@/components/admin/Table";
import { Search, Plus } from "lucide-react";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import ModalDelete from "@/components/admin/ModalDelete";
import ModalForm from "@/components/admin/ModalForm";
import { adminAPI } from "@/services/adminApi";
import { toast } from "react-toastify";

const columns = [
  { key: "name", label: "Tên phòng" },
  { key: "description", label: "Mô tả" },
  { key: "currentRoundNumber", label: "Phiên hiện tại" },
];

const RoomManagement = () => {
  const { setBreadcrumb } = useBreadcrumb();
  const [search, setSearch] = useState("");
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [form, setForm] = useState({
    name: "",
  });

  useEffect(() => {
    setBreadcrumb([
      { label: "Trang chủ", href: "/" },
      { label: "Quản lý phòng", href: "/admin/banks", active: true },
    ]);
  }, [setBreadcrumb]);

  // Lấy dữ liệu ngân hàng từ API
  const fetchRoom = async () => {
    try {
      const response = await adminAPI.getRooms();
      setRooms(response?.data?.result || []);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };
  useEffect(() => {
    // Logic to fetch banks from API or context
    fetchRoom();
  }, []);

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredData = rooms.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const pagedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fields = [
    {
      name: "name",
      label: "Tên phòng",
      value: form.name,
      required: true,
    },
  ];

  // Xử lý thêm/sửa/xóa
  const handleOpenEdit = (room) => {
    setSelectedRoomId(room.id);
    setForm({
      name: room.name,
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    try {
      if (isEdit) {
        await adminAPI.updateRoom(selectedRoomId, form);
      }
      toast.success(
        isEdit ? "Cập nhật phòng thành công!" : "Thêm phòng thành công!"
      );
      fetchRoom();
      setShowModal(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <title>Quản lý phòng</title>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quản lý phòng</h2>
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
          data={pagedData}
          actionsLabel="Thao tác"
          onEdit={handleOpenEdit}
        />

        {/* Modal thêm/sửa/xóa ngân hàng có thể đặt ở đây */}
        {showModal && (
          <ModalForm
            open={showModal}
            title={isEdit ? "Chỉnh sửa phòng" : "Thêm phòng"}
            fields={fields}
            onChange={(e) =>
              setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
            }
            onSubmit={handleConfirmSubmit}
            onClose={() => setShowModal(false)}
            submitLabel="Lưu"
          />
        )}
      </div>
    </>
  );
};

export default RoomManagement;
