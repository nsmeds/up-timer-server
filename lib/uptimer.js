const request = require('superagent');
require('dotenv').config();
let apiKey;

function Uptimer(key = process.env.UPTIMER) {
    if (!key) throw new Error('Uptime Robot API key required');
    apiKey = key;
}

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

Uptimer.prototype.getMonitors = () => {
    return request.post('https://api.uptimerobot.com/v2/getMonitors')
        .type('form')
        .send({ api_key: apiKey })
        .send({ format: 'json' })
        .send({ logs: '1' })
        .then( res => {
            if (res.code === 'ECONNREFUSED' || res.code === 'ECONNRESET') throw new Error('Connection error; please try again');
            if (!res.body.monitors) throw new Error('Error retrieving monitors: ', res.body);
            res.body.monitors.map(x => ids[x.id] = {name: x.friendly_name, status: statusMsg(x.status)}); 
            console.log(`Success: ${res.body.pagination.total} monitors retrieved.`);
            return ids;
        })
        .then(ids => {
            return ids;
        })
        .catch(err => console.log(err));
};

Uptimer.prototype.listMonitors = () => {
    Uptimer.prototype.getMonitors()
        .then(res => console.log(res));
};

Uptimer.prototype.create = (name, url, type) => {
    let response = {};
    const monitorTypes = {
        http: 1,
        https: 1,
        keyword: 2,
        ping: 3,
        port: 4
    };
    return request.post('https://api.uptimerobot.com/v2/newMonitor')
        .type('form')
        .send({ api_key: apiKey })
        .send({ format: 'json' })
        .send({ friendly_name: name })
        .send({ url: url })
        .send({ type: monitorTypes[type] })
        .then(res => {
            if (res.body.stat === 'fail') throw new Error(res.body.error.message);
            if (res.body.stat === 'ok' && res.body.monitor) {
                ids[res.body.monitor.id] = {name: name, status: res.body.monitor.status};
                response.message = `Success: ${ids[res.body.monitor.id] ? ids[res.body.monitor.id].name : 'unknown' } was created at ${new Date().toString()}.`;
                response.id = res.body.monitor.id;
            } else {
                response.message = `Sorry, could not create ${name || 'unknown'}. There was an unknown error.`;
            }
            console.log(response.message);
            return response;
        })
        .catch(err => console.log(err));
};

Uptimer.prototype.delete = monitorId => {
    let response;
    return request.post('https://api.uptimerobot.com/v2/deleteMonitor')
        .type('form')
        .send({ api_key: apiKey })
        .send({ format: 'json' })
        .send({ id: monitorId })
        .then(res => {
            if (res.body.stat === 'fail') throw new Error(res.body.error.message);
            if (res.body.stat === 'ok' && res.body.monitor) {
                response = `Success: ${ids[res.body.monitor.id] ? ids[res.body.monitor.id].name : 'unknown' } was deleted at ${new Date().toString()}.`;
                delete ids[res.body.monitor.id];
            } else {
                response = `Sorry, could not delete ${ids[monitorId].name} - there was an unknown error`;
            }
            console.log(response);
            return response;
        });
};

Uptimer.prototype.pause = monitorId => {
    if (!monitorId) throw new Error('This function must be called with a monitor ID.');
    let response;
    return request.post('https://api.uptimerobot.com/v2/editMonitor')
        .type('form')
        .send({ api_key: apiKey })
        .send({ format: 'json' })
        .send({ id: monitorId })
        .send({ status: 0 })
        .then(res => {
            if (res.body.stat === 'fail') throw new Error(res.body.error.message);
            if (res.body.stat === 'ok' && res.body.monitor) {
                response = `Success: ${ids[res.body.monitor.id] ? ids[res.body.monitor.id].name : 'unknown' } was paused at ${new Date().toString()}.`;
            } else {
                response = 'Sorry, there was an unknown error';
            }
            console.log(response);
            return response;
        })
        .catch(err => console.log(err));
};

Uptimer.prototype.resume = monitorId => {
    if (!monitorId) throw new Error('This function must be called with a monitor ID.');
    let response;
    return request.post('https://api.uptimerobot.com/v2/editMonitor')
        .type('form')
        .send({ api_key: apiKey })
        .send({ format: 'json' })
        .send({ id: monitorId })
        .send({ status: 1 })
        .then(res => {
            if (res.body.stat === 'fail') throw new Error(res.body.error.message);
            if (res.body.stat === 'ok' && res.body.monitor) {
                response = `Success: ${ids[res.body.monitor.id] ? ids[res.body.monitor.id].name : 'unknown' } was resumed at ${new Date().toString()}.`;
            } else {
                response = `Sorry, could not resume ${ids[res.body.monitor.id].name || 'unknown'}. There was an unknown error.`;
            }
            console.log(response);
            return response;
        })
        .catch(err => console.log(err));
};

Uptimer.prototype.pauseAll = () => {
    return Uptimer.prototype.getMonitors()
        .then(res => Object.keys(res))
        .then(keys => keys.map(id => Uptimer.prototype.pause(id)))
        .then(paused => Promise.all(paused).then(result => result));
};

Uptimer.prototype.resumeAll = () => {
    return Uptimer.prototype.getMonitors()
        .then(res => Object.keys(res))
        .then(keys => keys.map(id => Uptimer.prototype.resume(id)))
        .then(resumed => Promise.all(resumed).then(result => result));
};

module.exports = Uptimer;