var five = require("johnny-five");
var configurations = require('./lib/configurations');
var ik = require('./lib/ik');
var mechanics = require('./lib/mechanics');
var d3 = require('d3-queue');

function Deltabot( opts ) {

  // If we passed in a valid configuration type, let's grab that now
  var configuration = ( opts.type && configurations[ opts.type ] ) || {};

  // Configuration cascade: default options < configuration settings < explicit options
  this.opts = Object.assign({
    range: [0, 90],
    startAt: 5,
    servoSpeed: 0.40, // HS-311 0.19 (4.8v) / 0.15 (6.0v) sec @ 60 deg.
    tapDepth: -160
  }, configuration, opts);

  this.ik = new ik( this.opts.dimensions );

  this.servos = [
    five.Servo({
      pin: this.opts.pins[0],
      board: this.opts.board,
      range: this.opts.range,
      startAt: this.opts.startAt
    }),
    five.Servo({
      pin: this.opts.pins[1],
      board: this.opts.board,
      range: this.opts.range,
      startAt: this.opts.startAt
    }),
    five.Servo({
      pin: this.opts.pins[2],
      board: this.opts.board,
      range: this.opts.range,
      startAt: this.opts.startAt
    })
  ];

  this.queue = d3.queue(1);

  this.home();
};

/**
 * Go to the delta's home position. Fired automatically at initialization.
 */

Deltabot.prototype.home = function() {
  this.servos.forEach(function(servo) {
    servo.home();
  });
};

Deltabot.prototype.getEnvelope = function() {
  return this.ik.envelope( this.opts.range );
};

Deltabot.prototype.moveTo = function(coords, callback) {

  if ( this.opts.reflectY ) {
    coords = mechanics.reflectY(coords);
  }
  if ( this.opts.reflectX ) {
    coords = mechanics.reflectX(coords);
  }
  if ( this.opts.rotate ) {
    coords = mechanics.rotate(coords, this.opts.rotate);
  }

  var result = this.ik.inverse( coords[0], coords[1], coords[2] );
  var error = result[0];
  var angles = result.slice(1);

  if ( this.opts.operatingRange ) {
    angles = mechanics.mapAngles( angles, this.opts.range, this.opts.operatingRange );
  }

  angles = mechanics.roundAngles( angles );

  this.queue.defer(function(angles, done) {
    var moveTime = this.calcTimeToMove( angles );
    this.servos[0].to( angles[0] );
    this.servos[1].to( angles[1] );
    this.servos[2].to( angles[2] );
    setTimeout(function() {
      if (callback) callback();
      done();
    }, moveTime );
  }.bind(this), angles);

};

Deltabot.prototype.getServoAngles = function() {
  return this.servos.map(function(servo) {
    return servo.last.degrees;
  });
};

Deltabot.prototype.calcTimeToMove = function(newPositions) {
  var lastPositions = this.getServoAngles();
  var maxDegrees = mechanics.calcLargestMovement( lastPositions, newPositions );
  return Math.ceil( ( this.opts.servoSpeed / 60 ) * maxDegrees * 1000 );
}

Deltabot.prototype.getPosition = function(angles) {
  angles = angles || this.getServoAngles();

  if ( this.opts.operatingRange ) {
    angles = mechanics.mapAngles( angles, this.opts.operatingRange, this.opts.range );
  }

  var result = this.ik.forward( angles[0], angles[1], angles[2] );
  var error = result[0];
  var position = result.slice(1);

  if ( this.opts.rotate ) {
    position = mechanics.rotate(position, -this.opts.rotate);
  }
  if ( this.opts.reflectX ) {
    position = mechanics.reflectX(position);
  }
  if ( this.opts.reflectY ) {
    position = mechanics.reflectY(position);
  }

  return [0, position[0], position[1], position[2] ];
};

Deltabot.prototype.tap = function(x,y, callback) {
  this.moveTo([ x, y, this.opts.tapDepth + 10 ]);
  this.moveTo([ x, y, this.opts.tapDepth ]);
  this.moveTo([ x, y, this.opts.tapDepth + 10 ]);
  this.moveTo([ 0, 0, this.opts.tapDepth + 30 ], callback);
};

Deltabot.prototype.draw = function(coords) {
  this.moveTo([ coords[0][0], coords[0][1], this.opts.tapDepth + 10 ]);
  coords.forEach(function(coord) {
    this.moveTo([ coord[0], coord[1], this.opts.tapDepth ]);
  }.bind(this));
  this.moveTo([ 0, 0, this.opts.tapDepth + 30 ]);
};

module.exports = Deltabot;
