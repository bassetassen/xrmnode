'use strict';

var transport = require('./transport');

exports.authenticate = function(organizationEnpoint, username, password) {
	transport.post('https://login.microsoftonline.com/RST2.srf');
};