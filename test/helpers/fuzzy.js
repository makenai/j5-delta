var assert = require('chai').assert;

// Floating point numbers can be funny, so let's not go for exact numbers.
var DEFAULT_PRECISION = 0.00001;
module.exports = {

  assertValuesApproximately: function( actual, expected, precision, message ) {
    if (typeof precision == 'string') {
      message = precision;
      precision = DEFAULT_PRECISION;
    }
    assert.lengthOf( actual, expected.length, message );
    actual.forEach(function(value, position) {
      assert.approximately( value, expected[ position ], precision, message );
    });
  }

}