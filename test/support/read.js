
exports.sync = function (file, fn) {
  fn(null, 'file: ' + file);
};

exports.async = function (file, fn) {
  setTimeout(function(){
    fn(null, 'file: ' + file);
  }, 5);
};

exports.multi = function (file, fn) {
  setTimeout(function(){
    fn(null, file[0], file[1]);
  }, 5);
};

exports.notFunc = 'notFunc';
