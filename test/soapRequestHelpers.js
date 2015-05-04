(function() {
	'use strict';

	var authenticationFailureResponse = function() {
		var response = '<S:Envelope xmlns:S="http://www.w3.org/2003/05/soap-envelope" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" xmlns:wst="http://schemas.xmlsoap.org/ws/2005/02/trust" xmlns:psf="http://schemas.microsoft.com/Passport/SoapServices/SOAPFault">' +
									'<S:Body><S:Fault><S:Code><S:Value>S:Sender</S:Value><S:Subcode><S:Value>wst:FailedAuthentication</S:Value></S:Subcode></S:Code>' +
									'<S:Reason><S:Text xml:lang="en-US">Authentication Failure</S:Text></S:Reason>' +
									'<S:Detail><psf:error><psf:value>0x80048821</psf:value><psf:internalerror><psf:code>0x80041012</psf:code><psf:text>The entered and stored passwords do not match.</psf:text></psf:internalerror></psf:error></S:Detail>' +
									'</S:Fault></S:Body></S:Envelope>';
		return response;
	};

	var validAutheticationResponse = function() {
			var response = '<?xml version="1.0" encoding="utf-8" ?>' +
						'<S:Envelope xmlns:S="http://www.w3.org/2003/05/soap-envelope" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" xmlns:wsa="http://www.w3.org/2005/08/addressing">' +
						'<S:Header>' +
							'<wsa:Action xmlns:S="http://www.w3.org/2003/05/soap-envelope" xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" wsu:Id="Action" S:mustUnderstand="1">http://schemas.xmlsoap.org/ws/2005/02/trust/RSTR/Issue</wsa:Action>' +
							'<wsa:To xmlns:S="http://www.w3.org/2003/05/soap-envelope" xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" wsu:Id="To" S:mustUnderstand="1">http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</wsa:To>' +
							'<wsse:Security S:mustUnderstand="1">' +
								'<wsu:Timestamp xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" wsu:Id="TS">' +
									'<wsu:Created>2014-09-24T20:24:42Z</wsu:Created>' +
									'<wsu:Expires>2014-09-24T20:29:42Z</wsu:Expires>' +
								'</wsu:Timestamp></wsse:Security>' +
						'</S:Header>' +
						'<S:Body>' +
							'<wst:RequestSecurityTokenResponse xmlns:S="http://www.w3.org/2003/05/soap-envelope" xmlns:wst="http://schemas.xmlsoap.org/ws/2005/02/trust" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" xmlns:saml="urn:oasis:names:tc:SAML:1.0:assertion" xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy" xmlns:psf="http://schemas.microsoft.com/Passport/SoapServices/SOAPFault">' +
								'<wst:TokenType>urn:oasis:names:tc:SAML:1.0</wst:TokenType>' +
								'<wsp:AppliesTo xmlns:wsa="http://www.w3.org/2005/08/addressing">' +
									'<wsa:EndpointReference>' +
										'<wsa:Address>urn:crmemea:dynamics.com</wsa:Address>' +
									'</wsa:EndpointReference>' +
								'</wsp:AppliesTo>' +
								'<wst:Lifetime>' +
									'<wsu:Created>2014-09-24T20:24:42Z</wsu:Created>' +
									'<wsu:Expires>2014-09-25T04:24:42Z</wsu:Expires>' +
								'</wst:Lifetime>' +
								'<wst:RequestedSecurityToken>' +
									'<EncryptedData xmlns="http://www.w3.org/2001/04/xmlenc#" Id="Assertion0" Type="http://www.w3.org/2001/04/xmlenc#Element">' +
										'<EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#tripledes-cbc"></EncryptionMethod>' +
										'<ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">' +
											'<EncryptedKey>' +
												'<EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p"></EncryptionMethod>' +
												'<ds:KeyInfo Id="keyinfo">' +
													'<wsse:SecurityTokenReference>' +
														'<wsse:KeyIdentifier EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509SubjectKeyIdentifier">3</wsse:KeyIdentifier>' +
													'</wsse:SecurityTokenReference>' +
												'</ds:KeyInfo>' +
												'<CipherData>' +
													'<CipherValue>1</CipherValue>' +
												'</CipherData>' +
											'</EncryptedKey>' +
										'</ds:KeyInfo>' +
										'<CipherData>' +
											'<CipherValue>2</CipherValue>' +
										'</CipherData>' +
									'</EncryptedData>' +
								'</wst:RequestedSecurityToken>' +
								'<wst:RequestedAttachedReference>' +
									'<wsse:SecurityTokenReference>' +
										'<wsse:KeyIdentifier ValueType="http://docs.oasis-open.org/wss/oasis-wss-saml-token-profile-1.0#SAMLAssertionID">4</wsse:KeyIdentifier>' +
									'</wsse:SecurityTokenReference>' +
								'</wst:RequestedAttachedReference>' +
								'<wst:RequestedUnattachedReference>' +
									'<wsse:SecurityTokenReference>' +
										'<wsse:KeyIdentifier ValueType="http://docs.oasis-open.org/wss/oasis-wss-saml-token-profile-1.0#SAMLAssertionID">5</wsse:KeyIdentifier>' +
									'</wsse:SecurityTokenReference>' +
								'</wst:RequestedUnattachedReference>' +
								'<wst:RequestedProofToken>' +
									'<wst:BinarySecret>6</wst:BinarySecret>' +
								'</wst:RequestedProofToken>' +
							'</wst:RequestSecurityTokenResponse>' +
						'</S:Body>' +
						'</S:Envelope>';

				return response;
			};

	var whoAmIResponse = function() {
		var response =
		'<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
			'<s:Header>' +
				'<a:Action s:mustUnderstand="1">http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/ExecuteResponse</a:Action>' +
				'<a:RelatesTo>fd7bf7af-753c-43f7-a157-d4bbaaffab84</a:RelatesTo>' +
				'<ActivityId CorrelationId="0d8aeaf2-16f3-4c0c-a0ee-15ca5d403b45" xmlns="http://schemas.microsoft.com/2004/09/ServiceModel/Diagnostics">00000000-0000-0000-0000-000000000000</ActivityId>' +
				'<o:Security s:mustUnderstand="1" xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">' +
					'<u:Timestamp u:Id="_0">' +
						'<u:Created>2014-09-29T20:11:25.980Z</u:Created>' +
						'<u:Expires>2014-09-29T20:16:25.980Z</u:Expires>' +
					'</u:Timestamp>' +
				'</o:Security>' +
			'</s:Header>' +
			'<s:Body>' +
				'<ExecuteResponse xmlns="http://schemas.microsoft.com/xrm/2011/Contracts/Services">' +
					'<ExecuteResult i:type="c:WhoAmIResponse" xmlns:b="http://schemas.microsoft.com/xrm/2011/Contracts" xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:c="http://schemas.microsoft.com/crm/2011/Contracts">' +
						'<b:ResponseName>WhoAmI</b:ResponseName>' +
						'<b:Results xmlns:d="http://schemas.datacontract.org/2004/07/System.Collections.Generic">' +
							'<b:KeyValuePairOfstringanyType>' +
								'<d:key>UserId</d:key>' +
								'<d:value i:type="e:guid" xmlns:e="http://schemas.microsoft.com/2003/10/Serialization/">b4961e7a-5ffa-4854-9d1d-54e8bbd8534b</d:value>' +
							'</b:KeyValuePairOfstringanyType>' +
							'<b:KeyValuePairOfstringanyType>' +
								'<d:key>BusinessUnitId</d:key>' +
								'<d:value i:type="e:guid" xmlns:e="http://schemas.microsoft.com/2003/10/Serialization/">fde1eb0d-0d2d-e411-80eb-d89d67634e04</d:value>' +
							'</b:KeyValuePairOfstringanyType>' +
							'<b:KeyValuePairOfstringanyType>' +
								'<d:key>OrganizationId</d:key>' +
								'<d:value i:type="e:guid" xmlns:e="http://schemas.microsoft.com/2003/10/Serialization/">af9efde1-b654-4af7-a808-76a8d288bc50</d:value>' +
							'</b:KeyValuePairOfstringanyType>' +
						'</b:Results>' +
					'</ExecuteResult>' +
				'</ExecuteResponse>' +
			'</s:Body>' +
		'</s:Envelope>';

		return response;
	};

	var createResponse = function() {
		return '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">' +
  				'<s:Body>' +
    			'<CreateResponse xmlns="http://schemas.microsoft.com/xrm/2011/Contracts/Services" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">' +
    			'<CreateResult>b83a89a2-afb0-e411-9ebc-6c3be5be4fb8</CreateResult>' +
    			'</CreateResponse>' +
  				'</s:Body>' +
				'</s:Envelope>';
	};

	exports.authenticationFailureResponse = authenticationFailureResponse;
	exports.validAutheticationResponse = validAutheticationResponse;
	exports.whoAmIResponse = whoAmIResponse;
	exports.createResponse = createResponse;
})();