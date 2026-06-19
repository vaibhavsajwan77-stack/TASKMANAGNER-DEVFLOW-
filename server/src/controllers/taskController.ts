import { Response } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/auth';

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.query.projectId as string | undefined;
    const filter = projectId ? { project: projectId } : {};
    const tasks = await Task.find(filter).populate('assignee', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, project, assignee, priority, dueDate } = req.body;
    const task = await Task.create({ title, description, project, assignee, priority, dueDate });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};