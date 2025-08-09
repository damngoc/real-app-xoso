import React, { useState, useEffect } from "react";
import Table from "@/components/admin/Table";
import { Search, Plus } from "lucide-react";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import ModalDelete from "@/components/admin/ModalDelete";
import ModalForm from "@/components/admin/ModalForm";
import { adminAPI } from "@/services/adminApi";
import { toast } from "react-toastify";

const columns = [
  { key: "bankName", label: "Tên ngân hàng" },
  { key: "accountNumber", label: "Số tài khoản" },
  { key: "accountHolderName", label: "Chủ tài khoản" },
];

const BankManagement = () => {
  const { setBreadcrumb } = useBreadcrumb();
  const [search, setSearch] = useState("");
  const [banks, setBanks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState(null);
  const [form, setForm] = useState({
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
  });

  useEffect(() => {
    setBreadcrumb([
      { label: "Trang chủ", href: "/" },
      { label: "Cấu hình ngân hàng", href: "/admin/banks", active: true },
    ]);
  }, [setBreadcrumb]);

  // Lấy dữ liệu ngân hàng từ API
  const fetchBanks = async () => {
    try {
      const response = await adminAPI.getBanks();
      setBanks(response?.data?.result || []);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };
  useEffect(() => {
    // Logic to fetch banks from API or context
    fetchBanks();
  }, []);

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredData = banks.filter(
    (item) =>
      item.bankName.toLowerCase().includes(search.toLowerCase()) ||
      item.accountNumber.includes(search)
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
      name: "bankName",
      label: "Tên ngân hàng",
      value: form.bankName,
      required: true,
    },
    {
      name: "accountNumber",
      label: "Số tài khoản",
      value: form.accountNumber,
      type: "text",
      required: true,
    },
    {
      name: "accountHolderName",
      label: "Chủ tài khoản",
      value: form.accountHolderName,
      type: "text",
      required: true,
    },
  ];

  // Xử lý thêm/sửa/xóa
  const handleOpenAddBank = () => {
    setIsEdit(false);
    setShowModal(true);
  };

  const handleOpenEdit = (bank) => {
    setSelectedBankId(bank.id);
    setForm({
      bankName: bank.bankName,
      accountNumber: bank.accountNumber,
      accountHolderName: bank.accountHolderName,
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
    if (!form.bankName || !form.accountNumber) return;
    try {
      if (isEdit) {
        await adminAPI.updateBank(selectedBankId, form);
      } else {
        await adminAPI.createBank(form);
      }
      toast.success(
        isEdit ? "Cập nhật ngân hàng thành công!" : "Thêm ngân hàng thành công!"
      );
      fetchBanks();
      setShowModal(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleOpenDelete = (bank) => {
    setSelectedBankId(bank.id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await adminAPI.deleteBank(selectedBankId);
      toast.success("Xóa ngân hàng thành công!");
      fetchBanks();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting bank:", error);
    }
  };

  return (
    <>
      <title>Cấu hình ngân hàng</title>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Cấu hình ngân hàng
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
            <button
              disabled={filteredData.length >= 1}
              onClick={handleOpenAddBank}
              className="flex justify-center px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Thêm ngân hàng
            </button>
          </div>
        </div>

        <Table
          columns={columns}
          data={pagedData}
          actionsLabel="Thao tác"
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />

        {/* Modal thêm/sửa/xóa ngân hàng có thể đặt ở đây */}
        {showModal && (
          <ModalForm
            open={showModal}
            title={isEdit ? "Chỉnh sửa ngân hàng" : "Thêm ngân hàng"}
            fields={fields}
            onChange={(e) =>
              setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
            }
            onSubmit={handleConfirmSubmit}
            onClose={() => setShowModal(false)}
            submitLabel="Lưu"
          />
        )}
        {showDeleteModal && (
          <ModalDelete
            open={showDeleteModal}
            title="Xác nhận xóa ngân hàng"
            message="Bạn có chắc chắn muốn xóa ngân hàng này?"
            onConfirm={handleConfirmDelete}
            onClose={() => setShowDeleteModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default BankManagement;
