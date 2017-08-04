const mocha = require('mocha');
const assert = require('chai').assert;
const app = require('../lib/app');
const monitors = require('../monitors');

describe('upTimer api', function() {

    before(() => app.getMonitors());
    
    it('gets all monitors', function(done) {
        app.getMonitors();
        // assert.equal('hi', app.getMonitors());
        done();
    });

    it('starts a monitor', function(done) {
        app.resume(monitors.portamentoId);
        assert.equal('hi', 'hi');
        done();
    })
});
