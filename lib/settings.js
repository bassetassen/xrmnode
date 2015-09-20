'use strict';

var crmService = '/XRMServices/2011/Organization.svc';

exports.authUrl = 'https://login.microsoftonline.com/RST2.srf';

exports.getOrganizationEndpoint = function(organizationUrl) {
  return organizationUrl + crmService;
};
