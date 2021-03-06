module.exports = {
  // Rotation limiter increases the alpha value from user input
  // as a factor of rl
  rl: 5

  // Initial Modifier for user input - so start at the center
, im: 180

, roadWidth: 220

  // Number of vertices in the track
, nVertices: 12

  // Number of vertices outside the track
  // NOTE: needs to be an even number (n/2 for top, n/2 for bottom)
, nOutsideVertices: 6

  // Max horizontal distance between two vertices
, variance: 150

, hSpeed: 5.1

, logicLoopInterval: 24

, input: {
    maxOffset: 10
  , timeToMax: 1000
  }
};