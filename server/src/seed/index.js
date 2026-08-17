import "../config/env.js";
import mongoose from "mongoose";
import connectDB from "../config/db.js";

import seedAirports from "./seedAirports.js";
import seedFareClasses from "./seedFareClasses.js";
import seedRoutes from "./seedRoutes.js";
import seedFlights from "./seedFlights.js";
import seedSeats from "./seedSeats.js";

async function runSeed() {
    try {
        await connectDB();

        await seedAirports();
        await seedFareClasses();
        await seedRoutes();
        await seedFlights();
        await seedSeats();

        console.log("\n✅ Seeding complete");
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("\n❌ Seeding failed:", error);
        process.exit(1);
    }
}

runSeed();