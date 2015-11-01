(function() {
	'use strict';

	var expect = require('chai').expect;
	var xpath = require('xpath');
	var Dom = require('xmldom').DOMParser;
	var requests = require('../lib/requestFactory');

	describe('create', function() {
		it('uses entityLogicalName from argument', function() {
			var result = requests.create('', {}, 'contact');

			var xmlBody = new Dom().parseFromString(result);
			var node = xpath.select('//*[local-name() = \'LogicalName\']', xmlBody);
			expect(node[0].firstChild.data).to.equal('contact');
		});

		it('uses attributes from argument', function() {
			var result = requests.create('', {}, 'contact', [{logicalName: 'name', value: 'test'}, {logicalName:'abc', value:'aaa'}]);

			var xmlBody = new Dom().parseFromString(result);
			var keys = xpath.select('//*[local-name() = \'key\']', xmlBody);
			var values = xpath.select('//*[local-name() = \'value\']', xmlBody);

			expect(keys[0].firstChild.data).to.equal('name');
			expect(values[0].firstChild.data).to.equal('test');
			expect(keys[1].firstChild.data).to.equal('abc');
			expect(values[1].firstChild.data).to.equal('aaa');
		});
	});
})();
