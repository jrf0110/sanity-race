window._    = require('lodash');

var Two     = require('two.js');
var TWEEN   = require('tween.js');
var utils   = require('./lib/utils');
var course  = require('./lib/course');
var loop    = require('./lib/loop');

var config  = window.config = require('./config');
var app     = window.app = window.app || {};
var uInput  = window.uInput = require('./lib/user-input');

app.input = uInput;

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

  // app.stats = require('./lib/stats')('[data-role="stats"]');

  app.player = require('./lib/player')({ renderer: two });
  app.player.x = window.innerWidth / 2;
  app.player.y = window.innerHeight / 2;

  course.on( 'change', function( value ){
    app.road.bow( value );
  });

  // uInput.on( 'horizontal', function( value ){
  //   app.stats.set( 'hInput', value );
  // });

  loop.on( 'tick', function( i ){
    app.player.x += (uInput.hInput * config.hSpeed) + course.getForce();
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