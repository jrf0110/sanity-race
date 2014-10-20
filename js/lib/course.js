var EventEmitter = require('events').EventEmitter;
var TWEEN = require('tween.js');
var utils = require('./utils');

var course = {};

course.difficulty = 1;
course.curvature = 0;

course.getForce = function(){
  return this.curvature * -0.035;
};

course.reset = function(){
  if ( this.interval ){
    clearInterval( this.interval );
    this.interval = null;
  }

  if ( this.tween ) this.tween.stop();

  this.interval = setInterval( function(){
    course.tween = new TWEEN.Tween( course )
                    .to({ curvature: utils.random( -150, 150 ) }, 1000 )
                    .onUpdate( function(){
                      course.emit( 'change', this.curvature, course );
                    })
                    .start();
  }, 5000 );

  this.curvature = 0;
  course.emit( 'change', this.curvature, course );
};

utils.extend( course, EventEmitter.prototype );
course = module.exports = Object.create( course );
EventEmitter.call( course );