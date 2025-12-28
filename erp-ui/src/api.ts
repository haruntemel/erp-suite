import axios from "axios";

// Eğer Vite proxy kullanıyorsan sadece "/api" yazabilirsin.
// Yoksa backend portunu tam yaz: "http://localhost:5217/api"
const api = axios.create({
  baseURL: "http://localhost:5217/api",
});

// Request interceptor → her isteğe token ekler
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;