var utils = require('./utils');
var cid   = 1;

module.exports = function( options ){
  options = utils.defaults( options || {}, {
    id:     'canvas-' + cid++
  , width:  window.innerWidth
  , height: window.innerHeight
  });

  var canvas  = document.createElement('canvas');
  canvas.id   = options.id;

  return Object.create({
    el:     canvas
  , width:  options.width
  , height: options.height
  , ctx:    canvas.getContext('2d')
  , mid:    { x: parseInt( options.width / 2 )
            , y: parseInt( options.height / 2 )
            }

  , init: function(){
      document.addEventListener( 'DOMContentLoaded', function(){
        canvas.width        = this.width;
        canvas.height       = this.height;
        canvas.style.width  = this.width  + 'px';
        canvas.style.height = this.height + 'px';

        canvas.style.position = 'fixed';
        canvas.style.top      = 0;
        canvas.style.left     = 0;
        canvas.style.zIndex   = 1;
        document.body.appendChild( canvas );
      }.bind( this ));

      return this;
    }

  , clear: function(){
      this.ctx.clearRect( 0, 0, this.width, this.height );
      this.ctx.beginPath();
      this.ctx.moveTo( 0, 0 );
      return this;
    }

  , circle: function( x, y, radius, color ){
      this.ctx.arc( x, y, radius, 0, Math.PI * 2, true );
      if ( color ) this.ctx.fillStyle = color;
      this.ctx.fill();
      return this;
    }
  }).init();
};