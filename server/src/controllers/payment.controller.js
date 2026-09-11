import paymentEngine from "../services/payment/payment.factory.js";
import { applyPaymentEvent } from "../services/payment/applyPaymentEvent.js";
import Booking from "../models/Booking.js";

export const initiatePayment = async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            const err = new Error("Booking not found");
            err.statusCode = 404;
            throw err;
        }
        if (booking.user.toString() !== req.user._id.toString()) {
            const err = new Error("Not authorized for this booking");
            err.statusCode = 403;
            throw err;
        }
        if (booking.status !== "Pending" || booking.paymentStatus !== "unpaid") {
            const err = new Error("Booking is not awaiting payment");
            err.statusCode = 409;
            throw err;
        }

        const order = await paymentEngine.createOrder({
            amount: booking.totalPrice,
            receipt: booking._id.toString(),
            notes: { bookingId: booking._id.toString() },
        });

        booking.paymentOrderId = order.orderId;
        booking.paymentProvider = paymentEngine.name;
        await booking.save();

        res.status(200).json({ ...order, provider: paymentEngine.name });
    } catch (err) { next(err); }
};

export const verifyPayment = async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        const { orderId, paymentId, signature } = req.body;

        if (!orderId || !paymentId || !signature) {
            const err = new Error("Missing payment verification fields");
            err.statusCode = 400;
            throw err;
        }
        if (!paymentEngine.verifyPaymentSignature({ orderId, paymentId, signature })) {
            const err = new Error("Payment signature verification failed");
            err.statusCode = 400;
            throw err;
        }

        const booking = await Booking.findOne({ _id: bookingId, paymentOrderId: orderId });
        if (!booking) {
            const err = new Error("Booking not found for this order");
            err.statusCode = 404;
            throw err;
        }

        await applyPaymentEvent({ type: "captured", orderId, paymentId });

        res.status(200).json({ message: "Payment verified" });
    } catch (err) { next(err); }
};