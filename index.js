var Q = require('q');

'use strict';

// Array[fn() -> Promise[T]] -> Promise[T]
var fallback = function(arrayOfPromiseFn) {
    var deferred = Q.defer();
	var rejections = [];
    var tryNextPromise = function() {
		if(arrayOfPromiseFn.length > 0) {
			var first = arrayOfPromiseFn.shift();
			first().then(function(result) {
				deferred.resolve(result);
			}, function(reason) {
				rejections.push(reason);
				tryNextPromise();
			});
		} else {
			deferred.reject(rejections);
		}
    }
    tryNextPromise();
    return deferred.promise;
}

module.exports = { 
	object: require('./src/object'),
	fallback: fallback
};

