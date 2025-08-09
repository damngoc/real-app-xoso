import api from "./axiosAdmin";
import userApi from "./axiosUser";

export const authAPI = {
  // admin
  loginAdmin: (credentials) => api.post('/admin/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logoutAdmin: () => api.post('/admin/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  // user
  loginUser: (credentials) => userApi.post('/user/auth/login', credentials),
  logoutUser: () => userApi.post('/user/auth/logout'),
  registerUser: (userData) => userApi.post('/user/auth/register', userData),
};