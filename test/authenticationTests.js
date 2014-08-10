'use strict';

// Tests

// Request tests:
// Region from url
// Created and expiry timestamps
// Username
// Password
// MessageId
// UsernameToken

// Response tests:
// get two tokens and keyidentifier

var sinon = require("sinon");
var assert = require("assert");
var transport = require("../lib/transport");
var xrm = require("../lib/xrmnode");

describe('authentication', function() {
	beforeEach(function() {
		this.transportStub = sinon.stub(transport, "post");
	});

	afterEach(function() {
		transport.post.restore();
	});

	it('should post request to auth endpoint', function() {
		xrm.authenticate('', '', '');

		assert.equal("https://login.microsoftonline.com/RST2.srf", this.transportStub.getCall(0).args[0]);
	});
});