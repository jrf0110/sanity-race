/**
 * Game logic loop - slower than the the animation loop
 * Put logic here that doesn't need to be calculated at
 * the same resolution as animations
 */

var EventEmitter  = require('events').EventEmitter;
var config        = require('../config');

var loop = module.exports = new EventEmitter();
loop.i = 0;

loop.interval = setInterval(
  function(){
    loop.emit( 'tick', loop.i++, loop );
  }
, config.logicLoopInterval
);