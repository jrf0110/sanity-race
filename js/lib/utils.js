var $     = require('jquery/dist/jquery');
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

var oCreate = Object.create;
Object.create = function(){
  var ctrs, objs = Array.prototype.slice.call( arguments );

  ctrs = objs.filter( function( o ){
    return typeof o === 'function';
  });

  objs = objs.filter( function( o ){
    return typeof o === 'object';
  });

  ctrs.forEach( function( ctr ){
    objs.push( ctr.prototype );
  });

  var obj = utils.extend.apply( null, objs );
  obj = oCreate( obj );

  ctrs.forEach( function( ctr ){
    ctr.call( obj );
  });

  return obj;
};

// Functions from lodash to put on the Array prototype
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

  for ( var i = 0, l = points.length, x; i < l; ++i ){
    x = Math.pow( ( i * ( 1 / points.length ) ) - 0.5, 2 );
    x *= amount * 4;
    x += originX;

    points[i].x = x;
  }
};

utils.mod = function( v, l ){
  while ( v < 0 ){
    v += l;
  }
  return v % l;
};