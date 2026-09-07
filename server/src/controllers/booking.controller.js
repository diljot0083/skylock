import { bookSeats } from "../services/booking.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createBooking = asyncHandler(async (req, res) => {
    const { flightId, seatIds } = req.body;
    const userId = req.user._id;

    if (!flightId || !Array.isArray(seatIds) || seatIds.length === 0) {
        return res.status(400).json({
            success: false,
            message: "flightId and a non-empty seatIds array are required"
        });
    }

    const uniqueSeatIds = [...new Set(seatIds.map(String))];
    if (uniqueSeatIds.length !== seatIds.length) {
        return res.status(400).json({
            success: false,
            message: "Duplicate seat IDs in request"
        });
    }

    const booking = await bookSeats({ userId, flightId, seatIds: uniqueSeatIds });

    res.status(201).json({
        success: true,
        message: "Booking created successfully",
        booking
    });
});