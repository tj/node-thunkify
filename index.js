
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
    var called;

    return function(done){
      args.push(function(){
        if (called) return;
        called = true;
        done.apply(null, arguments);
      });

      fn.apply(ctx, args);
    }
  }
};