import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

console.log("🔍 Starting server...");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", PORT);
console.log("MONGODB_URI exists:", !!MONGODB_URI);

// -------------------------
// CORS (FIXED ONLY)
// -------------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://devflow-web-liard.vercel.app",
  "https://taskmangerorg.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS BLOCKED:", origin);
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ FIX: preflight must always be allowed
app.options("*", cors());

// -------------------------
// BODY PARSERS (UNCHANGED)
// -------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------
// LOGGER (UNCHANGED)
// -------------------------
app.use((req, _res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});

// -------------------------
// ROUTES (UNCHANGED)
// -------------------------
import authRoutes from "./routes/auth";
import projectRoutes from "./routes/projects";
import taskRoutes from "./routes/tasks";

app.get("/", (_req, res) => {
  res.send("🚀 DevFlow API Running");
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "DevFlow API is running!",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// -------------------------
// MONGODB (FIXED ONLY)
// -------------------------
async function startServer() {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is missing");
    }

    console.log("🔌 Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
    });

    console.log("✅ MongoDB Connected!");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err: any) {
    console.error("❌ STARTUP FAILED");
    console.error(err.message);
    process.exit(1);
  }
}

startServer();