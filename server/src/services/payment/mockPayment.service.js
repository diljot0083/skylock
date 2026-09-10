import crypto from "crypto";
import { MOCK_PAYMENT_SECRET } from "../../config/env.js";

function sign(message) {
    return crypto.createHmac("sha256", MOCK_PAYMENT_SECRET).update(message).digest("hex");
}
function safeHmacCompare(message, signature) {
    if (!signature) return false;
    const expectedBuf = Buffer.from(sign(message));
    const givenBuf = Buffer.from(signature);
    return expectedBuf.length === givenBuf.length && crypto.timingSafeEqual(expectedBuf, givenBuf);
}

export const mockPaymentEngine = {
    name: "mock",

    async createOrder({ amount }) {
        const orderId = `order_mock_${crypto.randomBytes(8).toString("hex")}`;
        return {
            orderId,
            amount: Math.round(amount * 100),
            currency: "INR",
            publicKey: "mock_public_key",
        };
    },

    verifyPaymentSignature({ orderId, paymentId, signature }) {
        return safeHmacCompare(`${orderId}|${paymentId}`, signature);
    },

    verifyWebhookSignature(rawBody, signatureHeader) {
        return safeHmacCompare(rawBody, signatureHeader);
    },

    parseWebhookEvent(rawBody) {
        const event = JSON.parse(rawBody.toString("utf8"));
        if (!["payment.captured", "payment.failed"].includes(event.event)) return null;
        const payment = event.payload.payment.entity;
        return {
            type: event.event === "payment.captured" ? "captured" : "failed",
            orderId: payment.order_id,
            paymentId: payment.id,
        };
    },

    buildSimulatedWebhookPayload({ orderId, type = "captured" }) {
        const paymentId = `pay_mock_${crypto.randomBytes(8).toString("hex")}`;
        const body = {
            event: type === "captured" ? "payment.captured" : "payment.failed",
            payload: { payment: { entity: { id: paymentId, order_id: orderId, status: type } } },
        };
        const raw = Buffer.from(JSON.stringify(body));
        return { body, signature: sign(raw) };
    },
};