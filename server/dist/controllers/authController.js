"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// ✅ safer token generator
const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return jsonwebtoken_1.default.sign({ userId }, secret, { expiresIn: '7d' });
};
// ================= REGISTER =================
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // ✅ validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existing = await User_1.default.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const user = await User_1.default.create({ name, email, password });
        const token = generateToken(user._id.toString());
        return res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (err) {
        console.error("REGISTER ERROR:", err);
        return res.status(500).json({
            message: 'Server error during registration'
        });
    }
};
exports.register = register;
// ================= LOGIN =================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // ✅ validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // ⚠️ make sure comparePassword exists in schema
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(user._id.toString());
        return res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (err) {
        console.error("LOGIN ERROR:", err);
        return res.status(500).json({
            message: 'Server error during login'
        });
    }
};
exports.login = login;
// ================= GET ME =================
const getMe = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json(user);
    }
    catch (err) {
        console.error("GETME ERROR:", err);
        return res.status(500).json({
            message: 'Server error'
        });
    }
};
exports.getMe = getMe;
