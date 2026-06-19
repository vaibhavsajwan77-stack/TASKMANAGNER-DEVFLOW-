import api from './axiosClient';
import type { User } from '../types';

type AuthResponse = {
  token: string;
  user: User;
};

export const authApi = {
  login: async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', {
      email,
      password,
    });

    const payload = res.data?.data ?? res.data;

    if (!payload?.token || !payload?.user) {
      console.error('LOGIN RESPONSE:', res.data);
      throw new Error('Invalid login response from server');
    }

    return payload;
  },

  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const res = await api.post('/auth/register', {
      name,
      email,
      password,
    });

    const payload = res.data?.data ?? res.data;

    if (!payload?.token || !payload?.user) {
      console.error('REGISTER RESPONSE:', res.data);
      throw new Error('Invalid register response from server');
    }

    return payload;
  },

  getMe: async (): Promise<User> => {
  const token = localStorage.getItem('devflow_token');

  const res = await api.get('/auth/me', {
    withCredentials: true,
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : undefined,
  });

  return res.data?.user ?? res.data;
  },
};