'use strict';

var uuid = require('node-uuid');
var settings = require('./settings');
var templates = require('./templates');

var createUUid = function() {
  return uuid.v4();
};

var created = function() {
  return new Date().toISOString();
};

var expiry = function() {
  var now = new Date();
  now.setMinutes(now.getMinutes() + 60);

  return now.toISOString();
};

var getAddress = function(organizationUrl) {
  if(organizationUrl.toLowerCase().indexOf('crm.dynamics.com') !== -1) {
    return 'crmna:dynamics.com';
  }
  else if(organizationUrl.toLowerCase().indexOf('crm4.dynamics.com') !== -1) {
    return 'crmemea:dynamics.com';
  }
  else if(organizationUrl.toLowerCase().indexOf('crm5.dynamics.com') !== -1) {
    return 'crmapac:dynamics.com';
  }
  else {
    throw Error('Not a online URL');
  }
};

var createAuthenticationEnvelope = function(organizationUrl, username, password) {
  var soapEnvelope = templates.authenticationEnvelope
    .replace('{messageId}', createUUid())
    .replace('{authUrl}', settings.authUrl)
    .replace('{created}', created())
    .replace('{expires}', expiry())
    .replace('{usernameToken}', createUUid())
    .replace('{username}', username)
    .replace('{password}', password)
    .replace('{organizationUrl}', getAddress(organizationUrl));

    return soapEnvelope;
};

var createHeader = function(organizationEndpoint, tokens, message) {
  var header = templates.soapRequestHeader
    .replace('{message}', message)
    .replace('{messageId}', createUUid())
    .replace('{organizationUrl}', organizationEndpoint)
    .replace('{created}', created())
    .replace('{expires}', expiry())
    .replace('{keyIdentifier}', tokens.keyIdentifier)
    .replace('{tokenOne}', tokens.one)
    .replace('{tokenTwo}', tokens.two);

      return header;
};

var whoAmIRequest = function(organizationEndpoint, tokens) {
  var header = createHeader(organizationEndpoint, tokens, 'Execute');

  var request = templates.soapEnvelopeTemplate
    .replace('{header}', header)
    .replace('{body}', templates.whoAmIRequestBodyTemplate);

  return request;
};

var createRequest = function(organizationEndpoint, tokens) {
  var header = createHeader(organizationEndpoint, tokens, 'Create');
  var body = templates.createRequestBodyTemplate
    .replace('{logicalname}', 'account');

  var request = templates.soapEnvelopeTemplate
    .replace('{header}', header)
    .replace('{body}', body);

  return request;
};

module.exports.authenticationEnvelope = createAuthenticationEnvelope;
module.exports.whoAmI = whoAmIRequest;
module.exports.create = createRequest;
