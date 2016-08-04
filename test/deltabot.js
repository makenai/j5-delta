var Deltabot = require('../index');
var five = require('johnny-five');
var mocks = require("mock-firmata");
var MockFirmata = mocks.Firmata;
var sinon = require('sinon');
var assert = require('chai').assert;
var fuzzy = require('./helpers/fuzzy')

var board = new five.Board({
  io: new MockFirmata(),
  debug: false,
  repl: false
});

function getLastServoPositions(spy) {
  assert.equal( spy.callCount, 3 );
  return spy.args.map(function(call) {
    return call[0];
  });
};

describe('Deltabot', function() {

  var deltabot = new Deltabot({
    type: 'tapster',
    pins: [ 9, 10, 11 ]
  });

  describe('home', function() {

    it('moves servos to the default home position', function() {
      var servoTo = sinon.spy(five.Servo.prototype, "to");
      deltabot.home();
      var positions = getLastServoPositions(servoTo);
      assert.deepEqual( positions, [ 5, 5, 5 ] );
      servoTo.restore();
    });

  });

  describe('moveTo', function() {

    it('move to specified position, rounding the input to servo.to', function() {
      var servoTo = sinon.spy(five.Servo.prototype, "to");
      deltabot.moveTo([-30, 35, -150]);
      var positions = getLastServoPositions(servoTo);
      // 33.887174501473325, 45.44091307567692, 8.483144821668269
      assert.deepEqual( positions, [ 34, 45, 8 ] );
      servoTo.restore();
    });

    it('issues an optional callback when done', function(done) {
      var servoTo = sinon.spy(five.Servo.prototype, "to");
      deltabot.moveTo([10, 20, -140], function() {
        var positions = getLastServoPositions(servoTo);
        assert.deepEqual( positions, [ 6, 26, 15 ] );
        servoTo.restore();
        done();
      });
    });

  });

  describe('getEnvelope', function() {
    var bounds = deltabot.getEnvelope();
  });

  describe('getPosition', function() {

    it('can get its position from recent servo angles', function() {
      deltabot.moveTo([20, -15, -140]);
      var position = deltabot.getPosition();
      fuzzy.assertValuesApproximately(
        position,
        [ 0, 20, -15, -140 ],
        0.8, // Just guessing at the precision here
        '20,-15,-140'
      );
    });

    it('can calculate a position from passed in angles', function() {
      var position = deltabot.getPosition([ 48, 54, 11 ]);
      fuzzy.assertValuesApproximately(
        position,
        [0,-45,36,-155],
        0.8, // Just guessing at the precision here
        '48,54,11'
      );
    });

  });

});