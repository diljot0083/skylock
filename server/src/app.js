import express from 'express';
import cors from 'cors';

export const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "SkyLock API is running"
    });
});