import axios from "axios";

const api = axios.create({
  baseURL: "https://taskmanagner-devflow.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("devflow_token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

