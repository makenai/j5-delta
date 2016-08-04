'use strict';

// Original code from
// http://forums.trossenrobotics.com/tutorials/introduction-129/delta-robot-kinematics-3276/
// Simulate here: https://www.marginallyclever.com/other/samples/fk-ik-test.html


// Trigonometric constants
var sin120 = Math.sin(120 * Math.PI / 180);
var cos120 = Math.cos(120 * Math.PI / 180);
var tan60 = Math.tan(60 * Math.PI / 180);
var sin30 = Math.sin(30 * Math.PI / 180);
var tan30 = Math.tan(30 * Math.PI / 180);

function ik( dimensions ) {
  dimensions = dimensions || {};
  this.e = dimensions.e;
  this.f = dimensions.f;
  this.re = dimensions.re;
  this.rf = dimensions.rf;
};

// TODO : Calculate the envelope of the end effector's reach
ik.prototype.envelope = function(range) {
  var envelope = {};

  // Calculate min and max Z
  for (var i=range[0];i<=range[1];i++) {
    var result = this.forward(i,i,i);
    if (result[0] == 0) {
      if (!envelope.maxZ || result[3] > envelope.maxZ) envelope.maxZ = result[3];
      if (!envelope.minZ || result[3] < envelope.minZ) envelope.minZ = result[3];
    }
  }
  envelope.midZ = ( envelope.maxZ + envelope.minZ ) / 2;
  var radius = Math.abs( envelope.maxZ - envelope.minZ ) / 2;
  var bound = Math.cos( 45 * Math.PI / 180 ) * radius;
  return envelope;
};

// Inverse kinematics
// Helper functions, calculates angle theta1 (for YZ-pane)
ik.prototype.delta_calcAngleYZ = function(x0, y0, z0) {
  var y1 = -0.5 * 0.57735 * this.f; // f/2 * tg 30
  y0 -= 0.5 * 0.57735 * this.e; // shift center to edge

  // z = a + b*y
  var a = (x0 * x0 + y0 * y0 + z0 * z0 + this.rf * this.rf - this.re * this.re - y1 * y1) / (2.0 * z0);
  var b = (y1 - y0) / z0;

  // discriminant
  var d = -(a + b * y1) * (a + b * y1) + this.rf * (b * b * this.rf + this.rf);
  if (d < 0) {
    return new Array(1, 0); // non-existing point.  return error, theta
  }

  var yj = (y1 - a * b - Math.sqrt(d)) / (b * b + 1); // choosing outer point
  var zj = a + b * yj;
  var theta = Math.atan(-zj / (y1 - yj)) * 180.0 / Math.PI + ((yj > y1) ? 180.0 : 0.0);

  return new Array(0, theta); // return error, theta
};

ik.prototype.inverse = function(x0, y0, z0) {
  var theta1 = 0;
  var theta2 = 0;
  var theta3 = 0;
  var status = this.delta_calcAngleYZ(x0, y0, z0);

  if (status[0] === 0) {
    theta1 = status[1];
    status = this.delta_calcAngleYZ(x0 * cos120 + y0 * sin120, y0 * cos120 - x0 * sin120, z0, theta2);
  }
  if (status[0] === 0) {
    theta2 = status[1];
    status = this.delta_calcAngleYZ(x0 * cos120 - y0 * sin120, y0 * cos120 + x0 * sin120, z0, theta3);
  }
  theta3 = status[1];

  return new Array(status[0], theta1, theta2, theta3);
};

ik.prototype.forward = function( theta1, theta2, theta3 ) {
  var x0 = 0.0;
  var y0 = 0.0;
  var z0 = 0.0;

  var t = (this.f - this.e) * tan30 / 2.0;

  // Convert degrees to radians
  var dtr = Math.PI / 180.0;
  theta1 *= dtr;
  theta2 *= dtr;
  theta3 *= dtr;

  var y1 = -(t + this.rf * Math.cos(theta1));
  var z1 = -this.rf * Math.sin(theta1);

  var y2 = (t + this.rf * Math.cos(theta2)) * sin30;
  var x2 = y2 * tan60;
  var z2 = -this.rf * Math.sin(theta2);

  var y3 = (t + this.rf * Math.cos(theta3)) * sin30;
  var x3 = -y3 * tan60;
  var z3 = -this.rf * Math.sin(theta3);

  var dnm = (y2 - y1) * x3 - (y3 - y1) * x2;

  var w1 = y1 * y1 + z1 * z1;
  var w2 = x2 * x2 + y2 * y2 + z2 * z2;
  var w3 = x3 * x3 + y3 * y3 + z3 * z3;

  // x = (a1*z + b1)/dnm
  var a1 = (z2 - z1) * (y3 - y1) - (z3 - z1) * (y2 - y1);
  var b1 = -((w2 - w1) * (y3 - y1) - (w3 - w1) * (y2 - y1)) / 2.0;

  // y = (a2*z + b2)/dnm;
  var a2 = -(z2 - z1) * x3 + (z3 - z1) * x2;
  var b2 = ((w2 - w1) * x3 - (w3 - w1) * x2) / 2.0;

  // a*z^2 + b*z + c = 0
  var a = a1 * a1 + a2 * a2 + dnm * dnm;
  var b = 2.0 * (a1 * b1 + a2 * (b2 - y1 * dnm) - z1 * dnm * dnm);
  var c = (b2 - y1 * dnm) * (b2 - y1 * dnm) + b1 * b1 + dnm * dnm * (z1 * z1 - this.re * this.re);

  // discriminant
  var d = b * b - 4.0 * a * c;
  if (d < 0.0) {
    return new Array(1, 0, 0, 0); // non-existing point. return error,x,y,z
  }

  z0 = -0.5 * (b + Math.sqrt(d)) / a;
  x0 = (a1 * z0 + b1) / dnm;
  y0 = (a2 * z0 + b2) / dnm;

  return new Array(0, x0, y0, z0);
}

module.exports = ik;