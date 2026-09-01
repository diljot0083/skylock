import Flight from "../models/Flight.model.js";
import Route from "../models/Route.model.js";
import Airport from "../models/Airport.model.js";
import Seat from "../models/Seat.model.js";
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

    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

    const flights = await Flight.find({
        route: route._id,
        departureTime: { $gte: startOfDay, $lt: endOfDay },
        status: "Scheduled"
    })
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

const getUpcomingFlightWindow = asyncHandler(async (req, res) => {
    const earliest = await Flight.findOne().sort({ departureTime: 1 });
    const latest = await Flight.findOne().sort({ departureTime: -1 });

    if (!earliest || !latest) {
        return res.status(200).json({
            success: true,
            message: "No flights currently seeded",
            earliestDeparture: null,
            latestDeparture: null
        });
    }

    res.status(200).json({
        success: true,
        earliestDeparture: earliest.departureTime,
        latestDeparture: latest.departureTime,
        sampleQuery: `/api/flights/search?origin=DEL&destination=BOM&date=${earliest.departureTime.toISOString().split("T")[0]}`
    });
});

const getFlightById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const flight = await Flight.findById(id)
        .populate({
            path: "route",
            populate: [
                { path: "origin" },
                { path: "destination" }
            ]
        })
        .populate("fareClasses.fareClass");

    if (!flight) {
        return res.status(404).json({ success: false, message: "Flight not found" });
    }

    res.status(200).json({ success: true, flight });
});

const getFlightSeats = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const flight = await Flight.findById(id);

    if (!flight) {
        return res.status(404).json({ success: false, message: "Flight not found" });
    }

    const seats = await Seat.find({ flight: id })
        .populate("fareClass")
        .sort({ seatNumber: 1 });

    res.status(200).json({
        success: true,
        flightId: id,
        count: seats.length,
        seats
    });
});

export { searchFlights, getUpcomingFlightWindow, getFlightById, getFlightSeats };