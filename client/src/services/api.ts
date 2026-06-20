import axios from "axios";

const API_URL = "https://taskmanagner-devflow.onrender.com/api/auth";

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    return res.data;
  },

  register: async (name: string, email: string, password: string) => {
    const res = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
    });
    return res.data;
  },
};