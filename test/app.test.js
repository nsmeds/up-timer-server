require('dotenv').config();
const mocha = require('mocha');
const assert = require('chai').assert;
const shortid = require('shortid');

describe('uptimer api', function() {
    const Uptimer = require('../lib/uptimer');
    const app = new Uptimer();
    let testId;
    let testName;

    before(() => {
        testName = shortid.generate();
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
    
    it('creates a monitor', function() {
        return app.create(testName, `https://www.test.com/${testName}`, 'https')
            .then(res => {
                assert.ok(res.id);
                testId = res.id;
                assert.include(res.message, 'was created');
            });
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
    
    it('throws error when no id passed to resume', function() {
        assert.throws(app.resume, 'This function must be called with a monitor ID.');
    });
    
    it('deletes a monitor', function() {
        return app.delete(testId)
            .then(res => {
                assert.include(res, 'was deleted');
            });
    });
});
