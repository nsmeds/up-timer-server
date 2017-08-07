require('dotenv').config();
const app = require('./app');

app.getMonitors();
app.pause(process.env.RIVERBEDID);
app.pause(process.env.PORTFOLIOID);
app.pause(process.env.PORTAMENTOID);