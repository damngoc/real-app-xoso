export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'My App';
export const NODE_ENV = import.meta.env.VITE_NODE_ENV || 'development';

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  LOGIN_ADMIN: '/admin/login',
  DASHBOARD: '/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard',
  USER_MANAGEMENT: '/admin/users',
  DEPOSIT_MANAGEMENT: '/admin/deposit',
  HISTORY_DEPOSIT_MANAGEMENT: '/admin/history-deposit',
  ORDER_MANAGEMENT: '/admin/orders',
  HISTORY_ORDER_MANAGEMENT: '/admin/history-order',
  HISTORY_SESSION_MANAGEMENT: '/admin/history-session',
  BANK_MANAGEMENT: '/admin/banks',
  ROOM_MANAGEMENT: '/admin/room',
  PROMOTION_MANAGEMENT: '/admin/promotions',
  PROFILE: '/profile',
  BANK: '/bank',
  ADD_BANK: '/add-bank',
  DEPOSIT: '/deposit',
  PROMOTION: '/promotion',
  CUSTOMER_SERVICE: '/customer-service',
  GAME: `/game/:roomId`,
  WITHDRAW: '/withdraw',
  TRANSACTION_DETAILS: '/transaction-details',
  ORDERS_HISTORY: '/orders-history',
  LOTTERY_HISTORY: '/lottery-history',
  MY_ACCOUNT: '/my-account',
  CHANGE_PASSWORD: '/change-password',
  FORGOT_PASSWORD: '/forgot-password',
};