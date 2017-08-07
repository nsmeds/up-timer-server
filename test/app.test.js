require('dotenv').config();
const mocha = require('mocha');
const assert = require('chai').assert;
const app = require('../lib/app');
const testId = process.env.PORTAMENTOID;

describe('upTimer api', function() {
    
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

    it('starts a monitor', function() {
        return app.resume(testId)
            .then(res => {
                assert.include(res, 'was resumed');
            });
    });

});
