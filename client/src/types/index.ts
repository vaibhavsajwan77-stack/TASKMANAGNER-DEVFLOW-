// ── Auth ─────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// ── Project ───────────────────────────────────────────────
export interface Project {
  _id: string;
  name: string;
  description: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

// ── Task ──────────────────────────────────────────────────
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  project: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ── API Responses ─────────────────────────────────────────
export interface ApiError {
  message: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  message: string;
}

export interface RegisterResponse {
  token: string;
  user: User;
  message: string;
}
