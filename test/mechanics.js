var mechanics = require('../lib/mechanics');
var assert = require('chai').assert;

describe('mechanics', function() {

  describe('reflect', function() {

    it('refects X', function() {
      assert.deepEqual(
        mechanics.reflectX([ 20, 20, -150 ]),
        [ -20, 20, -150 ]
      );
    });

    it('refects Y', function() {
      assert.deepEqual(
        mechanics.reflectY([ 20, 20, -150 ]),
        [ 20, -20, -150 ]
      );
    });

  });

  describe('rotate', function() {

    it('rotates', function() {
      assert.deepEqual(
        mechanics.rotate([ -63, 3, -150 ], -60),
        [ -28.90192378864669, 56.05960043841963, -150 ]
      );
    });

    it('is reversible', function() {
      assert.deepEqual(
        mechanics.rotate([ -28.90192378864669, 56.05960043841963, -150 ], 60),
        [ -63, 3, -150 ]
      );
    });

  });

});