import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { adminAPI } from "@/services/adminApi";

const HistorySessionManagement = () => {
  const { setBreadcrumb } = useBreadcrumb();
  useEffect(() => {
    setBreadcrumb([
      { label: "Trang chủ", href: "/" },
      { label: "Lịch sử phiên", href: "/admin/history-session", active: true },
    ]);
  }, [setBreadcrumb]);
  // Tạo dữ liệu mẫu nhiều hơn cho demo phân trang
  const [roomsData, setRoomsData] = useState([]);
  const fetchRoomsData = async () => {
    try {
      const response = await adminAPI.getRooms();
      const data = response?.data?.result || [];
      setRoomsData(data);
    } catch (error) {
      console.error("Error fetching rooms data:", error);
    }
  };
  useEffect(() => {
    fetchRoomsData();
  }, []);

  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectRoomActive, setSelectRoomActive] = useState();
  const [sessions, setSessions] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 1,
    totalPages: 1,
  }); // Phân trang

  const handleRoomSelect = async (room) => {
    setSelectedRoom(room.id);
    setSelectRoomActive(room);
    try {
      const response = await adminAPI.getSessionByRoom(room.id, { page: 1 });
      const result = response?.data?.result || [];
      setSessions(result?.data);
      setPagination({
        currentPage: result?.pagination?.currentPage || 1,
        pageSize: result?.pagination?.pageSize || 10,
        totalItems: result?.pagination?.totalItems || 1,
        totalPages: result?.pagination?.totalPages || 1,
      });
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setSessions([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        pageSize: 10,
        totalItems: 0,
      });
    }
  };

  const handlePageChange = async (page) => {
    try {
      const response = await adminAPI.getSessionByRoom(selectedRoom, { page });
      const result = response?.data?.result;
      setSessions(result?.data || []);
      setPagination({
        currentPage: result?.pagination?.currentPage || 1,
        totalPages: result?.pagination?.totalPages || 1,
        pageSize: result?.pagination?.pageSize || 10,
        totalItems: result?.pagination?.totalItems || 0,
      });
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setSessions([]);
    }
  };

  // Thêm state lưu countdown cho từng session
  const [countdowns, setCountdowns] = useState({});
  const intervalRef = useRef();

  // Hàm tính thời gian còn lại (giây)
  const getCountdown = (startTime, endTime) => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const diff = Math.max(0, Math.floor((end - start) / 1000));
    return diff;
  };

  // Khi sessions thay đổi, khởi tạo countdown cho từng phiên
  useEffect(() => {
    if (!sessions || sessions.length === 0) return;
    // Giả sử mỗi phiên có trường startTime (thời gian bắt đầu) và duration (giây)
    const newCountdowns = {};
    sessions.forEach((session) => {
      newCountdowns[session.id] = getCountdown(
        session.startTime,
        session.endTime
      );
    });
    setCountdowns(newCountdowns);

    // Clear interval cũ nếu có
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Tạo interval để cập nhật countdown mỗi giây
    intervalRef.current = setInterval(() => {
      setCountdowns((prev) => {
        const updated = { ...prev };
        sessions.forEach((session) => {
          const remain = getCountdown(session.startTime, session.endTime);
          updated[session.id] = remain;
          // Nếu hết thời gian thì call lại API để cập nhật status
          if (remain === 0 && session.status !== "completed") {
            handlePageChange(pagination.currentPage);
          }
        });
        return updated;
      });
    }, 1000);

    // Cleanup interval khi unmount hoặc sessions thay đổi
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sessions, pagination.currentPage]);
  return (
    <>
      <title>Kết quả phiên</title>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl font-bold text-left text-gray-800 mb-8">
            Lịch sử kết quả phiên
          </h1>

          {/* Room Selection */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Chọn Phòng
            </h2>
            <div className="flex gap-3 flex-wrap">
              {roomsData.map((room) => (
                <button
                  key={room.id}
                  onClick={() => handleRoomSelect(room)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedRoom === room.id
                      ? "bg-blue-600 text-white shadow-lg transform scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                  }`}
                >
                  {room.name}
                </button>
              ))}
            </div>
          </div>

          {/* Session Results Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
              <h2 className="text-xl font-semibold">
                Danh Sách Phiên - {selectRoomActive?.name || "Đang cập nhật"}
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Phiên
                    </th>
                    {/* <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian đặt cược
                    </th> */}
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Kết Quả Gợi Ý
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Kết Quả
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Trạng Thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sessions?.map((session, index) => (
                    <tr
                      key={session.id}
                      className={`hover:bg-gray-50 transition-colors duration-150 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-25"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {(pagination.currentPage - 1) * pagination.pageSize +
                          index +
                          1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {session.roundNumber}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {countdowns[session.id] > 0
                          ? `${Math.floor(countdowns[session.id] / 60)
                              .toString()
                              .padStart(2, "0")}:${(countdowns[session.id] % 60)
                              .toString()
                              .padStart(2, "0")}`
                          : "Đã kết thúc"}
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {session?.suggestedNumbers?.join(", ")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {session?.resultNumbers?.join(", ") || "Chưa cập nhật"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            session.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {session.status === "completed"
                            ? "Hoàn Thành"
                            : "Chưa Hoàn Thành"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-white px-6 py-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700 hidden sm:block">
                    Hiển thị{" "}
                    <span className="font-medium">
                      {(pagination.currentPage - 1) * pagination.pageSize + 1}
                    </span>{" "}
                    đến{" "}
                    <span className="font-medium">
                      {Math.min(
                        pagination.currentPage * pagination.pageSize,
                        pagination.totalItems
                      )}
                    </span>{" "}
                    trong{" "}
                    <span className="font-medium">{pagination.totalItems}</span>{" "}
                    kết quả
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={pagination.currentPage === 1}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        pagination.currentPage === 1
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Trước
                    </button>

                    {/* Page Numbers */}
                    <span className="px-3 py-2 text-sm font-medium rounded-md bg-blue-600 text-white">
                      {pagination.currentPage}
                    </span>

                    {/* Next Button */}
                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        pagination.currentPage === pagination.totalPages
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      Sau
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="bg-gray-50 px-6 py-3 border-t">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Tổng cộng: {pagination.totalItems} phiên</span>
                <div className="flex gap-4">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    T: {sessions.filter((s) => s.resultSum > 10).length}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    X: {sessions.filter((s) => s.resultSum < 10).length}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    C: {sessions.filter((s) => s.resultSum % 2 === 0).length}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    L: {sessions.filter((s) => s.resultSum % 2 === 1).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HistorySessionManagement;
