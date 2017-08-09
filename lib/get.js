const app = require('./app');

const getAll = () => {
    app.getMonitors()
        .then(res => console.log(res));
};

getAll();

module.exports = getAll;