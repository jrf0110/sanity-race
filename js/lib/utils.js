var $     = require('jquery');
var _     = require('lodash');
var utils = module.exports = _.extend( {}, _ );

utils.domready  = $;
utils.dom       = $;

utils.key = require('MouseTrap');

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
