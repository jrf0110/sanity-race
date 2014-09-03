var utils = require('./utils');

module.exports = function( el, options ){
  var $el = utils.dom( el );

  return Object.create({
    render: function(){

    }

  , rotate: function( degrees ){
      $el.css( 'transform', 'rotate( ' + degrees + 'deg )' );
      return this;
    }

  , rotateWithUserInput: function( value ){
      
    }
  });
};