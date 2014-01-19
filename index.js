
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

/**
 * Convert `obj` into a normalized thunk.
 *
 * @param {Mixed} obj
 * @param {Mixed} ctx
 * @return {Function}
 * @api public
 */

thunkify.normalize = function (obj, ctx) {
  var fn = obj;
  if (Array.isArray(obj)) fn = arrayToThunk.call(ctx, obj);
  if ('[object Object]' == toString.call(obj)) fn = objectToThunk.call(ctx, obj);
  if (isGeneratorFunction(obj)) obj = obj.call(ctx);
  if (isGenerator(obj)) fn = co(obj);
  if (isPromise(obj)) fn = promiseToThunk(obj);
  return fn;
}

/**
 * Convert an array of yieldables to a thunk.
 *
 * @param {Array}
 * @return {Function}
 * @api private
 */

function arrayToThunk(fns) {
  var ctx = this;

  return function(done){
    var pending = fns.length;
    var results = new Array(pending);
    var finished;

    if (!pending) {
      setImmediate(function(){
        done(null, results);
      });
      return;
    }

    for (var i = 0; i < fns.length; i++) {
      run(fns[i], i);
    }

    function run(fn, i) {
      if (finished) return;
      try {
        fn = thunkify.normalize(fn, ctx);

        fn.call(ctx, function(err, res){
          if (finished) return;

          if (err) {
            finished = true;
            return done(err);
          }

          results[i] = res;
          --pending || done(null, results);
        });
      } catch (err) {
        finished = true;
        done(err);
      }
    }
  }
}

/**
 * Convert an object of yieldables to a thunk.
 *
 * @param {Object} obj
 * @return {Function}
 * @api private
 */

function objectToThunk(obj){
  var ctx = this;

  return function(done){
    var keys = Object.keys(obj);
    var pending = keys.length;
    var results = {};
    var finished;

    if (!pending) {
      setImmediate(function(){
        done(null, results)
      });
      return;
    }

    for (var i = 0; i < keys.length; i++) {
      run(obj[keys[i]], keys[i]);
    }

    function run(fn, key) {
      if (finished) return;
      try {
        fn = thunkify.normalize(fn, ctx);

        if ('function' != typeof fn) {
          results[key] = fn;
          return --pending || done(null, results);
        }

        fn.call(ctx, function(err, res){
          if (finished) return;

          if (err) {
            finished = true;
            return done(err);
          }

          results[key] = res;
          --pending || done(null, results);
        });
      } catch (err) {
        finished = true;
        done(err);
      }
    }
  }
}

/**
 * Convert `promise` to a thunk.
 *
 * @param {Object} promise
 * @return {Function}
 * @api private
 */

function promiseToThunk(promise) {
  return function(fn){
    promise.then(function(res) {
      fn(null, res);
    }, fn);
  }
}

/**
 * Check if `obj` is a promise.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isPromise(obj) {
  return obj && 'function' == typeof obj.then;
}

/**
 * Check if `obj` is a generator.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */

function isGenerator(obj) {
  return obj && 'function' == typeof obj.next && 'function' == typeof obj.throw;
}

/**
 * Check if `obj` is a generator function.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */

function isGeneratorFunction(obj) {
  return obj && obj.constructor && 'GeneratorFunction' == obj.constructor.name;
}