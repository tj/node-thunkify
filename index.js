
/**
 * Module dependencies.
 */

const assert = require('assert');

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
    let args = new Array(arguments.length);

    for(let i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }

    return (done) => {
      var called;

      args.push(function() {
        if (called) {
          return;
        }
        called = true;
        done.apply(null, arguments);
      });

      try {
        fn.apply(this, args);
      } catch (err) {
        done(err);
      }
    }
  }
};

/**
 * Expose `thunkify()`.
 */

module.exports = thunkify;
