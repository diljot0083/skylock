import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    seats: [
        {
            type: Schema.Types.ObjectId,
            ref: "Seat"
        }
    ],
    status: {
        type: String,
        required: true,
        enum: ["Pending", "Confirmed", "Failed", "Cancelled"]
    },
    flight: {
        type: Schema.Types.ObjectId,
        ref: "Flight",
        required: true
    },
    paymentStatus: {
        type: String,
        default: "unpaid",
        enum: ["unpaid", "paid"]
    },
    paymentId: {
        type: String
    },
    paymentOrderId: {
        type: String,
        index: true
    },
    paymentProvider: {
        type: String
    },
    paymentExpiresAt: {
        type: Date
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    confirmationCode: {
        type: String,
        required: true,
        unique: true
    }

}, { timestamps: true })

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ status: 1, paymentStatus: 1, paymentExpiresAt: 1 });

const Booking = mongoose.model("Booking", bookingSchema)

export default Booking;