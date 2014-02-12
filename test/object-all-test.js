var Q = require('q');
var objectAll = require('../').object.all;

require('should');

describe('object.all', function(){
	it('should reject if any of the values reject', function(done){
		objectAll({ 
			x: Q.reject('foo'),
			y: Q(),
			z: Q()
		})
		.then(Q.reject, function(err){ err.should.eql('foo'); })
		.then(done, done);
	});

	it('should resolve with an object of values if all promises resolve', function(done){
		objectAll({
			x: Q('foo'),
			y: Q('bar'),
			z: Q('quux')
		})
		.then(function(o){
			o.should.eql({ 
				x: 'foo',
				y: 'bar',
				z: 'quux'
			});
		})
		.then(done, done);
	});
});