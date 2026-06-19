import api from './api';

export const getProjects = async () => {
  const res = await api.get('/projects');
  return res.data;
};

export const createProject = async (name: string, description: string) => {
  const res = await api.post('/projects', { name, description });
  return res.data;
};

export const updateProject = async (id: string, data: any) => {
  const res = await api.put(`/projects/${id}`, data);
  return res.data;
};

export const deleteProject = async (id: string) => {
  const res = await api.delete(`/projects/${id}`);
  return res.data;
};