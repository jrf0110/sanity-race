/**
 * Controls the overall game state
 * Basically an event emitter that will not emit
 * if the current state === to the transition state
 */

var utils = require('./utils');

var game = {
  current: null
, states: {}
};

game.isState = function( state ){
  return this.current === state;
};

game.state = function( state ){
  if ( this.current === state ) return this;

  this.emit( state, this.current, state, this );
  this.emit( [ this.current, state ].join(':'), this.current, state, this );
  this.current = state;

  return this;
};

game = module.exports = Object.create(
  game
, require('events').EventEmitter
);