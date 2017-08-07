const express = require('express');
const app = express();
const request = require('superagent');
const path = require('path');
require('dotenv').config();
const apiKey = process.env.UPTIME;
const morgan = require('morgan');

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../index.html'));
});

const ids = {};

const getOptions = {
    headers:  {
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded'
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
    return request.post('https://api.uptimerobot.com/v2/getMonitors')
        .type('form')
        .send({ api_key: apiKey })
        .send({ format: 'json' })
        .send({ logs: '1' })
        .then((res) => {
            let parsedBody = res.body;
            if (!res.body.monitors) {
                console.log('Error: ', res.body);
                throw new Error('Monitors were not got.');
            }
            res.body.monitors.map(x => {
                console.log('mapping ', x.friendly_name);
                ids[x.id] = x.friendly_name;
            }); 
            console.log(`Success: ${res.body.pagination.total} monitors checked.`);
            console.log('ids', ids);
            return ids;
        })
        .catch(err => console.log(err));
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
    });
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
    });

};

app.getMonitors();

module.exports = app;