var Q = require('q');
var sinon = require('sinon');
var fallbackParallel = require('../').fallbackParallel;

require('should');

describe('fallbackParallel', function(){
	it('should resolve the when first promise is resolved', function(done) {
		fallbackParallel([
			Q.reject('foo'),
			Q('bar')
		])
		.then(function(o){
			o.should.eql('bar');
		})
		.then(done, done);
	});

	it('should reject when all promises are rejected', function(done) {
		fallbackParallel([
			Q.reject('foo'),
			Q.reject('bar')
		])
		.fail(function(o){
			o.should.eql([
				'foo',
				'bar'
			]);
		})
		.then(done, done);
	});
});
