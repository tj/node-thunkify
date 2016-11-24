

var thunkify = require('..');
var read = require('./support/read');
var assert = require('assert');

describe('thunkify(object)', function(){
  before(thunkify.bind(null, read));

  it('should work when sync', function(done){
    read.sync('foo.txt')(function(err, res){
      assert(!err);
      assert('file: foo.txt' == res);
      done();
    });
  })

  it('should work when async', function(done){
    read.async('foo.txt')(function(err, res){
      assert(!err);
      assert('file: foo.txt' == res);
      done();
    });
  })

  it('should pass all results', function(done){
    read.multi('foo.txt')(function(err, a, b){
      assert(!err);
      assert('f' == a);
      assert('o' == b);
      done();
    });
  })

  it('should nothing happend to notFunc', function () {
    assert(read.notFunc, 'notFunc');
  })
})
