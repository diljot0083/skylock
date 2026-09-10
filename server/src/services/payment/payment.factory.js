import { PAYMENT_PROVIDER } from "../../config/env.js";
import { mockPaymentEngine } from "./mockPayment.service.js";

const engines = {
    mock: mockPaymentEngine,
};

const activeEngine = engines[PAYMENT_PROVIDER];
if (!activeEngine) {
    throw new Error(`Unknown or not-yet-implemented PAYMENT_PROVIDER "${PAYMENT_PROVIDER}"`);
}

export default activeEngine;