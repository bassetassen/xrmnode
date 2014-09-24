(function() {
	'use strict';

	// Response tests:
	// get two tokens and keyidentifier

	// Failure
	// Parse and show error message
	// Not an online url
	// Sjekke at input parameterne gyldige

	var sinon = require("sinon");
	var expect = require("chai").expect;
	var transport = require("../lib/transport");
	var xrm = require("../lib/xrmnode");
	var xpath = require('xpath');
	var Dom = require('xmldom').DOMParser;
	var promise = require("bluebird");

	describe('authentication', function() {
		describe('success', function() {
			beforeEach(function() {
				var deferred = promise.pending();
				this.transportStub = sinon.stub(transport, "post");
				this.transportStub.returns(deferred.promise);
				this.clock = sinon.useFakeTimers(1408387200000); // 2014-08-18 20:40 GMT+1

				xrm.authenticate('test.crm4.dynamics.com', 'testuser', 'secret');

				var body = this.transportStub.getCall(0).args[1];
				this.xmlBody = new Dom().parseFromString(body);
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
		
			it('gets tokens from response', function(done) {
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
				var deferred = promise.pending();
				this.transportStub.returns(deferred.promise);
				deferred.resolve(response);

				xrm.authenticate('', '', '')
					.then(function(tokens) {
						expect(tokens.one).to.equal("1");
						expect(tokens.two).to.equal("2");
						expect(tokens.keyIdentifier).to.equal("3");
						done();
					})
					.catch(function(e){});
			});
		});

		describe('wrong username/password', function() {
			beforeEach(function() {
				this.transportStub = sinon.stub(transport, "post");
			});

			it('returns authentication failure', function(done) {
				var deferred = promise.pending();
				var soapResponse = '<S:Envelope xmlns:S="http://www.w3.org/2003/05/soap-envelope" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" xmlns:wst="http://schemas.xmlsoap.org/ws/2005/02/trust" xmlns:psf="http://schemas.microsoft.com/Passport/SoapServices/SOAPFault">' +
									'<S:Body><S:Fault><S:Code><S:Value>S:Sender</S:Value><S:Subcode><S:Value>wst:FailedAuthentication</S:Value></S:Subcode></S:Code>' +
									'<S:Reason><S:Text xml:lang="en-US">Authentication Failure</S:Text></S:Reason>' +
									'<S:Detail><psf:error><psf:value>0x80048821</psf:value><psf:internalerror><psf:code>0x80041012</psf:code><psf:text>The entered and stored passwords do not match.</psf:text></psf:internalerror></psf:error></S:Detail>' +
									'</S:Fault></S:Body></S:Envelope>';				
				this.transportStub.returns(deferred.promise);
				deferred.resolve(soapResponse);

				xrm.authenticate('', '', '')
					.then(function(){})
					.catch(function(e){
				    	expect(e).to.equal('Authentication Failure');
				    	done();
					});
			});
		});

		describe('wrong organizationurl', function() {

		});

		describe('not online organization', function() {

		});
	});
})();