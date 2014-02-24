var Q = require('q');
var fulfilled = require('../').array.fulfilled;

require('should');

describe('array.fulfilled', function(){
    it('should resolve with only promises resolved', function(done){
        fulfilled([
            Q.reject('foo'),
            Q('bar'),
            Q('quux')
        ])
        .then(function(o){ 
            o.should.eql([
                'bar',
                'quux'
            ])
        })
        .then(done, done);
    });
});
