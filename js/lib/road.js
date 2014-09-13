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

  var numTweensComplete = 0;
  var onTweenComplete = function(){
    numTweensComplete++;
  };

  var getTweenFromVertex = function( v, i, vertices ){
    var to, step = getStep();

    if ( i === vertices.length - 1 ){
      to = { x: v.x, y: v.y + step };
    } else {
      to = {
        x: vertices[ i + 1 ].x
      , y: vertices[ i + 1 ].y
      };
    }

    return new TWEEN.Tween({ x: v.x, y: v.y })
      .to( to, 250 )
      // .easing( TWEEN.Easing.Linear.None )
      .onUpdate( function(){
        v.y = this.y;
      })
      .onComplete( onTweenComplete );
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

      this.tweens = [];

      this.roadCurves.forEach( function( curve, i ){
        curve.noFill().linewidth = 10; 
        curve.stroke = 'tomato';
        options.renderer.add( curve );

        // this.tweens = this.tweens.concat( curve.vertices.map( getTweenFromVertex ) );
      }.bind( this ) );

      this.bow(0);

      // utils.invoke( this.tweens, 'start' );

      return this;
    }

    // Just re-updates the vertices after the tweens are complete
    // So most of the updating is actually done in TWEEN.update()
  , update: function(){
      // if ( numTweensComplete === this.tweens.length ){
      //   var prevX = this.roadCurves[0].vertices[0].x;
      //   var anchor = {
      //     x: utils.random( prevX - (options.variance / 2), prevX + (options.variance / 2) )
      //   , y: getStep() * (0 - (options.nOutsideVertices / 2) )
      //   };

      //   this.tweens = [];
      //   this.roadCurves.forEach( function( curve, i ){
      //     curve.vertices.pop();
      //     curve.vertices.unshift( new Two.Anchor( anchor.x + (i * options.width), anchor.y ) );
      //     this.tweens = this.tweens.concat( curve.vertices.map( getTweenFromVertex ) );
      //   }.bind( this ));

      //   utils.invoke( this.tweens, 'start' );

      //   numTweensComplete = 0;
      // }
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