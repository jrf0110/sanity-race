/**
 * Score
 */

var loop = require('./loop');

var score = module.exports = Object.create({
  value: 0

, isListeningToLoop: false

, onLoopTick: function(){
    score.value++;
  }

, start: function(){
    if ( !this.isListeningToLoop ){
      loop.addListener( 'tick', this.onLoopTick );
      this.isListeningToLoop = true;
    }

    return true;
  }

, stop: function(){
    this.isListeningToLoop = false;
    loop.removeListener( 'tick', this.onLoopTick );
    return this;
  }

, reset: function(){
    this.value = 0;
    return this;
  }
});