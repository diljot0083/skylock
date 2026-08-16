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
        default: "unpaid"
    },
    paymentId: {
        type: String
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    confirmationCode: {
        type: String,
        required: true,
    }

}, { timestamps: true })

bookingSchema.index({ user: 1, createdAt: -1 });

const Booking = mongoose.model("Booking", bookingSchema)

export default Booking;