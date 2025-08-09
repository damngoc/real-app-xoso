import api from "./axiosUser";

export const userAPI = {
  // User profile management
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  changePassword: (data) => api.post('/user/profile/change-password', data),
  forgotPassword: (data) => api.post('/user/auth/forgot-password', data),

  // User transactions
  transactionDeposit: (data) => api.post('/user/transactions/deposit', data),
  transactionWithdraw: (data) => api.post('/user/transactions/withdraw', data),
  getTransactionHistory: (params) => api.get('/user/transactions/history', { params }),

  // User bet history
  getBetHistory: (params) => api.get('/user/profile/bet-history', { params }),
  geRoomBetHistory: (roomId, params) => api.get(`/rooms/${roomId}/bet-history`, { params }),
  getRooms: () => api.get('/rooms'),
  getRoomDetails: (roomId) => api.get(`/rooms/${roomId}`),
  getRoomCurrentRound: (roomId) => api.get(`/rooms/${roomId}/current-round`),
  getRoomRounds: (roomId, params) => api.get(`/rooms/${roomId}/rounds`, { params }),
  placeBets: (data) => api.post(`/rooms/place-bets`, data),
  getResultsAllRooms: (params) => api.get('/results/all-rooms', { params }),

  // Bank account system
  getSystemBank: () => api.get('/system-bank-accounts/active'), 

  // Promotion system
  getPromotions: () => api.get('/user/promotions/active'),
};