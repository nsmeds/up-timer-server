const cron = require('node-cron');
const app = require('./app');

module.exports = () => {

    console.log('cron on');

    // resume apps at 4am PST every day 
    cron.schedule('20 4 * * 1-5', function() {
        app.resumeAll();
    });

    // pause apps at 9pm PST every day 
    // TODO: add a watchdog for error alerts
    cron.schedule('20 20 * * 1-5', function() {
        app.pauseAll();
    });
};

