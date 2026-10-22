import { Worker } from "bullmq";
import { QUEUE_NAMES, createBullConnection } from "../config/queue.js";
import { processNotification } from "./processors/notification.processor.js";
import { processBookingExpiry } from "./processors/expiry.processor.js";

const workers = [];

const definitions = [
    { name: QUEUE_NAMES.NOTIFICATIONS, processor: processNotification, concurrency: 5 },
    { name: QUEUE_NAMES.BOOKING_EXPIRY, processor: processBookingExpiry, concurrency: 5 },
];

export const startWorkers = () => {
    for (const { name, processor, concurrency } of definitions) {
        const worker = new Worker(name, processor, {
            connection: createBullConnection(`worker-${name}`),
            concurrency,
            drainDelay: 30,
            stalledInterval: 60_000,
        });

        worker.on("error", (err) => console.error(`[worker:${name}] error:`, err.message));
        worker.on("failed", (job, err) =>
            console.error(
                `[worker:${name}] job ${job?.id} failed (attempt ${job?.attemptsMade}/${job?.opts?.attempts}):`,
                err.message
            )
        );
        workers.push(worker);
    }
};

export const closeWorkers = async () => {
    await Promise.all(workers.map((w) => w.close()));
};