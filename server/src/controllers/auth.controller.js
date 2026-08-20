import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Access token missing" });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired access token" });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
        return res.status(401).json({ success: false, message: "User no longer exists" });
    }

    req.user = user;
    next();
});