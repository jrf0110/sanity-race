module.exports = function( options ){
  if ( !options.renderer ){
    throw new Error('Missing required property `renderer`');
  }

  return Object.create({
    x:    0
  , y:    150
  , size: 20
  , color: 'tomato'

  , init: function(){
      // this.polygon = options.renderer.makeCircle( 0, 0, this.size );
      // this.polygon.fill = this.color;
      return this;
    }

  , update: function( canvas, i, delta ){
      canvas.ctx.beginPath();
      canvas.ctx.moveTo( 0, 0 );
      canvas.circle( this.x, this.y, this.size, this.color );
      canvas.ctx.closePath();
    }

  , reset: function(){
      this.x = window.innerWidth / 2;
      this.y = window.innerHeight / 2;
      return this;
    }

  , show: function(){
      this.y = window.innerHeight / 2;
      return this;
    }

  , hide: function(){
      this.y = -1000;
      return this;
    }
  }).init();
};