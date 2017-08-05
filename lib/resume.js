const app = require('./app');
const monitors = require('./monitors');

app.getMonitors();
app.resume(monitors.riverbedId);
app.resume(monitors.portfolioId);
app.resume(monitors.portamentoId);