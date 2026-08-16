import mongoose, { Schema } from "mongoose";

const flightSchema = new Schema({
    flightNumber: {
        type: String,
        required: true,
    },
    route: {
        type: Schema.Types.ObjectId,
        ref: "Route",
        required: true
    },
    departureTime: {
        type: Date,
        required: true
    },
    arrivalTime: {
        type: Date,
        required: true
    },
    fareClasses: [
        {
            fareClass: {
                type: Schema.Types.ObjectId,
                ref: "FareClass"
            },
            basePrice: {
                type: Number,
                required: true
            }
        }
    ],
    status: {
        type: String,
        required: true,
        enum: ["Scheduled", "Cancelled"],
        default: "Scheduled"
    }
}, { timestamps: true })

const Flight = mongoose.model("Flight", flightSchema)

export default Flight;