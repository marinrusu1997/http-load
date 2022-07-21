import { Agent, setGlobalDispatcher } from "undici";
import terminalOverwrite from 'terminal-overwrite';
import colors from 'ansi-colors';
import { gMeasurements, printStatistics } from "./statistics.js";
import { doReq } from "./request.js";
import { seconds } from "./utils.js";

let agent;
let intervalId;
let timeoutId;

let start;

function startScheduler({ pipelining, connections, requestsPerSecond, duration, url }) {
    if (intervalId != null) {
        throw new Error('Scheduler started already!');
    }

    agent = new Agent({
        bodyTimeout: 10000,
        headersTimeout: 5000,
        pipelining,
        connections
    });
    setGlobalDispatcher(agent);

    timeoutId = setTimeout(() => {
        start = Date.now();

        console.info(`Running ${duration}s test @ ${url}`);
        console.info(`${connections} connections with ${pipelining} pipelining factor`);
        console.info(`Requests made per second ${requestsPerSecond}`);

        intervalId = setInterval(async () => {
            const elapsedSeconds = seconds(Date.now() - start);

            if (elapsedSeconds >= duration) {
                await stopScheduler();
                return;
            }

            const requests = new Array(requestsPerSecond);

            for (let i = 0; i < requestsPerSecond; i++) {
                requests[i] = doReq(url);
            }

            await Promise.all(requests);

            gMeasurements.counters.samples += 1;

            terminalOverwrite(`Remaining ${colors.magenta(`${duration - elapsedSeconds}`)} seconds.`);
        }, 1000);
    }, 15000);
}

async function stopScheduler() {
    if (agent == null) {
        throw new Error('Scheduler was not started.');
    }

    clearTimeout(timeoutId);
    clearInterval(intervalId);
    await agent.close();

    if (intervalId == null) {
        console.error('Scheduler didn\'t start. No measurements were taken.');
        return;
    }

    terminalOverwrite.clear();
    terminalOverwrite.done();

    gMeasurements.duration = Date.now() - start;

    printStatistics();
}

export { startScheduler, stopScheduler };