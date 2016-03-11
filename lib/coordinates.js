// A sine function for working with degrees, not radians
function sin(degree) {
  return Math.sin(Math.PI * (degree/180));
}

// A cosine function for working with degrees, not radians
function cos(degree) {
  return Math.cos(Math.PI * (degree/180));
}

module.exports = {

  reflect: function(x,y) {
    var theta = 0;
    var x1 = x;
    var y1 = x * sin(2*theta) - y * cos(2*theta);
    return [x1,y1];
  },

  rotate: function(x,y) {
    var theta = -60;
    var x1 = x * cos(theta) - y * sin(theta);
    var y1 = y * cos(theta) + x * sin(theta);
    return [x1,y1];
  },

  mapValue: function( value, in_min , in_max , out_min , out_max ) {
    return ( value - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
  }

};