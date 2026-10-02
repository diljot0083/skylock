export function registerSeatSockets(io) {
    io.on("connection", (socket) => {
        socket.on("flight:join", (flightId) => {
            if (typeof flightId === "string") socket.join(`flight:${flightId}`);
        });

        socket.on("flight:leave", (flightId) => {
            if (typeof flightId === "string") socket.leave(`flight:${flightId}`);
        });
    });
}