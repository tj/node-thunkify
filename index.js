
/**
 * Module dependencies.
 */

var assert = require('assert');

/**
 * Expose `thunkify()`.
 */

module.exports = thunkify;

/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Wrap a regular callback `fn` as a thunk.
 *
 * @param {Function} fn
 * @return {Function}
 * @api public
 */

function thunkify(fn){
  assert('function' == typeof fn, 'function required');

  return function(){
    var args = slice.call(arguments);
    var ctx = this;
    var res;

    return function(done){
      var called;

      if (res) return done.apply(null, res);

      args.push(function(){
        if (called) return;
        called = true;
        res = arguments;
        done.apply(null, res);
      });

      fn.apply(ctx, args);
    }
  }
};