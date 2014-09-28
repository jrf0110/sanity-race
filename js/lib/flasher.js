var utils = require('./utils');

module.exports = function( $el, options ){
  if ( typeof $el === 'string' ){
    $el = utils.dom( $el );
  }

  options = utils.defaults( options || {}, {
    msgTimeTillRemoval: 1000
  });

  return Object.create({
    $el: $el

  , init: function(){
      return this;
    }

  , msg: function( text ){
      this.hide();

      var $msg = utils.dom('<div class="msg out" />').html( text );
      $el.append( $msg );

      $msg.css({
        marginTop:  -($msg.height() / 2) + 'px'
      , marginLeft: -($msg.width() / 2) + 'px'
      });

      setTimeout( $msg.removeClass.bind( $msg, 'out' ), 1 );

      return this;
    }

  , hide: function(){
      var $old = $el.find('> .msg').addClass('out');
      setTimeout( $old.remove.bind( $old ), options.msgTimeTillRemoval );
      return this;
    }
  }).init();
};