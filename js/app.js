window._ = require('lodash');

var Two = require('two.js');
var TWEEN = require('tween.js');
var utils = require('./lib/utils');
var app = window.app = window.app || {};
var uInput = window.uInput = require('./lib/user-input');

var config = window.config = {
  // Rotation limiter increases the alpha value from user input
  // as a factor of rl
  rl: 5

  // Initial Modifier for user input - so start at the center
, im: 180

, nRoadCurves: 2
, roadWidth: 250

  // Number of vertices in the track
, nVertices: 4

  // Number of vertices outside the track
  // NOTE: needs to be an even number (n/2 for top, n/2 for bottom)
, nOutsideVertices: 2

  // Max horizontal distance between two vertices
, variance: 100
};

app.views = {
  steeringWheel: require('./lib/steering-wheel')
};

app.input = uInput;

var player = Object.create({
  x: 0
, y: 150

, $el: utils.dom('<div />').css({
    width: '20px'
  , height: '20px'
  , background: 'tomato'
  , borderRadius: '20px'
  , position: 'fixed'
  , top: 0
  , left: 0
  , transition: 'transform 0.1s linear'
  })

, render: function(){
    this.$el.css( 'transform', 'translate3d( ' + [
      this.x + 'px', this.y + 'px', 0
    ].join(', ') + ')' );

    return this;
  }
});

var getStep = function(){
  return window.innerHeight / ( config.nVertices - config.nOutsideVertices );
};

utils.domready( function(){
  var two = window.two = new Two({
    fullscreen: true
  , type: Two.Types.svg
  }).appendTo( document.body );

  var prevX = (window.innerWidth / 2) - (config.roadWidth / 2);

  var points = utils.range( config.nVertices ).map( function( x, i ){
    var anchor = {
      x: utils.random( prevX - (config.variance / 2), prevX + (config.variance / 2) )
    , y: getStep() * (i - (config.nOutsideVertices / 2) )
    };

    prevX = anchor.x;

    return anchor;
  });

  var roadCurves = utils.range( config.nRoadCurves ).map( function( x, i ){
    return new Two.Polygon(
      points.map( function( a ){
        return new Two.Anchor( a.x + (i * config.roadWidth), a.y );
      })
    , false
    , true
    );
  });

  var numTweensComplete = 0;
  var onTweenComplete = function(){
    numTweensComplete++;
  };

  var getTweenFromVertex = function( v, i, vertices ){
    var to, step = getStep();

    if ( i === vertices.length - 1 ){
      to = { x: v.x, y: v.y + step };
    } else {
      to = {
        x: vertices[ i + 1 ].x
      , y: vertices[ i + 1 ].y
      };
    }

    return new TWEEN.Tween({ x: v.x, y: v.y })
      .to( to, 250 )
      // .easing( TWEEN.Easing.Linear.None )
      .onUpdate( function(){
        v.y = this.y;
      })
      .onComplete( onTweenComplete );
  };

  var tweens = [];
  roadCurves.forEach( function( curve, i ){
    curve.noFill().linewidth = 10; 
    curve.stroke = 'tomato';
    two.add( curve );

    tweens = tweens.concat( curve.vertices.map( getTweenFromVertex ) );
  });

  var tick = function( t ){
    requestAnimationFrame( tick );

    if ( numTweensComplete === tweens.length ){
      var prevX = roadCurves[0].vertices[0].x;
      var anchor = {
        x: utils.random( prevX - (config.variance / 2), prevX + (config.variance / 2) )
      , y: getStep() * (0 - (config.nOutsideVertices / 2) )
      };

      tweens = [];
      roadCurves.forEach( function( curve, i ){
        curve.vertices.pop();
        curve.vertices.unshift( new Two.Anchor( anchor.x + (i * config.roadWidth), anchor.y ) );
        tweens = tweens.concat( curve.vertices.map( getTweenFromVertex ) );
      });

      utils.invoke( tweens, 'start' );

      numTweensComplete = 0;
    }

    player.render();
    two.update();
    TWEEN.update();
  };

  utils.dom(document.body).append( player.$el );

  uInput.on( 'horizontal', function( value ){
    var pos = ( ( ( value * config.rl ) + config.im ) % 360 ) / 360;
    player.x = pos * window.innerWidth;
  });

  utils.invoke( tweens, 'start' );
  requestAnimationFrame( tick );
});