'use strict';

var soapEnvelope =
	'<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
	'{header}' +
	'{body}' +
	'</s:Envelope>';

var authenticationHeader = "<s:Header>" +
    "<a:Action s:mustUnderstand=\"1\">http://schemas.xmlsoap.org/ws/2005/02/trust/RST/Issue</a:Action>" +
    "<a:MessageID>urn:uuid:{messageId}</a:MessageID>" +
    "<a:ReplyTo>" +
    "<a:Address>http://www.w3.org/2005/08/addressing/anonymous</a:Address>" +
    "</a:ReplyTo>" +
    "<a:To s:mustUnderstand=\"1\">{authUrl}</a:To>" +
    "<o:Security s:mustUnderstand=\"1\" xmlns:o=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\">" +
    "<u:Timestamp u:Id=\"_0\">" +
    "<u:Created>{created}</u:Created>" +
    "<u:Expires>{expires}</u:Expires>" +
    "</u:Timestamp>" +
    "<o:UsernameToken u:Id=\"uuid-{usernameToken}-1\">" +
    "<o:Username>{username}</o:Username>" +
    "<o:Password Type=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText\">{password}</o:Password>" +
    "</o:UsernameToken>" +
    "</o:Security>" +
    "</s:Header>";
	
var authenticationBody = "<s:Body>" +
    "<t:RequestSecurityToken xmlns:t=\"http://schemas.xmlsoap.org/ws/2005/02/trust\">" +
    "<wsp:AppliesTo xmlns:wsp=\"http://schemas.xmlsoap.org/ws/2004/09/policy\">" +
    "<a:EndpointReference>" +
    "<a:Address>urn:{organizationUrl}</a:Address>" +
    "</a:EndpointReference>" +
    "</wsp:AppliesTo>" +
    "<t:RequestType>http://schemas.xmlsoap.org/ws/2005/02/trust/Issue</t:RequestType>" +
    "</t:RequestSecurityToken>" +
    "</s:Body>";

var soapAuthenticationEnvelopeTemplate = soapEnvelope
  	.replace("{header}", authenticationHeader)
	.replace("{body}", authenticationBody);

var headerTemplate = '<s:Header>' +
	'<a:Action s:mustUnderstand="1">http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/{message}</a:Action>' +
	'<a:MessageID>{messageId}</a:MessageID>' +
	'<a:ReplyTo><a:Address>http://www.w3.org/2005/08/addressing/anonymous</a:Address></a:ReplyTo>' +
	'<a:To s:mustUnderstand="1">{organizationUrl}</a:To>' +
	'<o:Security s:mustUnderstand="1" xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">' +
	'<u:Timestamp u:Id="_0"><u:Created>{created}</u:Created>' +
	'<u:Expires>{expires}</u:Expires></u:Timestamp>' +
	'<EncryptedData Id="Assertion0" Type="http://www.w3.org/2001/04/xmlenc#Element" xmlns="http://www.w3.org/2001/04/xmlenc#">' +
	'<EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#tripledes-cbc"></EncryptionMethod>' +
	'<ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><EncryptedKey><EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p"></EncryptionMethod>' +
	'<ds:KeyInfo Id="keyinfo"><wsse:SecurityTokenReference xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">' +
	'<wsse:KeyIdentifier EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509SubjectKeyIdentifier">{keyIdentifier}</wsse:KeyIdentifier>' +
	'</wsse:SecurityTokenReference></ds:KeyInfo><CipherData>' +
	'<CipherValue>{tokenOne}</CipherValue>' +
	'</CipherData></EncryptedKey></ds:KeyInfo><CipherData>' +
	'<CipherValue>{tokenTwo}</CipherValue>' +
	'</CipherData></EncryptedData></o:Security></s:Header>';

var whoAmIRequestTemplate = 
	'<s:Body><Execute xmlns="http://schemas.microsoft.com/xrm/2011/Contracts/Services" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">' +
	'<request i:type="c:WhoAmIRequest" xmlns:b="http://schemas.microsoft.com/xrm/2011/Contracts" xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:c="http://schemas.microsoft.com/crm/2011/Contracts">' +
	'<b:Parameters xmlns:d="http://schemas.datacontract.org/2004/07/System.Collections.Generic"/><b:RequestId i:nil="true"/>' +
	'<b:RequestName>WhoAmI</b:RequestName>' +
	'</request></Execute></s:Body>';

var createRequestTemplate = 
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
				'<a:LogicalName>{logicalname}</a:LogicalName>' +
				'<a:RelatedEntities xmlns:b="http://schemas.datacontract.org/2004/07/System.Collections.Generic" />' +
			'</entity>' +
		'</Create>' +
	'</s:Body>';

module.exports.soapEnvelopeTemplate = soapEnvelope;
module.exports.soapRequestHeader = headerTemplate;
module.exports.authenticationEnvelope = soapAuthenticationEnvelopeTemplate;
module.exports.whoAmIRequestBodyTemplate = whoAmIRequestTemplate;
module.exports.createRequestBodyTemplate = createRequestTemplate;