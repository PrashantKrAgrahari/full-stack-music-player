import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Ensure you are finding the user correctly
      req.user = await User.findById(decoded.id).select("-password");
      
      if (!req.user) {
        return res.status(401).json({ message: "User no longer exists" });
      }

      next();
    } catch (error) {
      console.error("JWT Verification Error:", error.message); // THIS LOG IS KEY
      return res.status(401).json({ message: "Token failed: " + error.message });
    }
  } else {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};