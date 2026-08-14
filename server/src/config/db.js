import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log(`\n MONGO_DB Connected ${connect.connection.host}`)
    } catch (error) {
        console.log("Error: ", error);
        process.exit(1);
    }
}

export default connectDB;