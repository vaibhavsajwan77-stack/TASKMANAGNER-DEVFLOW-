"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log("🔍 Starting server...");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is missing!");
    process.exit(1);
}
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://devflow-web-liard.vercel.app",
    "https://taskmangerorg.vercel.app",
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow Postman, server-to-server requests, etc.
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        console.log("❌ CORS blocked:", origin);
        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
const auth_1 = __importDefault(require("./routes/auth"));
const projects_1 = __importDefault(require("./routes/projects"));
const tasks_1 = __importDefault(require("./routes/tasks"));
app.get("/", (_req, res) => {
    res.send("🚀 DevFlow API Running");
});
app.get("/api/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "DevFlow API is running!",
    });
});
app.use("/api/auth", auth_1.default);
app.use("/api/projects", projects_1.default);
app.use("/api/tasks", tasks_1.default);
async function startServer() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose_1.default.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log("✅ MongoDB Connected!");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    }
    catch (err) {
        console.error("❌ STARTUP FAILED");
        console.error("Error:", err.message);
        process.exit(1);
    }
}
startServer();
