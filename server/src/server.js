import "./config/env.js";
import connectDB from "./config/db.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server listening on port: ${PORT}`)
        })
    })
    .catch((error) => {
        console.log("MONGO_DB Connection failed", error)
    })