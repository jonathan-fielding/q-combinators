var Q = require('q');
var sinon = require('sinon');
var compose = require('../').compose;

require('should');

describe('compose', function(){
    var inc = function(a){ return Q(a + 1) };
    var double = function(a){ return Q(a * 2) };

    it('should apply all fns from right to left', function(done){
        (compose(double, inc, inc, inc)(5))
            .then(function(val){ 
                val.should.eql(16);
            })
            .then(done, done);
    });

    it('should handle failure the same way as a promise chain', function(done){
        (compose(inc, Q.reject, inc, inc)(1))
            .fail(function(val){ 
                val.should.eql(3);
            })
            .then(done, done);
    });

    it('should apply a single argument', function(done){
        (compose(inc)(1))
            .then(function(val){ 
                val.should.eql(2);
            })
            .then(done, done);
    });

    it('should effectively lift when given no arguments', function(done){
        (compose()(1))
            .then(function(val){ 
                val.should.eql(1);
            })
            .then(done, done);
    });
    
});
