import mongoose from "mongoose";
import { MONGO_URI } from "./env.js";

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(MONGO_URI);
        console.log(`\n MONGO_DB Connected ${connect.connection.host}`)
    } catch (error) {
        console.log("Error: ", error);
        process.exit(1);
    }
}

export default connectDB;