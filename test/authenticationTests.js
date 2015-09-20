(function() {
	'use strict';

	var sinon = require('sinon');
	var expect = require('chai').expect;
	var transport = require('../lib/transport');
	var Xrm = require('../lib/xrmnode');
	var xpath = require('xpath');
	var Dom = require('xmldom').DOMParser;
	var promise = require('bluebird');
	var soapResponse = require('./soapRequestHelpers');

	describe('authentication', function() {
		describe('success', function() {
			beforeEach(function() {
				var deferred = promise.pending();
				this.transportStub = sinon.stub(transport, 'post');
				this.transportStub.returns(deferred.promise);
				this.clock = sinon.useFakeTimers(1408387200000); // 2014-08-18 20:40 GMT+1

				var client = new Xrm({organizationUrl: 'test.crm4.dynamics.com'});
				client.authenticate('testuser', 'secret');

				var body = this.transportStub.getCall(0).args[1];
				this.xmlBody = new Dom().parseFromString(body);
			});

			afterEach(function() {
				transport.post.restore();
				this.clock.restore();
			});

			it('post request to auth endpoint', function() {
				expect(this.transportStub.getCall(0).args[0]).to.equal('https://login.microsoftonline.com/RST2.srf');
			});

			it('creates messageid', function() {
				var node = xpath.select('//*[local-name() = \'MessageID\']', this.xmlBody);
				expect(node).to.have.length(1);
			});

			it('sets created date to current time', function() {
				var node = xpath.select('//*[local-name() = \'Created\']', this.xmlBody);
				expect(node).to.have.length(1);
				expect(node[0].firstChild.data).to.equal('2014-08-18T18:40:00.000Z');
			});

			it('sets expiry date in one hour', function() {
				var node = xpath.select('//*[local-name() = \'Expires\']', this.xmlBody);
				expect(node).to.have.length(1);
				expect(node[0].firstChild.data).to.equal('2014-08-18T19:40:00.000Z');
			});

			it('sets username', function() {
				var node = xpath.select('//*[local-name() = \'Username\']', this.xmlBody);
				expect(node).to.have.length(1);
				expect(node[0].firstChild.data).to.equal('testuser');
			});

			it('sets password', function() {
				var node = xpath.select('//*[local-name() = \'Password\']', this.xmlBody);
				expect(node).to.have.length(1);
				expect(node[0].firstChild.data).to.equal('secret');
			});

			it('sets correct address based on region', function() {
				var node = xpath.select('//*[local-name() = \'Address\']', this.xmlBody);
				expect(node).to.have.length(2);
				expect(node[1].firstChild.data).to.equal('urn:crmemea:dynamics.com');
			});

			it('gets tokens from response', function(done) {
				var deferred = promise.pending();
				this.transportStub.returns(deferred.promise);
				deferred.resolve(soapResponse.validAutheticationResponse());

				var client = new Xrm({organizationUrl: 'crm4.dynamics.com'});
				client.authenticate('', '')
					.then(function(tokens) {
						expect(tokens.one).to.equal('1');
						expect(tokens.two).to.equal('2');
						expect(tokens.keyIdentifier).to.equal('3');
						done();
					});
			});
		});

		describe('wrong username/password', function() {
			beforeEach(function() {
				this.transportStub = sinon.stub(transport, 'post');
			});

			afterEach(function() {
				transport.post.restore();
			});

			it('returns authentication failure', function(done) {
				var deferred = promise.pending();
				this.transportStub.returns(deferred.promise);
				deferred.resolve(soapResponse.authenticationFailureResponse());

				var client = new Xrm({ organizationUrl: 'crm4.dynamics.com'});
				client.authenticate('', '')
					.then(function(){})
					.catch(function(e){
				    	expect(e).to.equal('Authentication Failure');
				    	done();
					});
			});
		});

		describe('wrong organizationurl', function() {
			it('is not an online url', function(done) {
				var client = new Xrm({organizationUrl:'https://example.com'});
				client.authenticate('', '')
					.then(function(){})
					.catch(function(e) {
						expect(e).to.equal('Not a online URL');
						done();
					});
			});
		});
	});
})();
