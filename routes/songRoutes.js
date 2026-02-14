import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
  getPlayListByTag, 
  getSongs, 
  toggleFavourite, 
  searchSongs // 1. Added the new import
} from "../controllers/songController.js";

const songRouter = express.Router();

// Public routes
songRouter.get("/", getSongs);

// 2. Add search BEFORE the :tag route to avoid conflicts
songRouter.get("/search", searchSongs); 

songRouter.get("/playlistByTag/:tag", getPlayListByTag);

// Protected routes
songRouter.post("/favourite", protect, toggleFavourite);
songRouter.get("/favourites", protect, (req, res) => {
    res.json(req.user.favourites);
});

export default songRouter;