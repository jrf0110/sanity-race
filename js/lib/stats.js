var events = require('events');
var utils = require('./utils');

module.exports = function( $el, options ){
  if ( typeof $el === 'string' ){
    $el = utils.dom( $el );
  }

  var stats = Object.create({
    attr: {}

  , render: function(){
      Object.keys( this.attr ).forEach( function( key ){
        $el.find('[data-key="' + key + '"] + dd').html( this.attr[ key ] );
      }.bind( this ));
    }

  , set: function( key, val ){
      if ( this.attr[ key ] === val ) return this;

      this.attr[ key ] = val;
      this.emit( 'change', key, val, this );
      this.emit( key + ':change', val, this );

      return this;
    }
  }, events.EventEmitter );

  stats.on( 'change', stats.render.bind( stats ) );

  return stats;
};