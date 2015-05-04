'use strict';

var uuid = require('node-uuid');
var settings = require('./settings');


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
    throw Error('Not a online URL');
  }
};

var createAuthenticationEnvelope = function(organizationUrl, username, password) {
  var soapEnvelope = "<s:Envelope xmlns:s=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:a=\"http://www.w3.org/2005/08/addressing\" xmlns:u=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\">" +
    "<s:Header>" +
    "<a:Action s:mustUnderstand=\"1\">http://schemas.xmlsoap.org/ws/2005/02/trust/RST/Issue</a:Action>" +
    "<a:MessageID>urn:uuid:" + createUUid() + "</a:MessageID>" +
    "<a:ReplyTo>" +
    "<a:Address>http://www.w3.org/2005/08/addressing/anonymous</a:Address>" +
    "</a:ReplyTo>" +
    "<a:To s:mustUnderstand=\"1\">" + settings.authUrl + "</a:To>" +
    "<o:Security s:mustUnderstand=\"1\" xmlns:o=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\">" +
    "<u:Timestamp u:Id=\"_0\">" +
    "<u:Created>" + created() + "</u:Created>" +
    "<u:Expires>" + expiry() + "</u:Expires>" +
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

var createSoapEnvelope = function(organizationEndpoint, tokens) {
  var whoAmIRequest = '<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
      createHeader(organizationEndpoint, tokens) +
      '<s:Body><Execute xmlns="http://schemas.microsoft.com/xrm/2011/Contracts/Services" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">' +
      '<request i:type="c:WhoAmIRequest" xmlns:b="http://schemas.microsoft.com/xrm/2011/Contracts" xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:c="http://schemas.microsoft.com/crm/2011/Contracts">' +
      '<b:Parameters xmlns:d="http://schemas.datacontract.org/2004/07/System.Collections.Generic"/><b:RequestId i:nil="true"/>' +
      '<b:RequestName>WhoAmI</b:RequestName>' +
      '</request></Execute></s:Body></s:Envelope>';

      return whoAmIRequest;
};

var createHeader = function(organizationEndpoint, tokens) {
  var header = '<s:Header><a:Action s:mustUnderstand="1">http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute</a:Action>' +
      '<a:MessageID>' + createUUid() + '</a:MessageID>' +
      '<a:ReplyTo><a:Address>http://www.w3.org/2005/08/addressing/anonymous</a:Address></a:ReplyTo>' +
      '<a:To s:mustUnderstand="1">' + organizationEndpoint + '</a:To>' +
      '<o:Security s:mustUnderstand="1" xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">' +
      '<u:Timestamp u:Id="_0"><u:Created>' + created() + '</u:Created>' +
      '<u:Expires>' + expiry() + '</u:Expires></u:Timestamp>' +
      '<EncryptedData Id="Assertion0" Type="http://www.w3.org/2001/04/xmlenc#Element" xmlns="http://www.w3.org/2001/04/xmlenc#">' +
      '<EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#tripledes-cbc"></EncryptionMethod>' +
      '<ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><EncryptedKey><EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p"></EncryptionMethod>' +
      '<ds:KeyInfo Id="keyinfo"><wsse:SecurityTokenReference xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">' +
      '<wsse:KeyIdentifier EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509SubjectKeyIdentifier">' + tokens.keyIdentifier + '</wsse:KeyIdentifier>' +
      '</wsse:SecurityTokenReference></ds:KeyInfo><CipherData>' +
      '<CipherValue>' + tokens.one + '</CipherValue>' +
      '</CipherData></EncryptedKey></ds:KeyInfo><CipherData>' +
      '<CipherValue>' + tokens.two + '</CipherValue>' +
      '</CipherData></EncryptedData></o:Security></s:Header>';

      return header;
};

var createRequest = function(organizationEndpoint, tokens) {
    var createRequest = '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">' +
        createHeader(organizationEndpoint, tokens) +
          '<s:Body>' +
            '<Create xmlns="http://schemas.microsoft.com/xrm/2011/Contracts/Services" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">' +
              '<entity xmlns:a="http://schemas.microsoft.com/xrm/2011/Contracts">' +
                '<a:Attributes xmlns:b="http://schemas.datacontract.org/2004/07/System.Collections.Generic">' +
                  '<a:KeyValuePairOfstringanyType>' +
                    '<b:key>name</b:key>' +
                    '<b:value i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">Test</b:value>' +
                  '</a:KeyValuePairOfstringanyType>' +
                '</a:Attributes>' +
              '<a:EntityState i:nil="true" />' +
        '<a:FormattedValues xmlns:b="http://schemas.datacontract.org/2004/07/System.Collections.Generic" />' +
        '<a:Id>00000000-0000-0000-0000-000000000000</a:Id>' +
        '<a:LogicalName>account</a:LogicalName>' +
        '<a:RelatedEntities xmlns:b="http://schemas.datacontract.org/2004/07/System.Collections.Generic" />' +
      '</entity>' +
    '</Create>' +
  '</s:Body>' +
'</s:Envelope>';

      return createRequest;
};

exports.authenticationEnvelope = createAuthenticationEnvelope;
exports.createSoapEnvelope = createSoapEnvelope;
