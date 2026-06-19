import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// ✅ safer token generator
const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

// ================= REGISTER =================
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // 🔴 safety: req.body guard (prevents undefined crash)
    if (!req.body) {
      return res.status(400).json({ message: "Request body missing" });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id.toString());

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);

    return res.status(500).json({
      message: "Server error during registration",
    });
  }
};

// ================= LOGIN =================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 🔴 safety check
    if (!req.body) {
      return res.status(400).json({ message: "Request body missing" });
    }

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔴 safety: prevent crash if method missing
    if (!user.comparePassword) {
      return res.status(500).json({ message: "Server auth error" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id.toString());

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return res.status(500).json({
      message: "Server error during login",
    });
  }
};
// ================= GET ME =================
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);

  } catch (err) {
    console.error("GETME ERROR:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};