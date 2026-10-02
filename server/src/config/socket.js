import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { redisClient } from "./redis.js";
import { registerSeatSockets } from "../sockets/seatSockets.js";

let io;

export async function initSocket(httpServer, clientUrl) {
    io = new Server(httpServer, {
        cors: { origin: clientUrl, credentials: true },
    });

    const pubClient = redisClient.duplicate({ lazyConnect: false });
    const subClient = redisClient.duplicate({ lazyConnect: false });
    io.adapter(createAdapter(pubClient, subClient));

    registerSeatSockets(io);

    return io;
}

export function getIO() {
    if (!io) throw new Error("Socket.io accessed before initSocket() ran");
    return io;
}

export function emitSeatUpdate(flightId, { seatIds, status }) {
    getIO().to(`flight:${flightId}`).emit("seat:update", { seatIds, status });
}