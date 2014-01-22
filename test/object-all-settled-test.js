var Q = require('q');
var objectAllSettled = require('../').object.allSettled;

require('should');

describe('object.allSettled', function(){
	it('should return an object where rejection and success are represented as in Q.allSettled', function(done){
		objectAllSettled({ 
			x: Q.reject('foo'),
			y: Q('bar'),
			z: Q('quux')
		})
		.then(function(object){ 
			object.should.eql({ 
				x: { state: 'rejected', reason: 'foo' },
				y: { state: 'fulfilled', value: 'bar' },
				z: { state: 'fulfilled', value: 'quux' }
			});
		})
		.then(done, done);
	});
});