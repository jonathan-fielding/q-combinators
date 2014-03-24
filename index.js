var Q = require('q');
var _ = require('lodash');

'use strict';

// Array[fn() -> Promise[T]] -> Promise[T]
var chain = function(promiseFns){
    return promiseFns.reduce(function(promise, fn){ return promise.then(fn)}, Q());
}

// Array[fn() -> Promise[T]] -> Promise[T]
var fallback = function(promiseFns) {
    var deferred = Q.defer();
	var rejections = [];
    var tryNextPromise = function() {
		if(promiseFns.length > 0) {
			var first = promiseFns.shift();
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


var apply = function(fn, args){ return fn.apply(null, args) };

var attempt = function(totalRetryTimes, fn){
    var allArgs = arguments;
    var userArgs = _.toArray(arguments).slice(2);

    return Q(apply(fn, userArgs))
        .fail(function(err){
            var remainingTries = totalRetryTimes - 1;
            if ( remainingTries === 0 ) return Q.reject(err);
            else return apply(attempt, [remainingTries, fn].concat(userArgs));
        });
};

// (Number, fn() -> Promise) -> Promise
var retry = function(totalRetryTimes, fn){
    return attempt.bind(null, totalRetryTimes, fn);
}

module.exports = {
	object: require('./src/object'),
    array: require('./src/array'),
	fallback: fallback,
    chain: chain,
    retry: retry
};
