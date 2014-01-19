
var thunkify = require('..');
var assert = require('assert');
var fs = require('fs');
var Q = require('q');

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
  
  describe('.normalize(obj)', function(){
    it('should work with arrays', function(done){
      var fn = thunkify(function get(file, fn){
        fn(null, file);
      });
      
      var thunk = thunkify.normalize([fn('a'), fn('b'), fn('c')]);
      thunk(function(err, res){
        assert(!err);
        assert('a' == res[0]);
        assert('b' == res[1]);
        assert('c' == res[2]);
        done();
      })
    })
    
    it('should work with objects', function(done){
      var fn = thunkify(function get(file, fn){
        fn(null, file);
      });
      
      var thunk = thunkify.normalize({
        a: fn('a'),
        b: fn('b'),
        c: fn('c')
      });
      
      thunk(function(err, res){
        assert(!err);
        assert('a' == res.a);
        assert('b' == res.b);
        assert('c' == res.c);
        done();
      })
    })
    
    it('should work with promises', function(done){
      function getPromise(val, err) {
        return Q.fcall(function(){
          if (err) throw err;
          return val;
        });
      }
      
      var thunk = thunkify.normalize(getPromise('a'));
      
      thunk(function(err, res){
        assert(!err);
        assert('a' == res);
        done();
      })
    })
  })
})