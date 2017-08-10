require('dotenv').config();
const mocha = require('mocha');
const assert = require('chai').assert;

describe('upTimers api', function() {
    const Uptimer = require('../lib/uptimers');
    const app = new Uptimer();
    let testId;

    before(() => {
        // get an existing monitor id to use for our tests
        return app.getMonitors()
            .then(res => testId = (Object.keys(res)[0]));
    });

    it('gets all monitors', function() {
        return app.getMonitors()
            .then(res => {
                assert.include(JSON.stringify(res), testId);
            });
    });

    it('pauses a monitor', function() {
        return app.pause(testId)
            .then(res => {
                assert.include(res, 'was paused');
            });
    });

    it('throws error when no id passed to pause', function() {
        assert.throws(app.pause, 'This function must be called with a monitor ID.');
    });

    it('starts a monitor', function() {
        return app.resume(testId)
            .then(res => {
                assert.include(res, 'was resumed');
            });
    });

    it('throws error when no id passed to pause', function() {
        assert.throws(app.resume, 'This function must be called with a monitor ID.');
    });

    it('pauses all monitors', function() {
        return app.pauseAll()
            .then(res => {
                res.map(message => assert.include(message, 'was paused'));
            });
    });

    it('resumes all monitors', function() {
        return app.resumeAll()
            .then(res => {
                res.map(message => assert.include(message, 'was resumed'));
            });
    });

});
