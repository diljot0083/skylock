import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import passport from "./config/passport.js";
import flightsRouter from './routes/flights.routes.js';
import { CORS_ORIGIN } from "./config/env.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

export const app = express();

app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())
app.use("/api/flights", flightsRouter);
app.use(errorMiddleware);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "SkyLock API is running"
    });
});

app.use("/api/auth", authRouter);