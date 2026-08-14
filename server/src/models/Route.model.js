import mongoose, { Schema } from "mongoose";

const routeSchema = new Schema({
    origin: {
        type: Schema.Types.ObjectId,
        ref: "Airport",
        required: true
    },
    destination: {
        type: Schema.Types.ObjectId,
        ref: "Airport",
        required: true
    }

}, { timestamps: true })

routeSchema.index({ origin: 1, destination: 1 }, { unique: true });

export default mongoose.model("Route", routeSchema)