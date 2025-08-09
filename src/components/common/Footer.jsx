import React from "react";
import { ArrowUpRight, Gift, HelpCircle, Home, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/config/constants";

/**
 * Footer nhận prop activeTab (ưu tiên), nếu không thì tự xác định từ location.pathname
 */
export const Footer = ({ activeTab }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Map pathname sang tab id
  const getTabFromPath = (pathname) => {
    if (pathname.startsWith("/dashboard")) return "home";
    if (pathname.startsWith("/deposit")) return "deposit";
    if (pathname.startsWith("/promotion")) return "promotion";
    if (pathname.startsWith("/customer-service")) return "support";
    if (pathname.startsWith("/profile")) return "profile";
    return "home";
  };

  // Nếu truyền activeTab thì ưu tiên, nếu không thì lấy từ pathname
  const currentTab = activeTab || getTabFromPath(location.pathname);

  const menuItems = [
    {
      id: "home",
      label: "TRANG CHỦ",
      icon: Home,
      color: "#ff6b6b",
      route: ROUTES.DASHBOARD,
    },
    {
      id: "deposit",
      label: "NẠP TIỀN",
      icon: ArrowUpRight,
      color: "#4ecdc4",
      route: ROUTES.DEPOSIT,
    },
    {
      id: "promotion",
      label: "KHUYẾN MÃI",
      icon: Gift,
      color: "#45b7d1",
      route: ROUTES.PROMOTION,
    },
    {
      id: "support",
      label: "HỖ TRỢ",
      icon: HelpCircle,
      color: "#96ceb4",
      route: ROUTES.CUSTOMER_SERVICE,
    },
    {
      id: "profile",
      label: "CÁ NHÂN",
      icon: User,
      color: "#feca57",
      route: ROUTES.PROFILE,
    },
  ];

  const handleTabClick = (tabId, route) => {
    navigate(route);
    // Không cần setActiveTab, active sẽ tự động theo route
  };

  return (
    <footer>
      {/* Footer cố định */}
      <div className="footer-bottom flex h-[80px] fixed bottom-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center w-full max-w-md mx-auto">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <div
                key={item.id}
                className={`flex flex-col items-center space-y-1 cursor-pointer ${
                  isActive ? "text-primary" : "text-gray-600"
                }`}
                onClick={() => handleTabClick(item.id, item.route)}
              >
                <div
                  className={`w-8 h-8 ${
                    isActive ? "bg-green-100" : "bg-gray-100"
                  } rounded-full flex items-center justify-center transition-all`}
                  style={isActive ? { color: item.color } : {}}
                >
                  <item.icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-xs font-medium ${
                    isActive ? "text-[color:var(--tw-text-primary)]" : ""
                  }`}
                  style={isActive ? { color: item.color } : {}}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </footer>
  );
};
