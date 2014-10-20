var TWEEN = require('tween.js');
var utils = require('./utils');

module.exports = function( options ){
  if ( !options.renderer ){
    throw new Error('Missing required property `renderer`');
  }

  utils.defaults( options, {
    nRoadLines:       8
  , roadColor:        '#555'
  , width:            250
  , lineRoadOverhang: 16
  , lineColor:        'yellow'
  , lineWidth:        16
  , velocity:         0.0125
  , gutter:          -50
  , distanceOut:      200

  , parts: [
      // Full road shape (overhang)
      { woffset: 0,  color: '#555' }
      // Side lines
    , { woffset: 20, color: 'yellow' }
      // Center road part
    , { woffset: 40, color: '#555' }
    ]
  });

  // var two = options.renderer;

  // var getStep = function(){
  //   return two.height / ( options.nVertices - options.nOutsideVertices );
  // };

  // Cached variables to use within the animation loop.
  // var a = new Two.Vector(), b = new Two.Vector();

  return Object.create({
    init: function(){
      // this.initMainRoad();
      // this.initRoadLines();

      this.options = options;
      this.bow(0);

      return this;
    }

  // , initMainRoad: function(){
  //     var center = parseInt( two.width / 2 );
  //     var step = ( two.height + (options.distanceOut * 2) ) / options.nVertices;

  //     this.points = [];

  //     for ( var i = 0; i < options.nVertices; i++ ){
  //       this.points.push(
  //         new Two.Anchor( center, -options.distanceOut + parseInt( step * i ) )
  //       );
  //     }

  //     [ 'roadOverhang', 'roadSideLines', 'roadCenter' ].forEach( function( name ){
  //       var curve = this[ name ] = two.makeCurve( this.points, true );
  //       curve.translation.set( 0, two.height/ 2 );
  //       curve.noFill();
  //     }.bind( this ));

  //     this.roadOverhang.stroke = options.roadColor;
  //     this.roadOverhang.linewidth = options.width;

  //     this.roadSideLines.stroke = options.lineColor;
  //     this.roadSideLines.linewidth = options.width - options.lineRoadOverhang;

  //     this.roadCenter.stroke = options.roadColor;
  //     this.roadCenter.linewidth = options.width - options.lineRoadOverhang - options.lineWidth;
  //   }

  // , initRoadLines: function(){
  //     var length = two.height / ( options.nRoadLines + options.gutter );

  //     this.lines = [];
  //     utils.range( options.nRoadLines ).forEach( function( i ){
  //       var dash = two.makeLine( 0, - length, 0, length );

  //       dash.noFill().stroke = '#fff';
  //       dash.linewidth = 3;
  //       dash.pct = i / ( options.nRoadLines - 1 );

  //       dash.translation.copy( this.points[i] ).addSelf( this.roadCenter.translation );
  //       this.lines.push( dash );
  //     }.bind( this ));
  //   }

  , update: function( canvas, frameCount, timeDelta ){
      var x = canvas.mid.x + this.bowAmount;
      canvas.ctx.beginPath();
      canvas.ctx.moveTo( x, -this.options.distanceOut );
      canvas.ctx.quadraticCurveTo(
        canvas.mid.x + (this.bowAmount * -1), canvas.mid.y
      , x, canvas.height + this.options.distanceOut
      );

      // Road parts
      for ( var i = 0, l = this.options.parts.length; i < l; ++i ){
        canvas.ctx.lineWidth = this.options.width - this.options.parts[ i ].woffset;
        canvas.ctx.strokeStyle = this.options.parts[ i ].color;
        canvas.ctx.stroke();
      }

      // Road lines
      canvas.ctx.setLineDash([50]);
      canvas.ctx.lineDashOffset = -(frameCount * 10) % 100;
      canvas.ctx.lineWidth = 6;
      canvas.ctx.strokeStyle = 'white';
      canvas.ctx.stroke();

      canvas.ctx.closePath();

      // Reset line dash
      canvas.ctx.setLineDash([]);
    }

  // , updateCenterLines: function( frameCount, timeDelta ){
  //     if ( !timeDelta ){
  //       return;
  //     }

  //     var line;
  //     for ( var i = 0, l = this.lines.length; i < l; ++i ){
  //       line = this.lines[i];
  //       // Assign the calculation of the vector on the road to `a`
  //       this.roadCenter.getPointAt( line.pct, a );
  //       // Get an arbitrary vector right behind `a` in order to get the
  //       // angle for the rotation of the line.
  //       this.roadCenter.getPointAt( line.pct - 0.01, b );
  //       line.translation.copy( a ).addSelf( this.roadCenter.translation );
  //       line.rotation = Two.Utils.angleBetween( a, b ) + Math.PI / 2;

  //       line.pct = utils.mod( line.pct + options.velocity, 1 );
  //     }
  //   }

  , bow: function( amount ){
      this.bowAmount = amount;
    }
  }).init();
};