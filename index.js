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
    var cb;

    function callback(){
      if (results && cb) {
        cb.apply(this, results);
      }
    }

    args.push(function(){
      results = arguments;
      callback.apply(this);
    });

    fn.apply(this, args);

    return function(fn){
      cb = fn;
      callback.apply(this);
    }
  }
};
