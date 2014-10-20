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

  return Object.create({
    init: function(){
      this.options = options;
      this.bow(0);
      return this;
    }

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

  , bow: function( amount ){
      this.bowAmount = amount;
    }
  }).init();
};