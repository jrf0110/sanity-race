window._    = require('lodash');

var Two     = require('two.js');
var TWEEN   = require('tween.js');
var utils   = require('./lib/utils');
var course  = require('./lib/course');
var loop    = require('./lib/loop');
var game    = require('./lib/game');

var config  = window.config = require('./config');
var app     = window.app = window.app || {};
var uInput  = window.uInput = require('./lib/user-input');

app.input = uInput;

app.reset = function(){
  app.player.reset();
  course.reset();
  app.flasher.hide();
};

game.on( 'start-screen', function(){
  app.flasher.msg('Sanity Race!');
  app.player.hide();
  course.reset();
  setTimeout( game.state.bind( game, 'racing' ), 2000 );
});

game.on( 'racing', function(){
  app.player.reset();
  app.player.show();
  app.flasher.hide();
});

game.on( 'death', function(){
  app.flasher.msg('Crashed!!');
  app.player.hide();
  setTimeout( game.state.bind( game, 'start-screen' ), 2000 );
});

utils.domready( function(){
  var two = window.two = new Two({
    fullscreen: true
  , type: Two.Types.canvas
  }).appendTo( document.body );

  app.road = require('./lib/road')({
    renderer:         two
  , width:            config.roadWidth
  , nVertices:        config.nVertices
  , nOutsideVertices: config.nOutsideVertices
  , variance:         config.variance
  });

  app.flasher = require('./lib/flasher')('.flasher');

  app.stats = require('./lib/stats')('[data-role="stats"]');

  app.player = require('./lib/player')({ renderer: two });
  
  game.state('start-screen');

  course.on( 'change', function( value ){
    app.road.bow( value );
  });

  uInput.on( 'horizontal', function( value ){
    app.stats.set( 'hInput', value );
  });

  var xDeath = [
    (window.innerWidth / 2) - (config.roadWidth / 2)
  , (window.innerWidth / 2) + (config.roadWidth / 2)
  ];

  loop.on( 'tick', function( i ){
    app.player.x += (uInput.hInput * config.hSpeed) + course.getForce();

    if ( game.isState('racing') )
    if ( app.player.x < xDeath[0] || app.player.x > xDeath[1] ){
      game.state('death');
    }
  });

  var tick = function( frameCount, timeDelta ){
    requestAnimationFrame( tick.bind( null, frameCount++ ) );

    app.road.update( frameCount, timeDelta );
    app.player.update( frameCount, timeDelta );

    two.update();
    TWEEN.update();
  };

  requestAnimationFrame( tick.bind( null, 0 ) );
});