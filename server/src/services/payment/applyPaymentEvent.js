import mongoose from "mongoose";
import Booking from "../../models/Booking.js";
import Seat from "../../models/Seat.js";

export async function applyPaymentEvent({ type, orderId, paymentId }) {
    if (type === "captured") {
        await Booking.findOneAndUpdate(
            { paymentOrderId: orderId, paymentStatus: { $ne: "paid" } },
            { $set: { status: "Confirmed", paymentStatus: "paid", paymentId } }
        );
        return;
    }

    if (type === "failed") {
        const session = await mongoose.startSession();
        try {
            await session.withTransaction(async () => {
                const booking = await Booking.findOneAndUpdate(
                    { paymentOrderId: orderId, status: "Pending" },
                    { $set: { status: "Failed", paymentStatus: "unpaid", paymentId } },
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
    }
}