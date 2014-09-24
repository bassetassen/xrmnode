'use strict';

var transport = require('./transport');
var uuid = require('node-uuid');
var promise = require("bluebird");
var xpath = require('xpath');
var Dom = require('xmldom').DOMParser;

var createUUid = function() {
	return uuid.v4();
};

var getAddress = function(organizationUrl) {
  if(organizationUrl.toLowerCase().indexOf("crm.dynamics.com") !== -1) {
    return "crmna:dynamics.com";
  }
  else if(organizationUrl.toLowerCase().indexOf("crm4.dynamics.com") !== -1) {
    return "crmemea:dynamics.com";
  }
  else if(organizationUrl.toLowerCase().indexOf("crm5.dynamics.com") !== -1) {
    return "crmapac:dynamics.com";
  }
  else {

  }
};

var authBody = function(organizationUrl, username, password) {
	var created = new Date();
	var expiry = new Date();
	expiry.setMinutes(expiry.getMinutes() + 60);

	var soapEnvelope = "<s:Envelope xmlns:s=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:a=\"http://www.w3.org/2005/08/addressing\" xmlns:u=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\">" +
    "<s:Header>" +
    "<a:Action s:mustUnderstand=\"1\">http://schemas.xmlsoap.org/ws/2005/02/trust/RST/Issue</a:Action>" +
    "<a:MessageID>urn:uuid:" + createUUid() + "</a:MessageID>" +
    "<a:ReplyTo>" +
    "<a:Address>http://www.w3.org/2005/08/addressing/anonymous</a:Address>" +
    "</a:ReplyTo>" +
    "<a:To s:mustUnderstand=\"1\">https://login.microsoftonline.com/RST2.srf</a:To>" +
    "<o:Security s:mustUnderstand=\"1\" xmlns:o=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\">" +
    "<u:Timestamp u:Id=\"_0\">" +
    "<u:Created>" + created.toISOString() + "</u:Created>" +
    "<u:Expires>" + expiry.toISOString() + "</u:Expires>" +
    "</u:Timestamp>" +
    "<o:UsernameToken u:Id=\"uuid-" + createUUid() + "-1\">" +
    "<o:Username>" +  username + "</o:Username>" +
    "<o:Password Type=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText\">" + password + "</o:Password>" +
    "</o:UsernameToken>" +
    "</o:Security>" +
    "</s:Header>" +
    "<s:Body>" +
    "<t:RequestSecurityToken xmlns:t=\"http://schemas.xmlsoap.org/ws/2005/02/trust\">" +
    "<wsp:AppliesTo xmlns:wsp=\"http://schemas.xmlsoap.org/ws/2004/09/policy\">" +
    "<a:EndpointReference>" +
    "<a:Address>urn:" + getAddress(organizationUrl) + "</a:Address>" +
    "</a:EndpointReference>" +
    "</wsp:AppliesTo>" +
    "<t:RequestType>http://schemas.xmlsoap.org/ws/2005/02/trust/Issue</t:RequestType>" +
    "</t:RequestSecurityToken>" +
    "</s:Body>" +
    "</s:Envelope>";

	return soapEnvelope;
};

var namespaces = {
    "S": "http://www.w3.org/2003/05/soap-envelope",
    "wst": "http://schemas.xmlsoap.org/ws/2005/02/trust",
    "wsse": "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
};


var authenticate = function(organizationEnpoint, username, password) {
    var deferred = promise.pending();

    var soapMessage = authBody(organizationEnpoint, username, password);
    transport.post('https://login.microsoftonline.com/RST2.srf', soapMessage).then(function(response) {
        var responseXml = new Dom().parseFromString(response);
        var select = xpath.useNamespaces(namespaces);

        var node = select("//S:Fault", responseXml);
        if(node.length > 0) {
            var reasonNode = select("//S:Reason/S:Text/text()", responseXml);
            if(reasonNode.length > 0) {
                var d = reasonNode[0].nodeValue;
                deferred.reject(d);
            }
        }
        else {
            var tokenNodes = select("//*[local-name() = 'CipherValue']", responseXml);
            var keyIdentifier = select("//wsse:KeyIdentifier/text()", responseXml);

            deferred.resolve({
                one: tokenNodes[0].firstChild.data,
                two: tokenNodes[1].firstChild.data,
                keyIdentifier: keyIdentifier[0].nodeValue
            });
        }
    });

    return deferred.promise;
};

exports.authenticate = authenticate;