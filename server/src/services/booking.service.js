import mongoose from "mongoose";
import crypto from "crypto";
import Seat from "../models/Seat.model.js";
import Booking from "../models/Booking.model.js";
import { acquireSeatLocks, releaseSeatLocks } from "../locks/seatLock.js";
import { emitSeatUpdate } from "../config/socket.js";

export const bookSeats = async ({ userId, flightId, seatIds }) => {

    const locks = await acquireSeatLocks(seatIds, userId);

    emitSeatUpdate(flightId, { seatIds, status: "locked" });

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const seats = await Seat.find({ _id: { $in: seatIds } })
            .session(session)
            .populate("fareClass");

        if (seats.length !== seatIds.length) {
            const error = new Error("One or more seats not found");
            error.statusCode = 404;
            throw error;
        }

        const invalidSeat = seats.find(
            (seat) => seat.flight.toString() !== flightId || seat.status !== "available"
        );
        if (invalidSeat) {
            const error = new Error(`Seat ${invalidSeat.seatNumber} is no longer available`);
            error.statusCode = 409;
            throw error;
        }

        const updateResult = await Seat.updateMany(
            { _id: { $in: seatIds }, status: "available" },
            { $set: { status: "booked" } },
            { session }
        );

        if (updateResult.modifiedCount !== seatIds.length) {
            const error = new Error("Some seats were booked by someone else before this could complete");
            error.statusCode = 409;
            throw error;
        }

        const totalPrice = seats.reduce((sum, seat) => {
            const { basePrice } = seat.fareClass.pricing;
            const { priceMultiplier, baseModifier } = seat.fareClass.priceModifiers;
            return sum + basePrice * priceMultiplier + baseModifier;
        }, 0);

        const confirmationCode = crypto.randomBytes(4).toString("hex").toUpperCase();

        const [booking] = await Booking.create(
            [
                {
                    user: userId,
                    flight: flightId,
                    seats: seatIds,
                    status: "Pending",
                    paymentStatus: "unpaid",
                    totalPrice,
                    confirmationCode,
                    paymentExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
                },
            ],
            { session }
        );

        await session.commitTransaction();

        emitSeatUpdate(flightId, { seatIds, status: "booked" });

        return booking;
    } catch (error) {
        await session.abortTransaction();

        emitSeatUpdate(flightId, { seatIds, status: "available" });

        throw error;
    } finally {
        session.endSession();
        await releaseSeatLocks(locks);
    }
};