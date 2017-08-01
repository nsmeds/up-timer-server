const apiKey = process.env.UPTIME;
const monitors = require('../monitors');
const request = require('request');

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
}

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
        // id: monitors.portamentoId,
        id: '123',
        status: 0
    }
};

request(getOptions, (err, res, body) => {
    if (err) throw new Error(err);
    let parsedBody = JSON.parse(body);
    parsedBody.monitors.map(x => {
        ids[x.id] = x.friendly_name;
    });
    // console.log(ids);
    // console.log(parsedBody);
});

request(editOptions, (err, res, body) => {
    if (err) throw new Error(err);
    let parsedBody = JSON.parse(body);
    if (parsedBody.stat === 'ok' && parsedBody.monitor) {
        console.log(`Success! ${ids[parsedBody.monitor.id]} was modified.`)
    } else {
        console.log('Sorry, there was an unknown error');
    }
    console.log(parsedBody);
})