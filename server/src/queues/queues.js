import { Queue } from "bullmq";
import { QUEUE_NAMES, createBullConnection, defaultJobOptions } from "../config/queue";

let notificationsQueue = null;
let expiryQueue = null;

export const initQueues = () => {
    if (notificationsQueue) return;
    const connection = createBullConnection("producer");

    notificationsQueue = new Queue(QUEUE_NAMES.NOTIFICATIONS, {
        connection,
        defaultJobOptions,
    });
    expiryQueue = new Queue(QUEUE_NAMES.BOOKING_EXPIRY, {
        connection,
        defaultJobOptions,
    });

    for (const q of [notificationsQueue, expiryQueue]) {
        q.on("error", (err) => console.error(`[queue:${q.name}] error:`, err.message));
    }
};

export const closeQueues = async () => {
    await Promise.all([notificationsQueue?.close(), expiryQueue?.close()]);
};

export const enqueueBookingConfirmation = (bookingId) => {
    return notificationsQueue.add(
        "booking-confirmed",
        { bookingId: String(bookingId) },
        { jobId: `confirm-${bookingId}` }
    );
};

export const scheduleBookingExpiry = (bookingId, expiresAt) => {
    const at = new Date(expiresAt).getTime();
    if (Number.isNaN(at)) {
        throw new Error(`Invalid paymentExpiresAt for booking ${bookingId}`);
    }
    return expiryQueue.add(
        "expire-booking",
        { bookingId: String(bookingId) },
        { jobId: `expire-${bookingId}`, delay: Math.max(0, at - Date.now()) }
    );
};