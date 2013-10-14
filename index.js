
/**
 * Expose `thunkify()`.
 */

module.exports = thunkify;

/**
 * Wrap a regular callback `fn` as a thunk.
 *
 * @param {Function} fn
 * @return {Function}
 * @api public
 */

function thunkify(fn){
  return function(){
    var args = [].slice.call(arguments);
    var results;
    var called;
    var cb;

    args.push(function(){
      results = arguments;

      if (cb && !called) {
        called = true;
        cb.apply(this, results);
      }
    });

    fn.apply(this, args);

    return function(fn){
      cb = fn;

      if (results && !called) {
        called = true;
        fn.apply(this, results);
      }
    }
  }
};