'use strict';
// Response tests:
// get two tokens and keyidentifier

// Failure
// Parse and show error message
// Not an online url

var sinon = require("sinon");
var expect = require("chai").expect;
var transport = require("../lib/transport");
var xrm = require("../lib/xrmnode");
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;

describe('authentication', function() {
	describe('success', function() {
		beforeEach(function() {
			this.transportStub = sinon.stub(transport, "post");
			this.clock = sinon.useFakeTimers(1408387200000);

			xrm.authenticate('test.crm4.dynamics.com', 'testuser', 'secret');

			var body = this.transportStub.getCall(0).args[1];
			this.xmlBody = new dom().parseFromString(body);
		});

		afterEach(function() {
			transport.post.restore();
			this.clock.restore();
		});

		it('post request to auth endpoint', function() {
			expect(this.transportStub.getCall(0).args[0]).to.equal("https://login.microsoftonline.com/RST2.srf");
		});

		it('creates messageid', function() {
			var node = xpath.select("//*[local-name() = 'MessageID']", this.xmlBody);
			expect(node).to.have.length(1);
		});

		it('sets created date to current time', function() {
			var node = xpath.select("//*[local-name() = 'Created']", this.xmlBody);
			expect(node).to.have.length(1);
			expect(node[0].firstChild.data).to.equal("2014-08-18T18:40:00.000Z");
		});

		it('sets expiry date in one hour', function() {
			var node = xpath.select("//*[local-name() = 'Expires']", this.xmlBody);
			expect(node).to.have.length(1);
			expect(node[0].firstChild.data).to.equal("2014-08-18T19:40:00.000Z");
		});

		it('sets username', function() {
			var node = xpath.select("//*[local-name() = 'Username']", this.xmlBody);
			expect(node).to.have.length(1);
			expect(node[0].firstChild.data).to.equal("testuser");
		});

		it('sets password', function() {
			var node = xpath.select("//*[local-name() = 'Password']", this.xmlBody);
			expect(node).to.have.length(1);
			expect(node[0].firstChild.data).to.equal("secret");
		});

		it('sets correct address based on region', function() {
			var node = xpath.select("//*[local-name() = 'Address']", this.xmlBody);
			expect(node).to.have.length(2);
			expect(node[1].firstChild.data).to.equal("urn:crmemea:dynamics.com");
		});
	
	});

	describe('wrong username', function() {

	});

	describe('wrong password', function() {

	});

	describe('wrong organizationurl', function() {

	});
});