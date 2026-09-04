import dotenv from "dotenv";
dotenv.config();

const required = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required env var: ${key}`);
    }
    return value;
};

export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || "development";

export const MONGO_URI = required("MONGO_URI");
export const REDIS_URL = required("REDIS_URL");
export const JWT_ACCESS_SECRET = required("JWT_ACCESS_SECRET");
export const JWT_REFRESH_SECRET = required("JWT_REFRESH_SECRET");
export const CLIENT_URL = required("CLIENT_URL");
export const GOOGLE_CLIENT_ID = required("GOOGLE_CLIENT_ID");
export const GOOGLE_CLIENT_SECRET = required("GOOGLE_CLIENT_SECRET");
export const GOOGLE_REDIRECT_URI = required("GOOGLE_REDIRECT_URI");

export const CORS_ORIGIN = required("CORS_ORIGIN");