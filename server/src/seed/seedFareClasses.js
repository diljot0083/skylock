import FareClass from "../models/FareClass.model.js";

const fareClasses = [
    {
        name: "Economy",
        code: "Y",
        pricing: {
            basePrice: 100,
            currency: "USD"
        },
        priceModifiers: {
            priceMultiplier: 1.0,
            baseModifier: 0
        },
        baggageAllowance: 15
    },
    {
        name: "Premium Economy",
        code: "W",
        pricing: {
            basePrice: 100,
            currency: "USD"
        },
        priceModifiers: {
            priceMultiplier: 1.5,
            baseModifier: 0
        },
        baggageAllowance: 23
    },
    {
        name: "Business",
        code: "J",
        pricing: {
            basePrice: 100,
            currency: "USD"
        },
        priceModifiers: {
            priceMultiplier: 2.5,
            baseModifier: 0
        },
        baggageAllowance: 32
    }
];

export default async function seedFareClasses() {
    try {
        await FareClass.deleteMany({});
        console.log("Fare class collection cleared");

        await FareClass.insertMany(fareClasses);
        console.log("Fare classes successfully seeded");
    } catch (error) {
        console.error("Error seeding fare classes:", error);
        throw error;
    }
}