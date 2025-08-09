import { Bell, ChevronDown, LogOut, Menu, User } from "lucide-react";
import React, { useState } from "react";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/constants";
import { removeAuthToken } from "@/utils/Auth";

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const { breadcrumb } = useBreadcrumb();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleProfileClick = () => {
    alert("Chuyển đến trang Profile");
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    // Xử lý đăng xuất
    removeAuthToken();

    toast.success("Đăng xuất thành công");
    // Chuyển hướng về trang đăng nhập
    navigate(ROUTES.LOGIN_ADMIN);
    setIsDropdownOpen(false);
  };
  return (
    <header className="bg-white/90 backdrop-blur-lg shadow-sm border-b border-white/20">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 lg:hidden md:hidden transition-colors duration-200"
          >
            <Menu size={20} />
          </button>
          <div className="ml-4 lg:ml-0">
            <nav
              className="flex items-center space-x-2 mb-2 text-sm text-gray-500"
              aria-label="Breadcrumb"
            >
              {breadcrumb && breadcrumb.length > 0 ? (
                breadcrumb.map((item, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span>›</span>}
                    {item.href && !item.active ? (
                      <a
                        href={item.href}
                        className="hover:text-indigo-600 transition-colors duration-150 flex items-center"
                      >
                        {item.icon && <span className="mr-1">{item.icon}</span>}
                        {item.label}
                      </a>
                    ) : (
                      <span
                        className={
                          item.active
                            ? "text-indigo-600 font-medium flex items-center"
                            : "flex items-center"
                        }
                      >
                        {item.icon && <span className="mr-1">{item.icon}</span>}
                        {item.label}
                      </span>
                    )}
                  </React.Fragment>
                ))
              ) : (
                // fallback nếu không truyền breadcrumb
                <>
                  <span>🏠 Home</span>
                  <span>›</span>
                  <span>Theme</span>
                  <span>›</span>
                  <span className="text-indigo-600 font-medium">
                    Typography
                  </span>
                </>
              )}
            </nav>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
            <Bell size={20} />
          </button>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">A</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    Nguyễn Văn A
                  </p>
                  <p className="text-sm text-gray-500">nguyenvana@email.com</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <User className="w-4 h-4" />
                    <span>Xem Profile</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">A</span>
          </div> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
