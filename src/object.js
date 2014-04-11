var Q = require('q');
var _ = require('lodash');

'use strict';

// Object[String, Promise] -> Promise[Object]
var allSettled = function(objectOfPromises){
    var keys = _.keys(objectOfPromises);
    var promises = _.values(objectOfPromises);

    return Q.allSettled(promises)
        .then(function(vals){
            return _.zipObject(keys, vals) ;
        });
};

// Object[String, Promise] -> Promise[Object]
var all = function(objectOfPromises){
    var keys = _.keys(objectOfPromises);
    var promises = _.values(objectOfPromises);

    return Q.all(promises)
        .then(function(vals){
            return _.zipObject(keys, vals) ;
        });
};

// Object[String, Promise] -> Promise[Object]
var fulfilled = function(objectOfPromises){
    return allSettled(objectOfPromises)
        .then(function(o){
            var fulfilled = _.pick(o, function(res){ return res.state === 'fulfilled' });
            return _.mapValues(fulfilled, function(res){ return res.value });
        });
}

// Object[String, Promise] -> Promise[Object]
var rejected = function(objectOfPromises){
    return allSettled(objectOfPromises)
        .then(function(o){
            var rejected = _.pick(o, function(res){ return res.state === 'rejected' });
            return _.mapValues(rejected, function(res){ return res.reason });
        });
}

var containsAnyKey = function(obj, keys){
    return keys.some(function(key){ return key in obj });
}

// Array[String], Object[String, Primise] -> Promise[Object[String, Promise]]
var demand = function(keys, objectOfPromises){
    return rejected(objectOfPromises)
        .then(function(rejections){
            if ( containsAnyKey(rejections, keys) ) return Q.reject(_.pick(rejections, keys));
            else return objectOfPromises;
        });
}

module.exports = {
    all: all,
    allSettled: allSettled,
    fulfilled: fulfilled,
    rejected: rejected,
    demand: demand
};
