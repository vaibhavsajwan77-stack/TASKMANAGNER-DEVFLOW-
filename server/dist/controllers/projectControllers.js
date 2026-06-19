"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjects = void 0;
const Project_1 = __importDefault(require("../models/Project"));
const getProjects = async (req, res) => {
    try {
        const projects = await Project_1.default.find({
            $or: [{ owner: req.userId }, { members: req.userId }]
        }).populate('owner', 'name email');
        res.json(projects);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getProjects = getProjects;
const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const project = await Project_1.default.create({ name, description, owner: req.userId, members: [req.userId] });
        res.status(201).json(project);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createProject = createProject;
const updateProject = async (req, res) => {
    try {
        const project = await Project_1.default.findOneAndUpdate({ _id: req.params.id, owner: req.userId }, req.body, { new: true });
        if (!project)
            return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    try {
        const project = await Project_1.default.findOneAndDelete({ _id: req.params.id, owner: req.userId });
        if (!project)
            return res.status(404).json({ message: 'Project not found' });
        res.json({ message: 'Project deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteProject = deleteProject;
