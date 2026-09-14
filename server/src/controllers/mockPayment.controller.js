import { PAYMENT_PROVIDER } from "../config/env.js";
import { mockPaymentEngine } from "../services/payment/mockPayment.service.js";
import { applyPaymentEvent } from "../services/payment/applyPaymentEvent.js";

export const handleMockWebhook = async (req, res, next) => {
    try {
        if (PAYMENT_PROVIDER !== "mock") { const err = new Error("Not found"); err.statusCode = 404; throw err; }

        const signature = req.headers["x-mock-signature"];
        if (!mockPaymentEngine.verifyWebhookSignature(req.body, signature)) {
            return res.status(400).json({ message: "Invalid mock signature" });
        }

        const parsed = mockPaymentEngine.parseWebhookEvent(req.body);
        if (parsed) await applyPaymentEvent(parsed);

        res.status(200).json({ received: true });
    } catch (err) { next(err); }
};

export const generateMockSignedPayload = (req, res, next) => {
    try {
        if (PAYMENT_PROVIDER !== "mock") { const err = new Error("Not found"); err.statusCode = 404; throw err; }
        const { orderId, type } = req.query;
        if (!orderId) { const err = new Error("orderId query param required"); err.statusCode = 400; throw err; }

        const { body, signature } = mockPaymentEngine.buildSimulatedWebhookPayload({ orderId, type });
        res.status(200).json({ body, header: { "x-mock-signature": signature } });
    } catch (err) { next(err); }
};