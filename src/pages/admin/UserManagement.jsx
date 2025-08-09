import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import Table from "@/components/admin/Table";
import Pagination from "@/components/admin/Pagination";
import ModalForm from "@/components/admin/ModalForm";
import ModalDelete from "@/components/admin/ModalDelete";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { adminAPI } from "@/services/adminApi";
import { toast } from "react-toastify";

const columns = [
  { key: "idColumn", label: "ID" },
  { key: "username", label: "Tên đăng nhập" },
  { key: "email", label: "Email" },
  { key: "balance", label: "Số tiền" },
  { key: "bankName", label: "Tên ngân hàng" },
  { key: "accountNumber", label: "Số tài khoản" },
  { key: "accountHolderName", label: "Tên chủ tài khoản" },
  { key: "registerIp", label: "IP đăng ký" },
  { key: "lastLoginIp", label: "IP đăng nhập lần cuối" },
  { key: "plainPassword", label: "Mật khẩu" },
];

const UserManagement = () => {
  const { setBreadcrumb } = useBreadcrumb();
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    balance: "",
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
    password: "",
  });
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setBreadcrumb([
      { label: "Trang chủ", href: "/" },
      { label: "Quản lý người dùng", href: "/admin/users", active: true },
    ]);
  }, [setBreadcrumb]);

  // get data users
  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setTableData(response?.data?.result || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    // Logic to fetch users from API or context
    fetchUsers();
  }, []);

  const fields = [
    {
      name: "username",
      label: "Tên đăng nhập",
      value: form.username,
      type: "text",
    },
    {
      name: "email",
      label: "Email",
      value: form.email,
      type: "email",
    },
    {
      name: "balance",
      label: "Số tiền",
      value: form.balance,
      type: "number",
    },
    {
      name: "bankName",
      label: "Tên ngân hàng",
      value: form.bankName,
      type: "text",
    },
    {
      name: "accountNumber",
      label: "Số tài khoản",
      value: form.accountNumber,
      type: "number",
    },
    {
      name: "accountHolderName",
      label: "Tên chủ tài khoản",
      value: form.accountHolderName,
      type: "text",
    },
    {
      name: "password",
      label: "Mật khẩu",
      value: form.password,
      type: "text",
    },
  ];

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredData = tableData?.filter((user) =>
    user?.username.toLowerCase().includes(search.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const pagedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleSaveUser = async () => {
    // Validate form data
    if (isNaN(form.balance) || Number(form.balance) < 0) {
      toast.error("Số tiền phải là một số dương hợp lệ!");
      return;
    }
    if (form.password && form.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    // Logic to save user data
    const dataSave = {
      username: form.username,
      email: form.email,
      balance: Number(form.balance),
      bankName: form.bankName,
      accountNumber: form.accountNumber,
      accountHolderName: form.accountHolderName,
      password: form.password,
    };
    try {
      if (isEdit) {
        await adminAPI.updateUser(selectedUser.id, dataSave);
      } else {
        await adminAPI.createUser(dataSave);
      }
      toast.success(
        isEdit
          ? "Cập nhật người dùng thành công!"
          : "Thêm người dùng thành công!"
      );
      fetchUsers();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving user:", error);
      // Handle error response
      const errors = error.response?.data?.error?.errors || [];
      const errorMessage =
        error.response?.data?.error?.message || "Lỗi khi lưu người dùng!";
      if (errors.length > 0) {
        errors.forEach((err) => toast.error(err));
        return;
      }
      toast.error(errorMessage);
    }
  };

  const handleShowModalEdit = (user) => {
    setSelectedUser(user);
    setForm({ ...user, password: user?.plainPassword });
    setShowModal(true);
    setIsEdit(true);
  };

  const handleDeleteUser = async () => {
    // Logic to delete user
    try {
      await adminAPI.deleteUser(selectedUser.id);
      toast.success("Xóa người dùng thành công!");
      fetchUsers();
      setShowDelete(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, tableData]);
  return (
    <>
      <title>Quản lý người dùng</title>
      {/* Content Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Danh sách người dùng
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

        {/* Responsive Table Container */}
        <Table
          columns={columns}
          data={pagedData.map((row, index) => ({
            ...row,
            idColumn: (currentPage - 1) * pageSize + index + 1,
          }))}
          actionsLabel="Thao tác"
          onEdit={(user) => {
            handleShowModalEdit(user);
          }}
          onDelete={(user) => {
            setSelectedUser(user);
            setShowDelete(true);
          }}
        />

        {/* Table Footer/Pagination Area */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Hiển thị {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, filteredData.length)} của{" "}
              {filteredData.length} kết quả
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </div>
        </div>
      </div>
      {showModal && (
        <ModalForm
          open={showModal}
          title={isEdit ? "Chỉnh sửa người dùng" : "Thêm người dùng"}
          fields={fields}
          onChange={(e) => {
            setForm({
              ...form,
              [e.target.name]: e.target.value,
            });
          }}
          onSubmit={(e) => {
            e.preventDefault();
            // Xử lý thêm hoặc sửa
            handleSaveUser();
          }}
          onClose={() => setShowModal(false)}
          submitLabel="Lưu"
        />
      )}
      {showDelete && (
        <ModalDelete
          open={showDelete}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa người dùng ${selectedUser?.username}?`}
          onConfirm={handleDeleteUser}
          onClose={() => setShowDelete(false)}
        />
      )}
    </>
  );
};

export default UserManagement;
