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

const statusMsg = code => {
    switch (code) {
    case 0: 
        return 'paused';
    case 1: 
        return 'not checked yet';
    case 2:
        return 'up';
    case 8: 
        return 'seems down';
    case 9: 
        return 'down';
    }
};

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
            res.body.monitors.map(x => ids[x.id] = {name: x.friendly_name, status: statusMsg(x.status)}); 
            console.log(`Success: ${res.body.pagination.total} monitors retrieved.`);
            return ids;
        })
        .then(ids => {
            console.log(ids);
            return ids;
        })
        .catch(err => console.log(err));
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
                message = `Success: ${ids[res.body.monitor.id] ? ids[res.body.monitor.id].name : 'unknown' } was paused at ${new Date().toString()}.`;
            } else {
                message = 'Sorry, there was an unknown error';
            }
            console.log(message);
            return message;
        })
        .catch(err => console.log(err));
};

app.resume = monitorId => {
    console.log('monitorId', monitorId);
    let message;
    return request.post('https://api.uptimerobot.com/v2/editMonitor')
        .type('form')
        .send({ api_key: apiKey })
        .send({ format: 'json' })
        .send({ id: monitorId })
        .send({ status: 1 })
        .then(res => {
            console.log(res.body)
            if (res.body.stat === 'ok' && res.body.monitor) {
                message = `Success: ${ids[res.body.monitor.id] ? ids[res.body.monitor.id].name : 'unknown' } was resumed at ${new Date().toString()}.`;
            } else {
                message = `Sorry, could not resume ${ids[res.body.monitor.id].name || 'unknown'}. There was an unknown error.`;
            }
            console.log(message);
            return message;
        })
        .catch(err => console.log(err));
};


module.exports = app;