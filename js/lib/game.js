/**
 * Controls the overall game state
 */

var utils = require('./utils');

var Inherit = [
  require('events').EventEmitter
];

var game = {
  current: null
, states: {}
};

// game.registerState = function( state, callback ){
//   game.states[ state ] = callback;
//   return this;
// };

game.isState = function( state ){
  return this.current === state;
};

game.state = function( state ){
  // if ( !game.states[ state ] ){
  //   throw new Error('Invalid state `' + state + '`');
  // }

  if ( this.current === state ) return this;

  this.emit( state, this.current, state, this );
  this.emit( [ this.current, state ].join(':'), this.current, state, this );
  this.current = state;

  return this;
};

Inherit.forEach( function( Ctr ){
  utils.extend( game, Ctr.prototype );
});

game = module.exports = Object.create( game );

Inherit.forEach( function( Ctr ){
  Ctr.call( game );
});