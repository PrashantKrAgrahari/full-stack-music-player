import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import router from "./routes/authRoutes.js";
import songRouter from "./routes/songRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. THE MANUAL CORS HANDSHAKE (MUST BE FIRST) ---
app.use((req, res, next) => {
    // Replace with your exact frontend URL
    const origin = req.headers.origin;
    const allowedOrigins = ["https://raag-music-player.vercel.app", "http://localhost:5173"];
    
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");

    // Immediately respond to the 'OPTIONS' pre-check handshake
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});

// --- 2. Standard Middleware ---
app.use(cors({
    origin: ["https://raag-music-player.vercel.app", "http://localhost:5173"],
    credentials: true
}));





app.use(express.json());

// Connect to Database
connectDB();

// Test Route
app.get("/", (req, res) => {
    res.send("Backend is working!");
});

// Routes
app.use("/api/songs", songRouter);
app.use("/api/auth", router);

// Error Handling (Prevents server crashes)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});