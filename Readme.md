
# thunkify

  Turn a regular node function into one which returns a thunk,
  useful for generator-based flow control.

## Installation

```
$ npm install thunkify
```

## Example

```js
var thunkify = require('thunkify');
var fs = require('fs');

fs.readFile = thunkify(fs.readFile);

fs.readFile('package.json', 'utf8')(function(err, str){
  
});
```

# License

  MIT