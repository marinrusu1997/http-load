import { request, errors } from "undici";
import { gMeasurements } from "./statistics.js";

async function doReq(url) {
    gMeasurements.counters.requests += 1;

    const start = Date.now();

    try {
        const { body } = await request(url);
        const helloTextBody = await body.text();

        gMeasurements.latencies.push(Date.now() - start);

        gMeasurements.counters.bytesRead += Buffer.byteLength(helloTextBody, "utf-8");
    } catch (err) {
        gMeasurements.counters.errors += 1;
        if (
            err instanceof errors.BodyTimeoutError ||
            err instanceof errors.HeadersTimeoutError ||
            err instanceof errors.ConnectTimeoutError ||
            err.message.toLowerCase().includes('timeout')
        ) {
            gMeasurements.counters.timeouts += 1;
        }
    }
}

export { doReq };