import crypto from "crypto";
import redisClient from "../config/redis.js";

const LOCK_TTL_MS = 2 * 60 * 1000;

redisClient.defineCommand("releaseLock", {
    numberOfKeys: 1,
    lua: `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `,
});

const lockKey = (seatId) => `lock:seat:${seatId}`;

export const acquireSeatLock = async (seatId, userId) => {
    const token = `${userId}:${crypto.randomUUID()}`;
    const result = await redisClient.set(lockKey(seatId), token, "PX", LOCK_TTL_MS, "NX");
    return result === "OK" ? token : null;
};

export const releaseSeatLock = async (seatId, token) => {
    const result = await redisClient.releaseLock(lockKey(seatId), token);
    return result === 1;
};

export const acquireSeatLocks = async (seatIds, userId) => {
    const acquired = new Map();

    for (const seatId of seatIds) {
        const token = await acquireSeatLock(seatId, userId);

        if (!token) {
            await releaseSeatLocks(acquired);
            const error = new Error(`Seat ${seatId} is currently held by another user`);
            error.statusCode = 409;
            error.conflictSeatId = seatId;
            throw error;
        }

        acquired.set(seatId, token);
    }

    return acquired;
};

export const releaseSeatLocks = async (locks) => {
    const entries = locks instanceof Map ? [...locks.entries()] : Object.entries(locks);

    await Promise.all(
        entries.map(async ([seatId, token]) => {
            try {
                await releaseSeatLock(seatId, token);
            } catch (error) {
                console.error(`[seatLock] failed to release lock for seat ${seatId}:`, error.message);
            }
        })
    );
};