require('dotenv').config();
const app = require('./app');

const resumeAll = () => {
    // app.getMonitors();
    app.resume(process.env.RIVERBEDID);
    app.resume(process.env.PORTFOLIOID);
    app.resume(process.env.PORTAMENTOID);
};

resumeAll();

module.exports = resumeAll;