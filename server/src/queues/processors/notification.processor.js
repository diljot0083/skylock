import { UnrecoverableError } from "bullmq";
import Booking from "../../models/Booking.model.js";
import { sendEmail } from "../../services/notification/email.service.js";

export const processNotification = async (job) => {
    switch (job.name) {
        case "booking-confirmed": {
            const booking = await Booking.findById(job.data.bookingId).populate(
                "user",
                "email fullName"
            );
            if (!booking) {
                throw new UnrecoverableError(`Booking ${job.data.bookingId} not found`);
            }
            if (booking.status !== "Confirmed") return;

            await sendEmail({
                to: booking.user.email,
                subject: `Booking confirmed — ${booking.confirmationCode}`,
                text:
                    `Hi ${booking.user.fullName},\n\n` +
                    `Your booking ${booking.confirmationCode} is confirmed.\n` +
                    `Seats: ${booking.seats.length}\nTotal: ${booking.totalPrice}\n`,
            });
            return;
        }
        default:
            throw new UnrecoverableError(`Unknown notification job: ${job.name}`);
    }
};