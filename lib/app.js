const express = require('express');
const apiKey = process.env.UPTIME; // careful here
require('dotenv').config();
const request = require('request');
// const morgan = require('morgan');
const app = express();
const path = require('path');

// app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../index.html'));
});

const ids = {};

const getOptions = {
    method: 'POST',
    url: 'https://api.uptimerobot.com/v2/getMonitors',
    headers:  {
        'content-type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache'
    },
    form: {
        api_key: apiKey,
        format: 'json',
        logs: '1'
    }
};

const editOptions = {
    method: 'POST',
    url: 'https://api.uptimerobot.com/v2/editMonitor',
    headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache'
    },
    form: {
        api_key: apiKey,
        format: 'json',
        id: '',
        status: 0
    }
};

app.getMonitors = () => {
    request(getOptions, (err, res, body) => {
        if (err) throw new Error(err);
        let parsedBody = JSON.parse(body);
        if (!parsedBody.monitors) throw new Error('hmm there was an error getting the monitors');
        parsedBody.monitors.map(x => {
            ids[x.id] = x.friendly_name;
        }); 
        return parsedBody;
        // need a callback/promise to ensure the map operation finishes before the pause/resume runs
    });
};

app.pause = monitorId => {
    editOptions.form.status = 0;
    editOptions.form.id = monitorId;
    request(editOptions, (err, res, body) => {
        if (err) throw new Error(err);
        let parsedBody = JSON.parse(body);
        if (parsedBody.stat === 'ok' && parsedBody.monitor) {
            console.log(`Success! ${ids[parsedBody.monitor.id]} was paused at ${new Date().toString()}.`);
        } else {
            console.log('Sorry, there was an unknown error');
        }
        console.log(parsedBody);
    })
};

app.resume = monitorId => {

    editOptions.form.status = 1;
    editOptions.form.id = monitorId;

    request(editOptions, (err, res, body) => {
        if (err) throw new Error(err);
        let parsedBody = JSON.parse(body);
        if (parsedBody.stat === 'ok' && parsedBody.monitor) {
            console.log(`Success! ${ids[parsedBody.monitor.id]} was resumed at ${new Date().toString()}.`);
            // return (`Success! ${ids[parsedBody.monitor.id]} was resumed at ${new Date()}.`);
        } else {
            console.log('Sorry, there was an unknown error');
            // return ('Sorry, there was an unknown error');
        }
        console.log(parsedBody);  
    })

};

module.exports = app;