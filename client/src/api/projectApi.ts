import api from './axiosClient';
import type { Project } from '../types';

export const projectApi = {
  getAll: async (): Promise<Project[]> => {
    const res = await api.get<{ projects: Project[] }>('/projects');
    return res.data.projects;
  },

  getById: async (id: string): Promise<Project> => {
    const res = await api.get<{ project: Project }>(`/projects/${id}`);
    return res.data.project;
  },

  create: async (name: string, description: string): Promise<Project> => {
    const res = await api.post<{ project: Project }>('/projects', { name, description });
    return res.data.project;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};
