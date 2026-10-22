import { PORT, CLIENT_URL } from "./config/env.js";
import "./models/index.js";
import http from "http";
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import { initSocket } from "./config/socket.js";
import { initQueues, closeQueues } from "./queues/queues.js";
import { startWorkers, closeWorkers } from "./queues/workers.js";
import { app } from "./app.js";

const httpServer = http.createServer(app);

connectDB()
    .then(connectRedis)
    .then(() => initSocket(httpServer, CLIENT_URL))
    .then(() => {
        initQueues();
        startWorkers();
    })
    .then(() => {
        httpServer.listen(PORT, () => {
            console.log(`Server listening on port: ${PORT}`)
        })
    })
    .catch((error) => {
        console.log("Startup failed:", error);
        process.exit(1);
    })

const shutdown = async (signal) => {
    console.log(`${signal} received, shutting down`);
    try {
        await closeWorkers();
        await closeQueues();
    } catch (err) {
        console.error("Shutdown error:", err.message);
    }
    process.exit(0);
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));