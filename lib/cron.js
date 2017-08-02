const cron = require('node-cron');
const app = require('./app');
const monitors = require('../monitors');

module.exports = () => {
    // resume apps at 4am PST every day (adjusting for GMT)
    cron.schedule('0 11 * * 1-5', function() {
        app.resume(monitors.riverbedId);
        app.resume(monitors.portfolioId);
        app.resume(monitors.portamentoId);
    });

    // resume apps at 4am PST every day (adjusting for GMT)
    // TODO: add a watchdog for error alerts
    cron.schedule('0 4 * * 1-5', function() {
        app.pause(monitors.riverbedId);
        app.pause(monitors.portfolioId);
        app.pause(monitors.portamentoId);
    });
};

