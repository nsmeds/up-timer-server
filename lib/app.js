const express = require('express');
const app = express();
const request = require('superagent');
const path = require('path');
const apiKey = process.env.UPTIME;
// const morgan = require('morgan');

// app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../index.html'));
});

const ids = {};

app.getMonitors = () => {
    return request.post('https://api.uptimerobot.com/v2/getMonitors')
        .type('form')
        .send({ api_key: apiKey })
        .send({ format: 'json' })
        .send({ logs: '1' })
        .then( res => {
            if (!res.body.monitors) {
                console.log('Error: ', res.body);
                throw new Error('Monitors were not got.');
            }
            res.body.monitors.map(x => ids[x.id] = x.friendly_name); 
            console.log(`Success: ${res.body.pagination.total} monitors retrieved.`);
            return ids;
        })
        .catch(err => {throw new Error('Error: ', err);});
};

app.pause = monitorId => {
    let message;
    return request.post('https://api.uptimerobot.com/v2/editMonitor')
        .type('form')
        .send({ api_key: apiKey })
        .send({ format: 'json' })
        .send({ id: monitorId })
        .send({ status: 0 })
        .then(res => {
            if (res.body.stat === 'ok' && res.body.monitor) {
                message = `Success: ${ids[res.body.monitor.id]} was paused at ${new Date().toString()}.`;
            } else {
                message = 'Sorry, there was an unknown error';
            }
            console.log(message);
            return message;
        })
        .catch(err => {throw new Error('Error: ', err);});
};

app.resume = monitorId => {
    let message;
    return request.post('https://api.uptimerobot.com/v2/editMonitor')
        .type('form')
        .send({ api_key: apiKey })
        .send({ format: 'json' })
        .send({ id: monitorId })
        .send({ status: 1 })
        .then(res => {
            if (res.body.stat === 'ok' && res.body.monitor) {
                message = `Success: ${ids[res.body.monitor.id]} was resumed at ${new Date().toString()}.`;
            } else {
                message = `Sorry, could not resume ${ids[res.body.monitor.id]}. There was an unknown error`;
            }
            console.log(message);
            return message;
        })
        .catch(err => {throw new Error('Error: ', err);});
};

app.getMonitors();

module.exports = app;