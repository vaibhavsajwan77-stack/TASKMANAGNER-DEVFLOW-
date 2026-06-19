"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const getTasks = async (req, res) => {
    try {
        const projectId = req.query.projectId;
        const filter = projectId ? { project: projectId } : {};
        const tasks = await Task_1.default.find(filter).populate('assignee', 'name email');
        res.json(tasks);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getTasks = getTasks;
const createTask = async (req, res) => {
    try {
        const { title, description, project, assignee, priority, dueDate } = req.body;
        const task = await Task_1.default.create({ title, description, project, assignee, priority, dueDate });
        res.status(201).json(task);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    try {
        const task = await Task_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task)
            return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    try {
        const task = await Task_1.default.findByIdAndDelete(req.params.id);
        if (!task)
            return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteTask = deleteTask;
