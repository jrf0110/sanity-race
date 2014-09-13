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
      this.polygon = options.renderer.makeCircle( 0, 0, this.size );
      this.polygon.fill = this.color;
      return this;
    }

  , update: function(){
      this.polygon.translation.set( this.x, this.y );
    }
  }).init();
};