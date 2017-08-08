const cron = require('node-cron');
const pauseAll = require('./pause');
const resumeAll = require('./resume');

module.exports = () => {

    console.log('cron on');

    // resume apps at 4am PST every day 
    cron.schedule('0 4 * * 1-5', function() {
        resumeAll();
    });

    // pause apps at 9pm PST every day 
    // TODO: add a watchdog for error alerts
    cron.schedule('0 20 * * 1-5', function() {
        pauseAll();
    });
};

