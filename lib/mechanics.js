module.exports = {

  reflectX: function(coords) {
    return [ -coords[0], coords[1], coords[2] ];
  },

  reflectY: function(coords) {
    return [ coords[0], -coords[1], coords[2] ];
  },

  rotate: function(coords, degrees) {
    var radians = degrees * Math.PI / 180;
    var x = coords[0] * Math.cos(radians) - coords[1] * Math.sin(radians);
    var y = coords[1] * Math.cos(radians) + coords[0] * Math.sin(radians);
    return [ x, y, coords[2] ];
  },

  mapAngles: function(angles, fromRange, toRange) {
    return angles.map(function(angle) {
      return ( angle - fromRange[0] ) * ( toRange[1] - toRange[0] ) / ( fromRange[1] - fromRange[0] ) + toRange[0];
    });
  },

};