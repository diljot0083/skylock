import Seat from "../models/Seat.model.js";
import Flight from "../models/Flight.model.js";
import FareClass from "../models/FareClass.model.js";

const columns = ["A", "B", "C", "D", "E", "F"];

export default async function seedSeats() {
    try {
        const flights = await Flight.find({});
        const fareClasses = await FareClass.find({});

        const fareClassByCode = Object.fromEntries(
            fareClasses.map((fc) => [fc.code, fc._id])
        );

        const seats = [];

        flights.forEach((flight) => {
            for (let row = 1; row <= 30; row++) {
                const fareCode = row <= 4 ? "J" : row <= 10 ? "W" : "Y";

                columns.forEach((col) => {
                    seats.push({
                        flight: flight._id,
                        seatNumber: `${row}${col}`,
                        fareClass: fareClassByCode[fareCode],
                        status: "available"
                    });
                });
            }
        });

        await Seat.deleteMany({});
        console.log("Seat collection cleared");

        await Seat.insertMany(seats);
        console.log(`Seats successfully seeded (${seats.length} seats)`);
    } catch (error) {
        console.error("Error seeding seats:", error);
        throw error;
    }
}