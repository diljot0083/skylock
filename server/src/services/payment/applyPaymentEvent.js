import mongoose from "mongoose";
import Booking from "../../models/Booking.model.js";
import Seat from "../../models/Seat.model.js";
import { emitSeatUpdate } from "../../config/socket.js";
import { enqueueBookingConfirmation } from "../../queues/queues.js";

export async function failBookingAndReleaseSeats(filter, extraSet = {}) {
    const session = await mongoose.startSession();
    let booking = null;
    try {
        await session.withTransaction(async () => {
            booking = null;
            booking = await Booking.findOneAndUpdate(
                { ...filter, status: "Pending" },
                { $set: { status: "Failed", paymentStatus: "unpaid", ...extraSet } },
                { new: true, session }
            );
            if (booking) {
                await Seat.updateMany(
                    { _id: { $in: booking.seats }, status: "booked" },
                    { $set: { status: "available" } },
                    { session }
                );
            }
        });
    } finally {
        session.endSession();
    }

    if (booking) {
        emitSeatUpdate(booking.flight, { seatIds: booking.seats, status: "available" });
    }
    return booking;
}

export async function applyPaymentEvent({ type, orderId, paymentId }) {
    if (type === "captured") {
        const updated = await Booking.findOneAndUpdate(
            { paymentOrderId: orderId, status: "Pending", paymentStatus: { $ne: "paid" } },
            { $set: { status: "Confirmed", paymentStatus: "paid", paymentId } }
        );

        if (updated) {
            enqueueBookingConfirmation(updated._id).catch((err) =>
                console.error("[queue] confirmation enqueue failed:", err.message)
            );
        } else {
            const existing = await Booking.findOne({ paymentOrderId: orderId }).select("status");
            if (existing?.status === "Failed") {
                console.error(
                    `[payment] CAPTURED AFTER EXPIRY — order ${orderId}, booking ${existing._id} needs refund`
                );
            }
        }
        return;
    }

    if (type === "failed") {
        await failBookingAndReleaseSeats({ paymentOrderId: orderId }, { paymentId });
    }
}