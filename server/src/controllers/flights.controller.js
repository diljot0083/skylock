import Flight from "../models/Flight.model.js";
import Route from "../models/Route.model.js";
import Airport from "../models/Airport.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const searchFlights = asyncHandler(async (req, res) => {
    const { origin, destination, date } = req.query;

    if (!origin || !destination || !date) {
        return res.status(400).json({
            success: false,
            message: "origin, destination, and date are required"
        });
    }

    const originAirport = await Airport.findOne({ code: origin.toUpperCase() });
    const destinationAirport = await Airport.findOne({ code: destination.toUpperCase() });

    if (!originAirport || !destinationAirport) {
        return res.status(404).json({
            success: false,
            message: "One or both airport codes are invalid"
        });
    }

    const route = await Route.findOne({
        origin: originAirport._id,
        destination: destinationAirport._id
    });

    if (!route) {
        return res.status(200).json({ success: true, flights: [] });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const flights = await Flight.find({
        route: route._id,
        departureTime: { $gte: startOfDay, $lt: endOfDay },
        status: "Scheduled"
    })
        .populate("route")
        .populate({
            path: "route",
            populate: [
                { path: "origin" },
                { path: "destination" }
            ]
        })
        .populate("fareClasses.fareClass");

    res.status(200).json({
        success: true,
        count: flights.length,
        flights
    });
});
export { searchFlights };