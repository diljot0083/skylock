import mongoose, { Schema } from "mongoose";

const seatSchema = new Schema({
    flight: {
        type: Schema.Types.ObjectId,
        ref: "Flight",
        required: true
    },
    seatNumber: {
        type: String,
        required: true,
    },
    fareClass: {
        type: Schema.Types.ObjectId,
        ref: "FareClass",
        required: true
    },
    status: {
        type: String,
        enum: ["available", "booked"],
        default: "available"
    }

}, { timestamps: true })

seatSchema.index({ flight: 1, seatNumber: 1 }, { unique: true });

const Seat = mongoose.model("Seat", seatSchema)

export default Seat;