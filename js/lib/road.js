var TWEEN = require('tween.js');
var utils = require('./utils');

module.exports = function( options ){
  if ( !options.renderer ){
    throw new Error('Missing required property `renderer`');
  }

  utils.defaults( options, {
    nRoadLines: 8
  });

  var getStep = function(){
    return window.innerHeight / ( options.nVertices - options.nOutsideVertices );
  };

  var getRoadLineStep = function( nVertices, nOutside ){
    return window.innerHeight / ( nVertices - nOutside );
  };

  return Object.create({
    init: function(){
      this.initMainPolygon();
      this.initRoadLines();

      this.bow(0);

      return this;
    }

  , initMainPolygon: function(){
      this.points = [ 1, 2 ].map( function( x ){
        return utils.range( options.nVertices ).map( function( a ){
          return new Two.Anchor( 0, getStep() * (a - (options.nOutsideVertices / 2) ) );
        });
      }.bind( this ));

      // Reverse the second side to make the points line up more nicely
      var pPoints = [
        this.points[0], this.points[1].slice().reverse()
      ].flatten();

      this.points = this.points.flatten();
      this.polygon = new Two.Polygon( pPoints, true, true );

      this.polygon.fill       = '#555';
      this.polygon.linewidth  = 10;
      this.polygon.stroke     = 'yellow';

      options.renderer.add( this.polygon );
    }

  , initRoadLines: function(){
      this.rli = 0;
      this.centerLines = new Two.Group();

      var center = window.innerWidth / 2;
      var step = getRoadLineStep( options.nRoadLines * 4, 4 );

      this.centerLinePoints = utils.range(
        // 3 points per line, 1 more for spacing
        // options.nRoadLines * ( 3 + 1 )
        options.nVertices
      ).map( function( i ){
        return new Two.Anchor( center, getStep() * (i - (options.nOutsideVertices / 2) ) );
      });

      this.centerLinePoints.forEach( function( vertex, i, points ){
        if ( i % 4  !== 0 ) return;

        var line = new Two.Polygon( points.slice( i, i + 3 ) );
        line.noFill();
        line.lineWidth = 6;
        line.stroke = 'yellow';

        this.centerLines.add( line );
      }.bind( this ));

      options.renderer.add( this.centerLines );
    }

  , update: function(){
      var step = getStep();
      this.centerLinesPoints.forEach( function( vertex, vi, points ){
        vertex.y = step * (vi - (options.nOutsideVertices / 2) );
        vertex.y *= this.rli * 2
      });

      if ( ++this.rli === 4 ) this.rli = 0;
    }


  , bow: function( amount ){
      this.bowAmount = amount;

      utils.bowPoints(
        this.points.slice( 0, this.points.length / 2 )
      , amount
      , ( window.innerWidth / 2 ) - ( options.width / 2 )
      );

      utils.bowPoints(
        this.points.slice( this.points.length / 2 )
      , amount
      , ( window.innerWidth / 2 ) - ( options.width / 2 ) + options.width
      );

      utils.bowPoints( this.centerLinePoints, amount );
    }
  }).init();
};