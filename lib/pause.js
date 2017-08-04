const app = require('./app');
const monitors = require('../monitors');

app.getMonitors();
app.pause(monitors.riverbedId);
app.pause(monitors.portfolioId);
app.pause(monitors.portamentoId);