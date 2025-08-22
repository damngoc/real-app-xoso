import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/constants";
import "@/css/user/Login.scss";
import { authAPI } from "@/services/authApi";
import { toast } from "react-toastify";
import { setUserToken } from "@/utils/auth";
import { setCurrentRole } from "@/utils/auth";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  const togglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      toast.error("Vui lòng nhập đầy đủ thông tin đăng nhập.");
      return;
    }
    try {
      const response = await authAPI.loginUser(credentials);
      if (response?.status === 200) {
        setCurrentRole("user");
        setUserToken(response?.data?.result?.accessToken);
        toast.success("Đăng nhập thành công!");
        navigate(ROUTES.DASHBOARD);
      } else {
        toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate(ROUTES.FORGOT_PASSWORD);
  };

  return (
    <>
      <title>Đăng Nhập</title>

      <div className="login-container">
        <div className="header-login">
          <h1>Đăng Nhập</h1>
          <p>Chào mừng bạn quay trở lại!</p>
        </div>
        <form id="loginForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Tài khoản</label>
            <div className="input-wrapper">
              <i>👤</i>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Nhập tài khoản của bạn"
                value={credentials.username}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="input-wrapper">
              <i>🔒</i>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Nhập mật khẩu"
                value={credentials.password}
                onChange={handleChange}
              />
              <span className="password-toggle" onClick={togglePassword}>
                {showPassword ? <EyeOff /> : <Eye />}
              </span>
            </div>
          </div>
          <div className="forgot-password">
            <a href="#" onClick={handleForgotPassword}>
              Quên mật khẩu?
            </a>
          </div>
          <button type="submit" className="login-btn">
            Đăng Nhập
          </button>
        </form>
        <div className="signup-link">
          <p>
            Chưa có tài khoản?
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate(ROUTES.REGISTER);
              }}
              style={{ marginLeft: "5px" }}
            >
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
