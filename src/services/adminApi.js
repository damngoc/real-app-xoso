import api from "./axiosAdmin";

export const adminAPI = {
  // api user
  getUsers: (params) => api.get('/admin/users', { params }),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  updateBalance: (id, data) => api.put(`/admin/users/${id}/balance`, data),

  // api transactions
  getTransactions: (params) => api.get('/admin/transactions', { params }),
  createTransaction: (data) => api.post('/admin/transactions', data),
  historyTransaction: (params) => api.get('/admin/history/transactions', { params }),
  updateTransaction: (id, data) => api.put(`/admin/transactions/${id}/process`, data),
  getTransactionPending: () => api.get('/admin/transactions/pending'),

  // api bet history
  getHistoryBets: (params) => api.get('/admin/history/bets', { params }),
  getBets: (params) => api.get('/admin/bets', { params }),

  // api rooms
  getRooms: (params) => api.get('/admin/rooms', { params }),
  createRoom: (data) => api.post('/admin/rooms', data),
  updateRoom: (id, data) => api.put(`/admin/rooms/${id}`, data),
  deleteRoom: (id) => api.delete(`/admin/rooms/${id}`),
  getSessionByRoom: (id, params) => api.get(`/admin/rooms/${id}/rounds`, { params }),

  // api promotions
  getPromotions: (params) => api.get('/admin/promotions', { params }),
  createPromotion: (data) => api.post('/admin/promotions', data),
  updatePromotion: (id, data) => api.put(`/admin/promotions/${id}`, data),
  deletePromotion: (id) => api.delete(`/admin/promotions/${id}`),

  // api banks
  getBanks: (params) => api.get('/admin/system-bank-accounts', { params }),
  createBank: (data) => api.post('/admin/system-bank-accounts', data),
  updateBank: (id, data) => api.put(`/admin/system-bank-accounts/${id}`, data),
  deleteBank: (id) => api.delete(`/admin/system-bank-accounts/${id}`),
};