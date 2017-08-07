const mocha = require('mocha');
const assert = require('chai').assert;
const app = require('../lib/app');
const monitors = require('../lib/monitors');

describe('upTimer api', function() {

    before(() => app.getMonitors());
    
    it('gets all monitors', function() {
        return app.getMonitors()
            .then(res => {
                console.log('res', res);
                assert.include(res, monitors.portamentoId);
            });
    });

    it('starts a monitor', function(done) {
        app.resume(monitors.portamentoId);
        assert.equal('hi', 'hi');
        done();
    });

});
