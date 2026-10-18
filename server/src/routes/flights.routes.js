import { Router } from "express";
import { NODE_ENV } from "../config/env.js";
import {
    searchFlights,
    getUpcomingFlightWindow,
    getFlightById,
    getFlightSeats
} from "../controllers/flights.controller.js";

const router = Router();

router.get("/search", searchFlights);
if (NODE_ENV !== "production") router.get("/debug/window", getUpcomingFlightWindow);
router.get("/:id", getFlightById);
router.get("/:id/seats", getFlightSeats);

export default router;