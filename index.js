var five = require("johnny-five");
var temporal = require('temporal');
var configurations = require('./lib/configurations');
var ik = require('./lib/ik');
var mechanics = require('./lib/mechanics');

function Deltabot( opts ) {

  // If we passed in a valid configuration type, let's grab that now
  var configuration = ( opts.type && configurations[ opts.type ] ) || {};

  // Configuration cascade: default options < configuration settings < explicit options
  this.opts = Object.assign({
    pins: [8, 9, 10],
    range: [0, 90],
    startAt: 5
  }, configuration, opts);

  this.ik = new ik( this.opts.dimensions );

  this.servos = [
    five.Servo({
      pin: this.opts.pins[0],
      range: this.opts.range,
      startAt: this.opts.startAt
    }),
    five.Servo({
      pin: this.opts.pins[1],
      range: this.opts.range,
      startAt: this.opts.startAt
    }),
    five.Servo({
      pin: this.opts.pins[2],
      range: this.opts.range,
      startAt: this.opts.startAt
    })
  ];

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

Deltabot.prototype.moveTo = function(coords) {

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

  this.servos[0].to( Math.round( angles[0] ) );
  this.servos[1].to( Math.round( angles[1] ) );
  this.servos[2].to( Math.round( angles[2] ) );
};

Deltabot.prototype.getServoPositions = function() {
  return this.servos.map(function(servo) {
    return servo.last.degrees;
  });
};

Deltabot.prototype.getPosition = function(angles) {
  angles = angles || this.getServoPositions();

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

// Deltabot.prototype.tap = function(x,y) {
//   temporal.queue([
//     {
//       delay: 1000,
//       task: function() {
//         this.go( x, y, -140 );
//       }.bind(this)
//     },
//     {
//       delay: 500,
//       task: function() {
//         this.go( x, y, -155 );
//       }.bind(this)
//     },
//     {
//       delay: 500,
//       task: function() {
//         this.go( x, y, -140 );
//       }.bind(this)
//     }
//   ]);
// };

module.exports = Deltabot;