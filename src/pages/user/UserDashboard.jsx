import React, { useState, useEffect } from "react";
import {
  RotateCcw,
  User,
  Bell,
  Settings,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Smartphone,
  Heart,
  Building,
} from "lucide-react";
import { Footer } from "@/components/common/Footer";
import { formatCurrency } from "@/utils/helper";
import { useNavigate } from "react-router-dom";
import "@/css/user/UserDashboard.scss";
import { userAPI } from "@/services/userApi";
import { setUserStorage } from "@/utils/auth";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [rooms, setRooms] = useState([]);
  const gameId = "f7cfce61-cdc8-4731-ae8c-d2f815a8f36a";
  // get user info
  const fetchUserData = async () => {
    try {
      const response = await userAPI.getProfile();
      const user = response?.data?.result;
      setUserStorage(user);
      setUserData(user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const fetchRooms = async () => {
    try {
      const response = await userAPI.getRooms();
      if (response?.status === 200) {
        const rooms = response?.data?.result;
        setRooms(rooms);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };
  useEffect(() => {
    fetchUserData();
    fetchRooms();
  }, []);
  const balance = userData?.balance || 0; // Example balance

  return (
    <>
      <title>Dự án Mala</title>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-b-3xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Xin chào!</h1>
                <p className="text-sm opacity-90">Chúc bạn một ngày tốt lành</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
                <Bell className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Số dư */}
          <div className="text-center mb-6">
            <p className="text-sm opacity-90 mb-2">Số dư hiện tại</p>
            <h2 className="text-3xl font-bold mb-4">
              {formatCurrency(balance)}
            </h2>
            <button
              onClick={() => navigate("/deposit")}
              className="bg-white bg-opacity-20 px-6 py-2 rounded-full hover:bg-opacity-30 transition-all"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Nạp tiền
            </button>
          </div>
        </div>

        {/* Công bố / Announcement */}
        <div className="px-6 py-4">
          <div className="flex items-center space-x-2 text-red-600 mb-4">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-sm">📢</span>
            </div>
            <span className="block w-[100px] font-medium">Công bố: </span>
            <div className="marquee">
              <span className="text-red-600">
                Chương trình khuyến mãi tháng 8 với nhiều ưu đãi hấp dẫn!
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col items-center space-y-2">
              <div
                onClick={() => navigate("/deposit")}
                className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-all cursor-pointer"
              >
                <ArrowUpRight className="w-8 h-8 text-red-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Nạp tiền
              </span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div
                onClick={() => navigate("/withdraw")}
                className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-all cursor-pointer"
              >
                <ArrowDownLeft className="w-8 h-8 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Rút tiền
              </span>
            </div>
            <div
              onClick={() => navigate(`/game/${gameId}`)}
              className="flex flex-col items-center space-y-2"
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center hover:bg-yellow-200 transition-all cursor-pointer">
                <Smartphone className="w-8 h-8 text-yellow-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Trò chơi
              </span>
            </div>
            <div
              onClick={() => navigate(`/game/${gameId}`)}
              className="flex flex-col items-center space-y-2"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center hover:bg-purple-200 transition-all cursor-pointer">
                <RotateCcw className="w-8 h-8 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Rồng</span>
            </div>
          </div>

          {/* Danh Sách Button */}
          <div className="mb-6">
            <button className="bg-red-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-all shadow-lg">
              Danh sách trò chơi
            </button>
          </div>

          {/* Danh sách dự án */}
          <div className="space-y-4 mb-20">
            {rooms &&
              rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => navigate(`/game/${room.id}`)}
                  className="bg-white rounded-2xl p-4 shadow-lg border-2 border-red-200 cursor-pointer hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Building className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-500">
                        {room.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {room.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Footer cố định */}
        <Footer tab="dashboard" />
      </div>
    </>
  );
};

export default UserDashboard;
