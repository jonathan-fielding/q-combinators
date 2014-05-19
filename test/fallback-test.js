var Q = require('q');
var sinon = require('sinon');
var fallback = require('../').fallback;

require('should');

describe('fallback', function(){
	it('should resolve the when first promise is resolved', function(done) {
		fallback([
			function() { return Q.reject('foo') },
			function() { return Q('bar') }
		])
		.then(function(o){
			o.should.eql('bar');
		})
		.then(done, done);
	});

	it('should reject when all promises are rejected', function(done) {
		fallback([
			function() { return Q.reject('foo') },
			function() { return Q.reject('bar') }
		])
		.fail(function(o){
			o.should.eql([
				'foo',
				'bar'
			]);
		})
		.then(done, done);
	});

	it('should only execute functions up to the point a promise is resolved', function(done) {
		var fn1 = sinon.spy(function() { return Q.reject('foo'); });
		var fn2 = sinon.spy(function() { return Q('bar'); });
		var fn3 = sinon.spy(function() { return Q('baz'); });

		fallback([
			fn1,
			fn2,
			fn3
		])
		.then(function(){
			fn1.called.should.be.true;
			fn2.called.should.be.true;
			fn3.called.should.be.false;

		})
		.then(done, done);
	});
});
