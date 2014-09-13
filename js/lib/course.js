var EventEmitter = require('events').EventEmitter;
var TWEEN = require('tween.js');
var utils = require('./utils');

var course = {};

course.curvature = 0;

setInterval( function(){
  course.tween = new TWEEN.Tween( course )
                  .to({ curvature: utils.random( -150, 150 ) }, 2800 )
                  .onUpdate( function(){
                    course.emit( 'change', this.curvature, course );
                  })
                  .start();
}, 5000 );

// course.getForce = function(){
//   return Math.sqrt(
//     this.curvature < 0 ? (this.curvature * -1) : this.curvature
//   ) * 0.5 * (this.curvature < 0 ? 1 : -1);
// };

course.getForce = function(){
  return this.curvature * -0.04;
};

utils.extend( course, EventEmitter.prototype );
course = module.exports = Object.create( course );
EventEmitter.call( course );