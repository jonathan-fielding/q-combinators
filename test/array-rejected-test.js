var Q = require('q');
var rejected = require('../').array.rejected;

require('should');

describe('array.rejected', function(){
    it('should resolve with only the keys whose promises rejected', function(done){
        rejected([ 
            Q.reject('foo'),
            Q.reject('bar'),
            Q('quux')
        ])
        .then(function(o){ 
            o.should.eql([
                'foo',
                'bar'
            ])
        })
        .then(done, done);
    });
});