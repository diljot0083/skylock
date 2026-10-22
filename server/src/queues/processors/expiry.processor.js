import { failBookingAndReleaseSeats } from "../../services/payment/applyPaymentEvent.js";

export const processBookingExpiry = async (job) => {
    const { bookingId } = job.data;

    const booking = await failBookingAndReleaseSeats({ _id: bookingId });

    console.log(
        booking
            ? `[expiry] booking ${bookingId} expired, released ${booking.seats.length} seat(s)`
            : `[expiry] booking ${bookingId} no longer pending, skipped`
    );
};