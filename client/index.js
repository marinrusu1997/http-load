import { startScheduler, stopScheduler } from "./scheduler.js";

const PIPELINING = Number(process.env['PIPELINING'] || '10');
const CONNECTIONS = Number(process.env['CONNECTIONS']) || Infinity;
const REQ_SEC = Number(process.env['REQ_SEC'] || '15000');
const DURATION = Number(process.env['DURATION'] || '120');
const URL = process.env['URL'] || 'http://localhost:3000';

console.info(`PID: ${process.pid}`);

startScheduler({
    pipelining: PIPELINING,
    connections: CONNECTIONS,
    requestsPerSecond: REQ_SEC,
    duration: DURATION,
    url: URL
});

process.on('SIGINT', stopScheduler);





