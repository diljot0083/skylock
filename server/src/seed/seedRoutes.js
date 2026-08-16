import Airport from "../models/Airport.model.js";
import Route from "../models/Route.model.js"

const routePairs = [
    ["DEL", "BOM"],
    ["BOM", "DEL"],
    ["DEL", "BLR"],
    ["BLR", "DEL"],
    ["DEL", "DXB"],
    ["DXB", "DEL"],
    ["BOM", "LHR"],
    ["LHR", "BOM"],
];

export default async function seedRoutes() {
    try {
        const airports = await Airport.find({})

        const byCode = Object.fromEntries(airports.map(airport => [airport.code, airport._id]));

        const routes = routePairs.map(([originCode, destinationCode]) => ({
            origin: byCode[originCode],
            destination: byCode[destinationCode]
        }))

        await Route.deleteMany({});
        console.log("Route collection cleared")

        await Route.insertMany(routes)
        console.log("Routes successfully seeded");

    } catch (error) {
        console.error("Error seeding routes:", error)
        throw error
    }
}