const cron = require('node-cron');
const app = require('./app');
 
// resume apps at 4am every day 
cron.schedule('0 4 * * *', function(){
    app.resume(riverbedId);
    app.resume(portfolioId);
    app.resume(portamentoId);
});

// pause apps at 9pm every day
// TODO: verify timezone, add a watchdog for error alerts
cron.schedule('0 21 * * *', function(){
    app.pause(riverbedId);
    app.pause(portfolioId);
    app.pause(portamentoId);
});

