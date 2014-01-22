var Q = require('q');
var _ = require('lodash');

var filterObject = function(o, pred){
	return _.transform(o, function(res, v, k){ 
		if ( pred(v) ) res[k] = v;
	}, {});
};


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
			var fulfilled = filterObject(o, function(res){ return res.state === 'fulfilled' });
			return _.mapValues(fulfilled, function(res){ return res.value });
		});
}

module.exports = { 
	object: { all: objectAll, allSettled: objectAllSettled, fulfilled: objectFulfilled }
};