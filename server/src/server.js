import { PORT, CLIENT_URL } from "./config/env.js";
import "./models/index.js";
import http from "http";
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import { initSocket } from "./config/socket.js";
import { app } from "./app.js";

const httpServer = http.createServer(app);

connectDB()
    .then(connectRedis)
    .then(() => initSocket(httpServer, CLIENT_URL))
    .then(() => {
        httpServer.listen(PORT, () => {
            console.log(`Server listening on port: ${PORT}`)
        })
    })
    .catch((error) => {
        console.log("Startup failed:", error);
        process.exit(1);
    })