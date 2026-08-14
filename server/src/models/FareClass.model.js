import mongoose, { Schema } from "mongoose";

const fareClassSchema = new Schema({
    name: {
        type: String,
        required: true,
        enum: ["Economy", "Premium Economy", "Business"]
    },
    code: {
        type: String,
        required: true,
        enum: ["Y", "W", "J"]
    },
    pricing: {
        basePrice: { type: Number, required: true },
        currency: { type: String, default: 'USD' }
    },
    priceModifiers: {
        priceMultiplier: { type: Number, default: 1.0 },
        baseModifier: { type: Number, default: 0 }
    },
    baggageAllowance: {
        type: Number,
        default: 15
    }

})

export default mongoose.model("FareClass", fareClassSchema)