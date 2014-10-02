var EventEmitter = require('events').EventEmitter;
var config = require('../config');
var utils = require('./utils');

var uInput = {
  hInput: 0
, vInput: 0
, currT:  0
, rotationMultiplier: 10
, calibration: 0
// , calibration: 0.5

, onDeviceOrientation: function( e ){
    var value = e.beta;

    if ( value < 0 ){
      value = Math.max( value, -config.input.maxOffset );
    } else {
      value = Math.min( value, config.input.maxOffset );
    }

    this.hInput = value / config.input.maxOffset;

    this.emit( 'horizontal', this.hInput );
  }

, applyInputState: function( direction ){
    if ( direction === 'left' || direction === 'right' ){
      this.hInput = utils.easing.easeOutQuad(
        this.currT, 0, direction === 'left' ? -1 : 1, 2000
      );
    }

    this.currT += 10;
  }

, onLeftInputDown: function(){
    this.hInput = -1;
    this.emit( 'horizontal', this.hInput );
    // if ( !this.applyInputStateInterval ){
    //   this.currT = utils.easing.timings.easeOutQuad(
    //     this.hInput, 0, -1, 2000
    //   );

    //   this.applyInputStateInterval = setInterval(
    //     this.applyInputState.bind( this, 'left' ), 10
    //   );
    // }
  }

, onLeftInputUp: function(){
    this.hInput = 0;
    this.emit( 'horizontal', this.hInput );
    // if ( this.applyInputStateInterval ){
    //   clearInterval( this.applyInputStateInterval );
    // }
  }

, onRightInputDown: function(){
    this.hInput = 1;
    this.emit( 'horizontal', this.hInput );
    // if ( !this.applyInputStateInterval ){
    //   this.currT = utils.easing.timings.easeOutQuad(
    //     this.hInput, 0, 1, 2000
    //   );

    //   this.applyInputStateInterval = setTimeout(
    //     this.applyInputState.bind( this, 'right' ), 10
    //   );
    // }
  }

, onRightInputUp: function(){
    this.hInput = 0;
    this.emit( 'horizontal', this.hInput );
    // if ( this.applyInputStateInterval ){
    //   clearInterval( this.applyInputStateInterval );
    // }
  }
};

utils.extend( uInput, EventEmitter.prototype );
uInput = Object.create( uInput );
EventEmitter.call( uInput );

utils.key.bind( 'a', uInput.onLeftInputDown.bind( uInput ),   'keydown' );
utils.key.bind( 'a', uInput.onLeftInputUp.bind( uInput ),     'keyup' );
utils.key.bind( 'd', uInput.onRightInputDown.bind( uInput ),  'keydown' );
utils.key.bind( 'd', uInput.onRightInputUp.bind( uInput ),    'keyup' );

window.addEventListener(
  'deviceorientation'
, uInput.onDeviceOrientation.bind( uInput )
);

module.exports = uInput;