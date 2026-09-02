import Redis from "ioredis";
import { REDIS_URL } from "./env.js";

const redisClient = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
    lazyConnect: true,
});

redisClient.on("connect", () => {
    console.log("[redis] TCP connection established");
});

redisClient.on("ready", () => {
    console.log("[redis] client ready to accept commands");
});

redisClient.on("error", (err) => {
    console.error("[redis] connection error:", err.message);
});

redisClient.on("reconnecting", (delay) => {
    console.warn(`[redis] reconnecting in ${delay}ms`);
});

redisClient.on("close", () => {
    console.warn("[redis] connection closed");
});

export const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error("[redis] initial connection failed:", err.message);
        throw err;
    }
};

export default redisClient;