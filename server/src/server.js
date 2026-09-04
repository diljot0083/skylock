import { PORT } from "./config/env.js";
import "./models/index.js";
import connectDB from "./config/db.js";
import redisClient, { connectRedis } from "./config/redis.js";
import { app } from "./app.js";

connectDB()
    .then(connectRedis)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server listening on port: ${PORT}`)
        })
    })
    .catch((error) => {
        console.log("Startup failed:", error);
        process.exit(1);
    })