var five = require("johnny-five");
var temporal = require('temporal');
var ik = require('./lib/ik');
var coordinates = require('./lib/coordinates');

function Deltabot( opts ) {

  opts = opts || {};
  var pins = opts.pins || [ 9, 10, 11 ];
  var range = opts.range || [0,90];
  var startAt = opts.startAt || 5;

  this.servos = [
    five.Servo({
      pin: pins[0],
      range: range,
      startAt: startAt
    }),
    five.Servo({
      pin: pins[1],
      range: range,
      startAt: startAt
    }),
    five.Servo({
      pin: pins[2],
      range: range,
      startAt: startAt
    })
  ];

  this.ik = new ik();

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

Deltabot.prototype.go = function(x, y, z) {
  var reflected = coordinates.reflect(x,y);
  var rotated = coordinates.rotate(reflected[0],reflected[1]);
  var angles = this.ik.inverse( rotated[0], rotated[1], z );
  var mappedAngles = angles.slice(1).map(function(angle) {
    return coordinates.mapValue( angle, 0, 90, 8, 90 );
  });
  this.servos[0].to( mappedAngles[0] );
  this.servos[1].to( mappedAngles[1] );
  this.servos[2].to( mappedAngles[2] );
};

// Deltabot.prototype.position = function() {
//   var degrees = this.servos.map(function(servo) {
//     return servo.last.degrees;
//   });
//   return ik.forward( degrees[0], degrees[1], degrees[2] );
// }
//
//
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