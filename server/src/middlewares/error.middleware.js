export const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error";

    if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyPattern ?? {})[0] ?? "field";
        message = `${field} already exists`;
    }

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map((e) => e.message).join(", ");
    }

    res.status(statusCode).json({ success: false, message });
};