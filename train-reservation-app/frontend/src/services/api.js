import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Passenger API
export const passengerAPI = {
  getAll: () => api.get('/passengers'),
  getById: (id) => api.get(`/passengers/${id}`),
  create: (data) => api.post('/passengers', data),
  update: (id, data) => api.put(`/passengers/${id}`, data),
  delete: (id) => api.delete(`/passengers/${id}`),
  getBookings: (id) => api.get(`/passengers/${id}/bookings`),
  getRailwayCard: (id) => api.get(`/passengers/${id}/card`),
  rechargeCard: (id, amount) => api.post(`/passengers/${id}/recharge`, { amount })
};

// Ticket API
export const ticketAPI = {
  getAll: () => api.get('/tickets'),
  getById: (id) => api.get(`/tickets/${id}`),
  book: (data) => api.post('/tickets', data),
  update: (id, data) => api.put(`/tickets/${id}`, data),
  cancel: (id) => api.put(`/tickets/${id}/cancel`)
};

// Train API
export const trainAPI = {
  getAll: () => api.get('/trains'),
  getById: (id) => api.get(`/trains/${id}`),
  create: (data) => api.post('/trains', data),
  search: (source, destination) => api.get('/trains/search', { 
    params: { source, destination } 
  })
};

// Route API
export const routeAPI = {
  getAll: () => api.get('/routes'),
  getById: (id) => api.get(`/routes/${id}`),
  create: (data) => api.post('/routes', data),
  update: (id, data) => api.put(`/routes/${id}`, data),
  delete: (id) => api.delete(`/routes/${id}`)
};

// Station API
export const stationAPI = {
  getAll: () => api.get('/stations'),
  getById: (id) => api.get(`/stations/${id}`),
  create: (data) => api.post('/stations', data),
  update: (id, data) => api.put(`/stations/${id}`, data),
  delete: (id) => api.delete(`/stations/${id}`)
};

// Smartcard API
export const smartcardAPI = {
  getAll: () => api.get('/smartcards'),
  getByPassenger: (id) => api.get(`/smartcards/passenger/${id}`),
  create: (data) => api.post('/smartcards', data),
  recharge: (id, amount) => api.post(`/smartcards/${id}/recharge`, { amount })
};

// Pilot API
export const pilotAPI = {
  getAll: () => api.get('/pilots'),
  getById: (id) => api.get(`/pilots/${id}`),
  create: (data) => api.post('/pilots', data),
  update: (id, data) => api.put(`/pilots/${id}`, data),
  delete: (id) => api.delete(`/pilots/${id}`)
};

// Schedule API
export const scheduleAPI = {
  getAll: () => api.get('/schedules'),
  getByTrain: (trainId) => api.get(`/schedules/train/${trainId}`),
  create: (data) => api.post('/schedules', data)
};

export default api;
