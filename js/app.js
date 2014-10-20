window._    = require('lodash');

var TWEEN   = require('tween.js');
var utils   = require('./lib/utils');
var canvas  = require('./lib/canvas')();
var course  = require('./lib/course');
var loop    = require('./lib/loop');
var game    = require('./lib/game');
var score   = require('./lib/score');

var config  = window.config = require('./config');
var app     = window.app = window.app || {};
var uInput  = window.uInput = require('./lib/user-input');

app.input = uInput;
app.score = score;

game.on( 'start-screen', function(){
  app.flasher.msg('Sanity Race!');
  app.player.hide();
  course.reset();
  uInput.reset();
  uInput.disable();
  app.score.reset();
  setTimeout( game.state.bind( game, 'racing' ), 2000 );
});

game.on( 'racing', function(){
  uInput.enable();
  app.player.reset();
  app.player.show();
  app.flasher.hide();
  app.score.start();
});

game.on( 'death', function(){
  app.flasher.msg('Crashed!!');
  app.player.hide();
  app.score.stop();
  setTimeout( game.state.bind( game, 'start-screen' ), 2000 );
});

utils.domready( function(){
  app.road = require('./lib/road')({
    renderer:         canvas
  , width:            config.roadWidth
  , nVertices:        config.nVertices
  , nOutsideVertices: config.nOutsideVertices
  , variance:         config.variance
  });

  app.flasher = require('./lib/flasher')('.flasher');

  app.stats = require('./lib/stats')('[data-role="stats"]');

  app.player = require('./lib/player')({ renderer: canvas });
  
  game.state('start-screen');

  course.on( 'change', function( value ){
    app.road.bow( value );
  });

  var xDeath = [
    (window.innerWidth / 2) - (app.road.options.width / 2)
  , (window.innerWidth / 2) + (app.road.options.width / 2)
  ];

  loop.on( 'tick', function( i ){
    app.player.x += (uInput.hInput * config.hSpeed) + course.getForce();

    if ( game.isState('racing') )
    if ( app.player.x < xDeath[0] || app.player.x > xDeath[1] ){
      game.state('death');
    }

    app.stats.set( 'hInput', uInput.hInput );
    app.stats.set( 'score', score.value );
  });

  var tick = function( frameCount, timeDelta ){
    requestAnimationFrame(
      setTimeout.bind( null, tick.bind( null, ++frameCount ), 1000 / 60 )
    );

    canvas.clear();
    app.road.update( canvas, frameCount, timeDelta );
    app.player.update( canvas, frameCount, timeDelta );

    TWEEN.update();
  };

  requestAnimationFrame( tick.bind( null, 0 ) );
});