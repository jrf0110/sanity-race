var TWEEN = require('tween.js');
var utils = require('./utils');

module.exports = function( options ){
  if ( !options.renderer ){
    throw new Error('Missing required property `renderer`');
  }

  utils.defaults( options, {
    nCurves: 2
  });

  var getStep = function(){
    return window.innerHeight / ( options.nVertices - options.nOutsideVertices );
  };

  return Object.create({
    init: function(){
      this.roadCurves = utils.range( options.nCurves ).map( function( x ){
        return new Two.Polygon(
          this.points = utils.range( options.nVertices ).map( function( a ){
            return new Two.Anchor( 0, getStep() * (a - (options.nOutsideVertices / 2) ) );
          })
        , false
        , true
        );
      }.bind( this ));

      this.roadCurves.forEach( function( curve, i ){
        curve.noFill().linewidth = 10; 
        curve.stroke = 'tomato';
        options.renderer.add( curve );
      }.bind( this ) );

      this.bow(0);

      return this;
    }

  , update: function(){
    }


  , bow: function( amount ){
      if ( this.tweens.length ){
        utils.invoke( this.tweens, 'stop' );
      }

      this.tweens = [];

      this.roadCurves.forEach( function( curve, ci ){
        curve = this.roadCurves[ ci ];
        var originX = (window.innerWidth / 2) - (options.width / options.nCurves);
        originX += ci * options.width;
        // Avoid AA issues
        originX = parseInt( originX );

        curve.vertices.forEach( function( vertex, vi ){
          var x = Math.pow( (vi * (1 / curve.vertices.length) ) - 0.5, 2 );
          x *= amount * 4;
          x += originX;
          vertex.x = x;
        }.bind( this ));
      }.bind( this ));
    }
  }).init();
};