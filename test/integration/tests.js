(function() {
    'use strict';

    var expect = require('chai').expect;
    var Xrm = require('../../lib/xrmnode');
    var config = require('./config.json');

    describe('integration tests', function() {
        this.timeout(20000);

        var client;

        beforeEach(function() {
            client = new Xrm({organizationUrl: config.url});
        });

        it('gets info on current user', function(done) {
            client.authenticate(config.username, config.password).then(client.whoAmI)
                .then(function(result) {
                    console.log(result);
                    done();
                }).catch(function(err) {
                    done(err);
                });
        });

        describe('creating entity', function() {
            it('successfully creates account with string and int attributes', function(done) {
                client.authenticate(config.username, config.password).then(function() {
                    client.create('account', [
                        {logicalName:'name', value:'testname'},
                        {logicalName:'fax', value:'1234353'},
                        {logicalName:'numberofemployees', value:12, type:'int'}
                    ]).then(function(result) {
                        expect(result).to.have.length(36);
                        done();
                    }).catch(function(err) {
                        done(err);
                    });
                });
            });
        });
    });
})();
