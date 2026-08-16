import Airport from "../models/Airport.model.js";

const airports = [
    { code: "DEL", name: "Indira Gandhi International", city: "Delhi", country: "India" },
    { code: "BOM", name: "Chhatrapati Shivaji Maharaj Intl", city: "Mumbai", country: "India" },
    { code: "BLR", name: "Kempegowda International", city: "Bangalore", country: "India" },
    { code: "DXB", name: "Dubai International", city: "Dubai", country: "UAE" },
    { code: "LHR", name: "Heathrow", city: "London", country: "UK" },
];

export default async function seedAirports() {
    try {
        await Airport.deleteMany({});
        console.log("Airport collection cleared");

        await Airport.insertMany(airports);
        console.log("Airports successfully seeded");
    } catch (error) {
        console.error("Error seeding airports:", error);
        throw error;
    }
}