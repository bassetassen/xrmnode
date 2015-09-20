'use strict';

var rest = require('restler');
var promise = require('bluebird');

exports.post = function(url, body) {
  var deferred = promise.pending();

  rest.post(url,
    {
      data: body,
      headers: { 'Content-Type': 'application/soap+xml; charset=utf-8' }
    })
    .on('complete', function(result) {
      if(result instanceof Error) {
        deferred.reject(result);
      }

      deferred.resolve(result);
    }
  );

  return deferred.promise;
};
