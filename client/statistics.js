import percentile from "stats-percentile";
import { average, max, min, standardDeviation } from "simple-statistics";
import { table } from "table";
import { convertTo } from 'k-convert';
import { bytesToMegaBytes, seconds, twoDecimalPlaces } from "./utils.js";

const gMeasurements = {
    latencies: [],
    counters: {
        samples: 0,
        errors: 0,
        timeouts: 0,
        requests: 0,
        bytesRead: 0
    },
    duration: 0
}

function printStatistics() {
    const data = [
        ['Stat', '2%', '50%', '95%', '97%', '99%', 'Avg', 'Stdev', 'Min', 'Max'],
        ['Latency',
            `${percentile(gMeasurements.latencies, 2)} ms`,
            `${percentile(gMeasurements.latencies, 50)} ms`,
            `${percentile(gMeasurements.latencies, 95)} ms`,
            `${percentile(gMeasurements.latencies, 97)} ms`,
            `${percentile(gMeasurements.latencies, 99)} ms`,
            twoDecimalPlaces(average(gMeasurements.latencies)),
            twoDecimalPlaces(standardDeviation(gMeasurements.latencies)),
            min(gMeasurements.latencies),
            max(gMeasurements.latencies)]
    ];

    console.log();
    console.log(table(data));

    console.log('Req/Bytes counts sampled once per second.');
    console.log(`# of samples: ${gMeasurements.counters.samples}`);
    console.log();
    console.log(`${convertTo(gMeasurements.counters.requests)} requests in ${seconds(gMeasurements.duration)}s, ${twoDecimalPlaces(bytesToMegaBytes(gMeasurements.counters.bytesRead))} MB read`);
    console.log(`${gMeasurements.counters.errors} errors (${gMeasurements.counters.timeouts} timeouts)`)
}

export { gMeasurements, printStatistics };