window._ = require('lodash');

var Two = require('two.js');
var TWEEN = require('tween.js');
var utils = require('./lib/utils');
var player = require('./lib/player');
var road = require('./lib/road');
var course = require('./lib/course');
var config = window.config = require('./config');
var app = window.app = window.app || {};
var uInput = window.uInput = require('./lib/user-input');

app.input = uInput;

utils.domready( function(){
  var two = window.two = new Two({
    fullscreen: true
  , type: Two.Types.svg
  }).appendTo( document.body );

  app.road = road({
    renderer:         two
  , width:            config.roadWidth
  , nVertices:        config.nVertices
  , nOutsideVertices: config.nOutsideVertices
  , variance:         config.variance
  });

  app.player = player({ renderer: two });
  app.player.x = window.innerWidth / 2;

  course.on( 'change', function( value ){
    app.road.bow( value );
  });

  var tick = function( t ){
    requestAnimationFrame( tick );

    app.player.x += (uInput.hInput * config.hSpeed) + course.getForce();

    app.road.update();
    app.player.update();

    two.update();
    TWEEN.update();
  };

  requestAnimationFrame( tick );
});