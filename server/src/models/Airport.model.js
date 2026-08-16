import mongoose, { Schema } from "mongoose";

const airportSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        index: true,
        trim: true,
        match: /^[A-Z]{3}$/
    },
    name: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }

}, { timestamps: true })

const Airport = mongoose.model("Airport", airportSchema)

export default Airport;