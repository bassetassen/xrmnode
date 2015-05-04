(function() {
	'use strict';

	var sinon = require("sinon");
	var expect = require("chai").expect;
	var transport = require("../lib/transport");
	var Xrm = require("../lib/xrmnode");
	var xpath = require('xpath');
	var Dom = require('xmldom').DOMParser;
	var promise = require("bluebird");
	var soapResponse = require("./soapRequestHelpers");

	describe('soaprequest header', function() {
		var self = this;
		describe('success', function() {
			beforeEach(function(done) {
				self.deferred = promise.pending();
				self.transportStub = sinon.stub(transport, "post");
				self.transportStub.returns(self.deferred.promise);
				self.clock = sinon.useFakeTimers(1408387200000); // 2014-08-18 20:40 GMT+1

				self.deferred.resolve(soapResponse.validAutheticationResponse());

				var client = new Xrm({organizationUrl: 'https://test.crm4.dynamics.com'});
				client.authenticate('testuser', 'secret')
					.then(client.whoAmI)
					.then(function() {
						var body = self.transportStub.getCall(1).args[1];
						self.xmlBody = new Dom().parseFromString(body);
						done();
					});
			});

			afterEach(function() {
				transport.post.restore();
				self.clock.restore();
			});

			it('post request to endpoint', function() {
			 	expect(self.transportStub.getCall(1).args[0]).to.equal("https://test.crm4.dynamics.com/XRMServices/2011/Organization.svc");
			});

			it('has organizationEndpoint in header', function() {
				var node = xpath.select("//*[local-name() = 'To']/text()", self.xmlBody);
				expect(node[0].nodeValue).to.equal('https://test.crm4.dynamics.com/XRMServices/2011/Organization.svc');
			});

			it('has messageid in header', function() {
				var node = xpath.select("//*[local-name() = 'MessageID']/text()", self.xmlBody);
				expect(node[0].nodeValue.length).to.equal(36);
			});

			it('sets created date to current time', function() {
				var node = xpath.select("//*[local-name() = 'Created']/text()", self.xmlBody);
				expect(node).to.have.length(1);
				expect(node[0].nodeValue).to.equal("2014-08-18T18:40:00.000Z");
			});

			it('sets expiry date in one hour', function() {
				var node = xpath.select("//*[local-name() = 'Expires']/text()", self.xmlBody);
				expect(node).to.have.length(1);
				expect(node[0].nodeValue).to.equal("2014-08-18T19:40:00.000Z");
			});

			it('uses tokenone from authetication', function() {
				var node = xpath.select("//*[local-name() = 'CipherValue']/text()", self.xmlBody);

				expect(node[0].nodeValue).to.equal("1");
			});

			it('uses tokentwo from authetication', function() {
				var node = xpath.select("//*[local-name() = 'CipherValue']/text()", self.xmlBody);

				expect(node[1].nodeValue).to.equal("2");
			});

			it('uses keyIdentifier from authetication', function() {
				var node = xpath.select("//*[local-name() = 'KeyIdentifier']/text()", self.xmlBody);

				expect(node[0].nodeValue).to.equal("3");
			});
		});
	});

	describe('whoAmI request', function() {
		describe('success', function() {
			var data;

			beforeEach(function(done) {
				var deferred = promise.pending();
				var transportStub = sinon.stub(transport, "post");
				transportStub.returns(deferred.promise);

				deferred.resolve(soapResponse.whoAmIResponse());

				var client = new Xrm({organizationUrl: 'https://test.crm4.dynamics.com'});
				client.whoAmI()
					.then(function(response) {
						data = response;
						done();
					});
			});

			afterEach(function() {
				transport.post.restore();
			});

			it('has response name', function() {
				expect(data.ResponseName).to.equal('WhoAmI');
			});

			it('has userid', function() {
				expect(data.Results.UserId).to.equal('b4961e7a-5ffa-4854-9d1d-54e8bbd8534b');
			});

			it('has businessUnitId', function() {
				expect(data.Results.BusinessUnitId).to.equal('fde1eb0d-0d2d-e411-80eb-d89d67634e04');
			});

			it('has organizationId', function() {
				expect(data.Results.OrganizationId).to.equal('af9efde1-b654-4af7-a808-76a8d288bc50');
			});
		});
	});

	describe('create request', function() {
		describe('success', function() {
			var data;

			beforeEach(function(done) {
				var deferred = promise.pending();
				var transportStub = sinon.stub(transport, "post");
				transportStub.returns(deferred.promise);

				deferred.resolve(soapResponse.createResponse());

				var client = new Xrm({organizationUrl: 'https://test.crm4.dynamics.com'});
				client.create('account', {name: 'a'})
					.then(function(response) {
						data = response;
						done();
					});
			});

			afterEach(function() {
				transport.post.restore();
			});

			it('has id of created entity', function() {
				expect(data).to.equal('b83a89a2-afb0-e411-9ebc-6c3be5be4fb8');
			});
		});
	});
})();