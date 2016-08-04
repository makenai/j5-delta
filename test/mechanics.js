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

  describe('calcLargestMovement', function() {

    it('can figure out how many degrees the largest move is', function() {

      assert.equal(
        mechanics.calcLargestMovement(
          [-30, 10, 5],
          [ 30, 15, 1]
        ),
        60
      );

      assert.equal(
        mechanics.calcLargestMovement(
          [ 10, 10, 5 ],
          [ 15, 12, 4 ]
        ),
        5
      );

      assert.equal(
        mechanics.calcLargestMovement(
          [ 15, 12, 4 ],
          [ 10, 10, 5 ]
        ),
        5
      );

    });

  })

});