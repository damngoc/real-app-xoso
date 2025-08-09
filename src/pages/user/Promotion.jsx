import React, { useEffect, useState } from "react";
import {
  Home,
  DollarSign,
  Gift,
  Headphones,
  User,
  Star,
  Coins,
  Trophy,
  ArrowLeft,
  MoreVertical,
} from "lucide-react";
import { Footer } from "@/components/common/Footer";
import { useNavigate } from "react-router-dom";
import { userAPI } from "@/services/userApi";

const Promotion = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState([]);

  // Fetch promotions from API
  const fetchPromotions = async () => {
    try {
      const response = await userAPI.getPromotions();
      const data = response?.data?.result || [];
      setPromotions(data);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  };
  useEffect(() => {
    fetchPromotions();
  }, []);
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-red-500 shadow-xl">
        <div className="flex items-center justify-between p-4 text-white">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold tracking-wide">
            Khuyến mãi hấp dẫn
          </h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Daily Reward Banner - Using actual promotion image */}
        {promotions.length > 0 &&
          promotions.map((promotion) => (
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <div className="relative" key={promotion.id}>
                <img
                  src={promotion.image}
                  // src="https://duandaiphatsg.com/uploads/tienthuong.png"
                  alt={promotion.title}
                  className="w-full h-32"
                />
              </div>
              <div className="bg-white p-3">
                <p className="text-gray-700 font-medium">{promotion.title}</p>
              </div>
            </div>
          ))}

        {/* Additional content area */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="text-center text-gray-500">
            <Gift className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Thêm nhiều khuyến mãi hấp dẫn đang chờ bạn!</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <Footer />

      {/* Bottom padding to account for fixed navigation */}
      <div className="h-20"></div>
    </div>
  );
};

export default Promotion;
