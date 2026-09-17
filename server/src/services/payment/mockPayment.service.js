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

    verifyWebhookEvent(rawBody, signatureHeader) {
        let event;
        try {
            event = JSON.parse(rawBody.toString("utf8"));
        } catch {
            return null;
        }
        const payment = event?.payload?.payment?.entity;
        if (!payment) return null;

        const canonical = `${payment.order_id}|${payment.status}`;
        if (!safeHmacCompare(canonical, signatureHeader)) return null;

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
        const signature = sign(`${orderId}|${type}`); // matches verifyWebhookEvent's canonical string
        return { body, signature };
    },
};