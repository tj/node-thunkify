
var thunkify = require('..');
var assert = require('assert');
var fs = require('fs');

describe('thunkify(fn)', function(){
  it('should work when sync', function(done){
    function read(file, fn) {
      fn(null, 'file: ' + file);
    }

    read = thunkify(read);

    read('foo.txt')(function(err, res){
      assert(!err);
      assert('file: foo.txt' == res);
      done();
    });
  })

  it('should work when async', function(done){
    function read(file, fn) {
      setTimeout(function(){
        fn(null, 'file: ' + file);
      }, 5);
    }

    read = thunkify(read);

    read('foo.txt')(function(err, res){
      assert(!err);
      assert('file: foo.txt' == res);
      done();
    });
  })

  it('should pass all results', function(done){
    function read(file, fn) {
      setTimeout(function(){
        fn(null, file[0], file[1]);
      }, 5);
    }

    read = thunkify(read);

    read('foo.txt')(function(err, a, b){
      assert(!err);
      assert('f' == a);
      assert('o' == b);
      done();
    });
  })

  it('should work with node methods', function(done){
    fs.readFile = thunkify(fs.readFile);
    
    fs.readFile('package.json')(function(err, buf){
      assert(!err);
      assert(Buffer.isBuffer(buf));

      fs.readFile('package.json', 'utf8')(function(err, str){
        assert(!err);
        assert('string' == typeof str);
        done();
      });
    });
  })
})