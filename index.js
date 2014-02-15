
/**
 * Expose `thunkify()`.
 */

module.exports = function (input) {
  var type = typeof input;
  if (type === 'function') {
    return thunkify(input);
  }

  if (type === 'object') {
    for (var key in input) {
      if (typeof input[key] === 'function') {
        input[key] = thunkify(input[key]);
      }
    }
    return input;
  }

  throw new TypeError('thunkify accept only `function` or `object`');
};

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
