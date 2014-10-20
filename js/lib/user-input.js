var EventEmitter = require('events').EventEmitter;
var config = require('../config');
var utils = require('./utils');

var uInput = {
  hInput: 0
, vInput: 0
, currT:  0
, rotationMultiplier: 10
, calibration: 0
, isDisabled: false

, disable: function(){
    this.isDisabled = true;
    if ( this.tween ) this.tween.stop();
    return this;
  }

, enable: function(){
    this.isDisabled = false;
    if ( this.tween ) this.tween.start();
    return this;
  }

, reset: function(){
    if ( this.tween ) this.tween.stop();
    this.hInput = 0;
    this.vInput = 0;
  }

, tweenTo: function( value ){
    if ( this.isDisabled ) return;
    if ( this.tween ) this.tween.stop();

    this.tween = new utils.Tween( this )
      .to( { hInput: value }, 500 )
      .easing( utils.Easing.Quadratic.In )
      .onUpdate( function(){
        uInput.emit( 'horizontal', this.hInput, uInput );
      })
      .start();

    return this;
  }

, onDeviceOrientation: function( e ){
    var value = e.beta;

    if ( value < 0 ){
      value = Math.max( value, -config.input.maxOffset );
    } else {
      value = Math.min( value, config.input.maxOffset );
    }

    this.hInput = value / config.input.maxOffset;

    this.emit( 'horizontal', this.hInput, uInput );
  }

, onLeftInputDown: function(){
    if ( this.leftDown ) return;

    this.leftDown = true;
    this.tweenTo(-1);
  }

, onLeftInputUp: function(){
    this.leftDown = false;
    this.tweenTo(0);
  }

, onRightInputDown: function(){
    if ( this.rightDown ) return;

    this.rightDown = true;
    this.tweenTo(1);
  }

, onRightInputUp: function(){
    this.rightDown = false;
    this.tweenTo(0);
  }
};

utils.extend( uInput, EventEmitter.prototype );
uInput = Object.create( uInput );
EventEmitter.call( uInput );

utils.key.bind( 'a', uInput.onLeftInputDown.bind( uInput ),   'keydown' );
utils.key.bind( 'a', uInput.onLeftInputUp.bind( uInput ),     'keyup' );
utils.key.bind( 'd', uInput.onRightInputDown.bind( uInput ),  'keydown' );
utils.key.bind( 'd', uInput.onRightInputUp.bind( uInput ),    'keyup' );

// Only add device orientation if it's a device that likely
// supports free rotation
var deviceCheck = function( e ){
  if ( e.alpha ){
    window.addEventListener(
      'deviceorientation'
    , uInput.onDeviceOrientation.bind( uInput )
    );
  }

  window.removeEventListener( deviceCheck );
};

window.addEventListener(
  'deviceorientation', deviceCheck
);

module.exports = uInput;