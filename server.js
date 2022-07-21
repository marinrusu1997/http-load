import http from 'http';

const PORT = 3000;
const BACKLOG = 4096;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Connection', 'Keep-Alive');
    res.setHeader('Content-Type', 'application/json');
    res.end('{"hello":"world"}');
});

server.listen(PORT, BACKLOG, () => {
    console.log(`Server running at http://:::${PORT}/`);
});