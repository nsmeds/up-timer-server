require('dotenv').config();
const app = require('./lib/app');
const http = require('http');
const cron = require('./lib/cron')();
const port = process.env.PORT || 3003;

const server = http.createServer(app);

server.listen(port, () => {
    console.log('server running on', server.address());
});