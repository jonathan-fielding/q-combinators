var Q = require('q');
var _ = require('lodash');

// Object[String, Promise] -> Promise[Object]
var objectAllSettled = function(objectOfPromises){
	var keys = _.keys(objectOfPromises);
	var promises = _.values(objectOfPromises);

	return Q.allSettled(promises)
		.then(function(vals){ 
			return _.zipObject(keys, vals) ;
		});
};

// Object[String, Promise] -> Promise[Object]
var objectAll = function(objectOfPromises){
	var keys = _.keys(objectOfPromises);
	var promises = _.values(objectOfPromises);

	return Q.all(promises)
		.then(function(vals){ 
			return _.zipObject(keys, vals) ;
		});
};

// Object[String, Promise] -> Promise[Object]
var objectFulfilled = function(objectOfPromises){
	return objectAllSettled(objectOfPromises)
		.then(function(o){ 
			var fulfilled = _.pick(o, function(res){ return res.state === 'fulfilled' });
			return _.mapValues(fulfilled, function(res){ return res.value });
		});
}

// Object[String, Promise] -> Promise[Object]
var objectRejected = function(objectOfPromises){
	return objectAllSettled(objectOfPromises)
		.then(function(o){ 
			var rejected = _.pick(o, function(res){ return res.state === 'rejected' });
			return _.mapValues(rejected, function(res){ return res.reason });
		});
}

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
	object: { 
		all: objectAll, 
		allSettled: objectAllSettled, 
		fulfilled: objectFulfilled, 
		rejected: objectRejected 
	},
	fallback: fallback
};

