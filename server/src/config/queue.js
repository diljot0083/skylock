import { redisClient } from "./redis.js";

export const QUEUE_NAMES = Object.freeze({
    NOTIFICATIONS: "notifications",
    BOOKING_EXPIRY: "booking-expiry",
});


export const createBullConnection = (label) => {
    const conn = redisClient.duplicate({
        lazyConnect: false,
        maxRetriesPerRequest: null,
    });
    conn.on("error", (err) =>
        console.error(`[bullmq:${label}] redis error:`, err.message)
    );
    return conn;
};

export const defaultJobOptions = {
    attempts: 5,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: { age: 3600, count: 500 },
    removeOnFail: { age: 7 * 24 * 3600 },
};