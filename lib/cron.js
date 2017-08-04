const cron = require('node-cron');
const app = require('./app');
const monitors = require('./monitors');

module.exports = () => {

    console.log('cron on');
    // resume apps at 4am PST every day 
    cron.schedule('0 4 * * 1-5', function() {
        app.getMonitors();
        app.resume(monitors.riverbedId);
        app.resume(monitors.portfolioId);
        app.resume(monitors.portamentoId);
    });

    // pause apps at 9pm PST every day 
    // TODO: add a watchdog for error alerts
    cron.schedule('0 21 * * 1-5', function() {
        app.getMonitors();
        app.pause(monitors.riverbedId);
        app.pause(monitors.portfolioId);
        app.pause(monitors.portamentoId);
    });
};

