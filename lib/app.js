const apiKey = process.env.UPTIME;
const monitors = require('../monitors');

const ids = [];

const request = require('request');

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
        id: monitors.portamentoId,
        status: 0
    }
};

request(getOptions, (err, res, body) => {
    if (err) throw new Error(err);
    parsedBody = JSON.parse(body);

    // later we will map these to a handy array or object for later use
    parsedBody.monitors.map(x => {
        ids.push(x.id, x.friendly_name)
    });
    // console.log(ids);
});

request(editOptions, (err, res, body) => {
    if (err) throw new Error(err);
    parsedBody = JSON.parse(body);

    console.log(parsedBody);
})