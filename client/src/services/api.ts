import axios from "axios";

console.log("ENV API URL:", import.meta.env.VITE_API_URL);
console.log("BASE URL:", import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: "https://taskmanagner-devflow.onrender.com/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("devflow_token");

  if (token) {
    config.headers = config.headers ?? {};   // ✅ FIX ADDED
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;