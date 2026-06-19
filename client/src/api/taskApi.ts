import api from "./axiosClient";
import type { Task, TaskStatus, TaskPriority } from "../types";

export const taskApi = {
  // GET all tasks for a project
  getByProject: async (projectId: string): Promise<Task[]> => {
    const res = await api.get<{ tasks: Task[] }>(
      `/projects/${projectId}/tasks`
    );
    return res.data.tasks;
  },

  // CREATE task (FIXED - object based, matches your modal)
  create: async (data: {
    projectId: string;
    title: string;
    description?: string;
    priority: TaskPriority;
  }): Promise<Task> => {
    const { projectId, title, description = "", priority } = data;

    const res = await api.post<{ task: Task }>(
      `/projects/${projectId}/tasks`,
      {
        title,
        description,
        priority,
      }
    );

    return res.data.task;
  },

  // UPDATE task status
  updateStatus: async (
    taskId: string,
    status: TaskStatus
  ): Promise<Task> => {
    const res = await api.patch<{ task: Task }>(
      `/tasks/${taskId}/status`,
      { status }
    );
    return res.data.task;
  },

  // UPDATE full task
  update: async (
    taskId: string,
    data: Partial<Task>
  ): Promise<Task> => {
    const res = await api.patch<{ task: Task }>(
      `/tasks/${taskId}`,
      data
    );
    return res.data.task;
  },

  // DELETE task
  delete: async (taskId: string): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
  },
};
