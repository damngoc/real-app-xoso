import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/constants";
import "@/css/user/Register.scss";
import { toast } from "react-toastify";
import { authAPI } from "@/services/authApi";
import { Eye, EyeOff } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();

  // Function to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    // Handle registration logic here
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    // check email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Email không hợp lệ!");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      return;
    }
    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    try {
      const response = await authAPI.registerUser({
        username,
        email,
        password,
        password_confirmation: confirmPassword,
      });
      if (response?.status === 201) {
        toast.success("Đăng ký thành công!");
        navigate(ROUTES.LOGIN);
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.error.message || "Đăng ký thất bại!";
        toast.error(errorMessage);
        return;
      }
      toast.error("Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <>
      <title>Đăng Ký Tài Khoản</title>
      <div className="bg-shapes">
        <div className="shape" />
        <div className="shape" />
        <div className="shape" />
      </div>
      <div className="signup-container">
        <div className="header-register">
          <h1>Đăng Ký Tài Khoản</h1>
          <p>Tạo tài khoản mới để bắt đầu hành trình của bạn</p>
        </div>
        <form id="signupForm" onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="username">Tài khoản đăng nhập</label>
            <div className="input-wrapper">
              <span className="icon">👤</span>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Nhập tên tài khoản"
                required=""
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <span className="icon">📧</span>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Nhập email của bạn"
                required=""
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="input-wrapper">
              <span className="icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Tạo mật khẩu mạnh"
                onChange={(e) => {
                  const passwordInput = e.target;
                  passwordInput.type = "text";
                }}
              />
              <span className="password-toggle" onClick={togglePassword}>
                {showPassword ? <EyeOff /> : <Eye />}
              </span>
            </div>
            <div className="password-strength">
              <div className="strength-bar">
                <div className="strength-fill" id="strengthFill" />
              </div>
              <span id="strengthText">Độ mạnh mật khẩu</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <div className="input-wrapper">
              <span className="icon">🔐</span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="password_confirmation"
                placeholder="Nhập lại mật khẩu"
              />
              <span className="password-toggle" onClick={toggleConfirmPassword}>
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </span>
            </div>
          </div>
          <div className="terms-checkbox">
            <input type="checkbox" id="termsAgree" required="" />
            <label htmlFor="termsAgree">
              Tôi đồng ý với
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  marginLeft: "5px",
                  marginRight: "5px",
                  textDecoration: "none",
                }}
              >
                Điều khoản sử dụng
              </a>
              và
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{ marginLeft: "5px", textDecoration: "none" }}
              >
                Chính sách bảo mật
              </a>
            </label>
          </div>
          <button type="submit" className="signup-btn" id="signupBtn">
            <span className="loading" id="loadingSpinner" />
            <span id="btnText">Đăng Ký</span>
          </button>
        </form>

        <div className="login-link">
          <p>
            Đã có tài khoản?
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate(ROUTES.LOGIN);
              }}
              style={{ marginLeft: "5px", textDecoration: "none" }}
            >
              Đăng nhập ngay
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
