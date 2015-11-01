'use strict';

var transport = require('./transport');
var promise = require('bluebird');
var xpath = require('xpath');
var Dom = require('xmldom').DOMParser;
var requests = require('./requestFactory');
var settings = require('./settings');

var Xrm = function(args) {
    var tokens = {};
    var organizationEndpoint = settings.getOrganizationEndpoint(args.organizationUrl);

    var namespaces = {
        'S': 'http://www.w3.org/2003/05/soap-envelope',
        's': 'http://www.w3.org/2003/05/soap-envelope',
        'wst': 'http://schemas.xmlsoap.org/ws/2005/02/trust',
        'wsse': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd',
        'b': 'http://schemas.microsoft.com/xrm/2011/Contracts'
    };

    this.authenticate = function(username, password) {
        var deferred = promise.pending();

        try {
            var soapMessage = requests.authenticationEnvelope(organizationEndpoint, username, password);

            transport.post(settings.authUrl, soapMessage).then(function(response) {
                var responseXml = new Dom().parseFromString(response);
                var select = xpath.useNamespaces(namespaces);

                var node = select('//S:Fault', responseXml);
                if(node.length > 0) {
                    var reasonNode = select('//S:Reason/S:Text/text()', responseXml);
                    if(reasonNode.length > 0) {
                        var d = reasonNode[0].nodeValue;
                        deferred.reject(d);
                    }
                }
                else {
                    var tokenNodes = select('//*[local-name() = \'CipherValue\']', responseXml);
                    var keyIdentifier = select('//wsse:KeyIdentifier/text()', responseXml);

                    tokens = {
                        one: tokenNodes[0].firstChild.data,
                        two: tokenNodes[1].firstChild.data,
                        keyIdentifier: keyIdentifier[0].nodeValue
                    };

                    deferred.resolve(tokens);
                }
            });
        }
        catch(e) {
            deferred.reject(e.message);
        }

        return deferred.promise;
    };

    this.whoAmI = function() {
        var deferred = promise.pending();

        var whoAmIRequest = requests.whoAmI(organizationEndpoint, tokens);

        transport.post(organizationEndpoint, whoAmIRequest)
        .then(function(response) {
            var responseXml = new Dom().parseFromString(response);
            var select = xpath.useNamespaces(namespaces);

            var data = { Results: {}};
            var responseName = select('//*[local-name() = \'ResponseName\']/text()', responseXml);
            if(responseName && responseName[0]) {
                data.ResponseName = responseName[0].nodeValue;
            }

            var values = select('//*[local-name() = \'Results\']/*[local-name() = \'KeyValuePairOfstringanyType\']', responseXml);
            if(values && values.length > 0) {
                var keys = select('//*[local-name() = \'key\']/text()', values[0]);
                var valuePart = select('//*[local-name() = \'value\']/text()', values[0]);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i].nodeValue;
                    var value = valuePart[i].nodeValue;

                    data.Results[key] = value;
                }
            }

            deferred.resolve(data);
        })
        .catch(function(e) {
          deferred.reject(e);
        });

        return deferred.promise;
    };

    this.create = function(entityLogicalName, attributes) {
        var deferred = promise.pending();

        var createRequest = requests.create(organizationEndpoint, tokens, entityLogicalName, attributes);

        transport.post(organizationEndpoint, createRequest)
        .then(function(response) {
            var responseXml = new Dom().parseFromString(response);
            var select = xpath.useNamespaces(namespaces);

            var node = select('//S:Fault', responseXml);
            if(node.length > 0) {
                var reasonNode = select('//S:Reason/S:Text/text()', responseXml);
                if(reasonNode.length > 0) {
                    var d = reasonNode[0].nodeValue;
                    deferred.reject(d);
                }
            }
            else {
                var createResult = select('//*[local-name() = \'CreateResult\']/text()', responseXml);
                var idValue = '';
                if(createResult && createResult[0]) {
                    idValue = createResult[0].nodeValue;
                }

                deferred.resolve(idValue);
            }
        })
        .catch(function(e) {
            deferred.reject(e);
        });

        return deferred.promise;
    };
};

module.exports = Xrm;
