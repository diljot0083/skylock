import Flight from "../models/Flight.model.js";
import Route from "../models/Route.model.js";
import FareClass from "../models/FareClass.model.js";

export default async function seedFlights() {
    try {
        const routes = await Route.find({});
        const fareClasses = await FareClass.find({});

        const flights = [];

        routes.forEach((route, routeIndex) => {
            for (let i = 0; i < 2; i++) {
                const flightNumber = `SK${100 + routeIndex * 10 + i}`;
                const departureTime = new Date(Date.now() + (routeIndex + 1) * 86400000 + i * 3 * 3600000);
                const arrivalTime = new Date(departureTime.getTime() + 2 * 3600000);

                const flightFareClasses = fareClasses.map((fc) => ({
                    fareClass: fc._id,
                    basePrice: Math.round(fc.pricing.basePrice * fc.priceModifiers.priceMultiplier)
                }));

                flights.push({
                    flightNumber,
                    route: route._id,
                    departureTime,
                    arrivalTime,
                    fareClasses: flightFareClasses,
                    status: "Scheduled"
                });
            }
        });

        await Flight.deleteMany({});
        console.log("Flight collection cleared");

        await Flight.insertMany(flights);
        console.log(`Flights successfully seeded (${flights.length} flights)`);
    } catch (error) {
        console.error("Error seeding flights:", error);
        throw error;
    }
}