require('dotenv').config();
const app = require('./app');

module.exports = () => {
    app.getMonitors();
    app.resume(process.env.RIVERBEDID);
    app.resume(process.env.PORTFOLIOID);
    app.resume(process.env.PORTAMENTOID);
};