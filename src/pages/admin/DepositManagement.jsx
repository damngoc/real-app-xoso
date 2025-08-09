import React, { useEffect, useState } from "react";
import Pagination from "@/components/admin/Pagination";
import { Plus, Search } from "lucide-react";
import Table from "@/components/admin/Table";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import ModalForm from "@/components/admin/ModalForm";
import { adminAPI } from "@/services/adminApi";
import { TransactionConfirmModal } from "@/pages/admin/components/TransactionConfirmModal";
import { toast } from "react-toastify";

const columns = [
  { key: "idColumn", label: "ID" },
  { key: "username", label: "Tên người dùng" },
  { key: "amount", label: "Số tiền" },
  { key: "type", label: "Loại giao dịch" },
  { key: "status", label: "Trạng thái" },
  { key: "createdAt", label: "Ngày" },
];

const DepositManagement = () => {
  const { setBreadcrumb } = useBreadcrumb();
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState("approve");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState({
    userId: "",
    amount: "",
    type: "",
  });

  const fields = [
    {
      name: "userId",
      label: "Người dùng",
      type: "select",
      value: form.userId,
      options: users.map((user) => ({ value: user.id, label: user.username })),
    },
    {
      name: "amount",
      label: "Số tiền",
      type: "number",
      value: form.amount,
    },
    {
      name: "type",
      label: "Loại giao dịch",
      type: "select",
      value: form.type,
      options: [
        { value: "deposit", label: "Nạp tiền" },
        { value: "withdraw", label: "Rút tiền" },
      ],
    },
  ];

  useEffect(() => {
    setBreadcrumb([
      { label: "Trang chủ", href: "/" },
      {
        label: "Quản lý nạp rút",
        href: "/admin/deposit",
        active: true,
      },
    ]);
  }, [setBreadcrumb]);

  // get list user
  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      return setUsers(response?.data?.result || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  // get transactions
  const fetchTransactions = async () => {
    try {
      // Simulate fetching data from an API or any other data source
      const response = await adminAPI.getTransactionPending();
      setTransactions(response?.data?.result || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };
  useEffect(() => {
    fetchTransactions();
  }, []);

  const pageSize = 5;

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredData = transactions.filter(
    (item) =>
      item.username.toLowerCase().includes(search.toLowerCase()) ||
      item.amount.toString().includes(search)
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const pagedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleOpenReject = (row) => {
    setSelectedTransaction(row);
    setShowConfirm(true);
    setActionType("reject");
  };

  const handleAddDeposit = () => {
    fetchUsers();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setForm({ userId: "", amount: "", type: "" });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // validate form
    if (!form.userId || !form.amount || !form.type) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    try {
      const dataSave = {
        userId: form.userId,
        amount: Number(form.amount),
        type: form.type,
      };
      // Simulate API call
      await adminAPI.createTransaction(dataSave);
      toast.success("Tạo giao dịch thành công!");
      fetchTransactions();
      handleCloseModal();
    } catch (error) {
      console.error("Error creating deposit:", error);
      toast.error("Tạo giao dịch thất bại. Vui lòng thử lại");
    }
  };

  const handleOpenAccept = (row) => {
    setSelectedTransaction(row);
    setShowConfirm(true);
    setActionType("approve");
  };

  const handleConfirm = async (note) => {
    setIsProcessing(true);
    try {
      const dataProcess = {
        action: actionType,
        note,
      };
      // Simulate API call
      await adminAPI.updateTransaction(selectedTransaction.id, dataProcess);
      toast.success("Cập nhật giao dịch thành công!");
      fetchTransactions();
      setShowConfirm(false);
    } catch (error) {
      console.error("Error confirming deposit:", error);
      const errMes =
        error?.response?.data?.error.message || "Cập nhật giao dịch thất bại!";
      toast.error(errMes);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <title>Quản lý nạp rút</title>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Danh sách nạp rút
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
              onClick={handleAddDeposit}
              className="flex justify-center px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Thêm nạp rút
            </button>
          </div>
        </div>

        {/* Responsive Table Container */}
        <Table
          columns={columns}
          data={pagedData.map((row, index) => ({
            ...row,
            idColumn: (currentPage - 1) * pageSize + index + 1,
          }))}
          actionsLabel="Thao tác"
          onConfirm={(row) => handleOpenAccept(row)}
          onReject={(row) => handleOpenReject(row)}
        />

        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Hiển thị {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, filteredData.length)} của{" "}
              {transactions.length} kết quả
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </div>
        </div>

        {showConfirm && (
          <TransactionConfirmModal
            isOpen={showConfirm}
            actionType={actionType}
            selectedTransaction={selectedTransaction}
            isProcessing={isProcessing}
            onClose={() => setShowConfirm(false)}
            confirmAction={handleConfirm}
          />
        )}

        {showModal && (
          <ModalForm
            open={showModal}
            title="Thêm mới nạp rút"
            fields={fields}
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
            onClose={handleCloseModal}
            onSubmit={handleFormSubmit}
            formData={form}
            setFormData={setForm}
          />
        )}
      </div>
    </>
  );
};

export default DepositManagement;
