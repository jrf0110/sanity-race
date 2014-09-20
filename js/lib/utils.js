var $     = require('jquery');
var _     = require('lodash');
var utils = module.exports = _.extend( {}, _ );

utils.domready  = $;
utils.dom       = $;

utils.key = require('mousetrap');

utils.easing = {
  easeOutQuad: function( t, b, c, d ){
    t /= d;
    return -c * t*(t-2) + b;
  }

  // Gives the itme value for a given value
, timings: {
    easeOutQuad: function( v, b, c, d ){
      return d * Math.sqrt( (v - b ) / c );
    }
  }
};

[
  'flatten'
].forEach( function( fn ){
  Object.defineProperty( Array.prototype, fn, {
    enumerable: false
  , value: function(){
      return _[ fn ].apply( null, [ this ].concat(
        Array.prototype.slice.call( arguments, 1 )
      ));
    }
  });
});

utils.bowPoints = function( points, amount, originX ){
  originX = originX || ( window.innerWidth / 2 );

  // Avoid AA issues
  originX = parseInt( originX );

  points.forEach( function( vertex, vi ){
    var x = Math.pow( ( vi * ( 1 / points.length ) ) - 0.5, 2 );
    x *= amount * 4;
    x += originX;

    vertex.x = x;
  });
};

utils.mod = function( v, l ){
  while ( v < 0 ){
    v += l;
  }
  return v % l;
};