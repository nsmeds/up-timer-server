require('dotenv').config();
const app = require('./app');

const pauseAll = () => {
    app.getMonitors()
        .then(() => {
            return Promise.all([
                app.pause(process.env.RIVERBEDID),
                app.pause(process.env.PORTFOLIOID),
                app.pause(process.env.PORTAMENTOID)
            ]);
        });
};

module.exports = pauseAll;