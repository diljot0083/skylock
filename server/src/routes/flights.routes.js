import { Router } from "express";
import {
    searchFlights,
    getUpcomingFlightWindow,
    getFlightById,
    getFlightSeats
} from "../controllers/flights.controller.js";

const router = Router();

router.get("/search", searchFlights);
router.get("/debug/window", getUpcomingFlightWindow);
router.get("/:id", getFlightById);
router.get("/:id/seats", getFlightSeats);

export default router;