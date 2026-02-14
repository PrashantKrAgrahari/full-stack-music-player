import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import router from "./routes/authRoutes.js";
import songRouter from "./routes/songRoutes.js";

dotenv.config(); // Simplified config call

const app = express();
const PORT = process.env.PORT || 5001;

// 1. Connect your Database
connectDB();

app.use(express.json());

// 2. Updated CORS for Production
// Once you deploy your frontend to Vercel, add that URL to this array
app.use(cors({
    origin: [
        "http://localhost:5173", 
        "https://raag-music-player.vercel.app/" // REPLACE with your actual Vercel URL later
    ],
    credentials: true
}));

// 3. Health Check Route (Useful for Render to see if your app is "Alive")
app.get("/", (req, res) => {
    res.status(200).json({ message: "Music App Backend is running" });
});

// Routes
app.use("/api/songs", songRouter);
app.use("/api/auth", router);

// 4. Bind to 0.0.0.0 for Render compatibility
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on Port ${PORT}`);
});