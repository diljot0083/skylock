import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRY, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRY } from "../config/env.js";

export const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRY });
};

export const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRY });
};