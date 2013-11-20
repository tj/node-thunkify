
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

function thunkify(fn) {
  return function() {
    var args = [].slice.call(arguments);
    var results;
    var cb;

    args.push(function() {
      if (cb) { //callback is ready. deliver the result.
        cb.apply(this, arguments);
      } else { //yet to receive the callback. keep the result.
        results = arguments;
      }
    });

    fn.apply(this, args);

    return function(_cb) {
      if (results) { //result is ready. deliver it.
        _cb.apply(this, results);
      } else { //keep the callback
        cb = _cb;
      }
    };
  };
}

