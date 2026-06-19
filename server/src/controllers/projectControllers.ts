import { Response } from 'express';
import Project from '../models/Project';
import { AuthRequest } from '../middleware/auth';

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.userId }, { members: req.userId }]
    }).populate('owner', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({ name, description, owner: req.userId, members: [req.userId] });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      req.body,
      { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};