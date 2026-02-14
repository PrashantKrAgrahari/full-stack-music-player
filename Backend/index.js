import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import router from "./routes/authRoutes.js";
import songRouter from "./routes/songRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ====================================================
// ✅ FIXED CORS SETUP (Copy this exactly)
// ====================================================
app.use(cors({
    origin: true,  // This automatically allows the frontend URL
    credentials: true
}));
// ====================================================

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